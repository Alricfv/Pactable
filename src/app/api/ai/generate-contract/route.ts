import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getOpenAIClient, checkAIAccess } from '@/lib/ai/openai';
import { buildFullContractSystemPrompt, buildFullContractUserPrompt } from '@/lib/ai/prompts';

const VALID_CATEGORIES = [
  'service_agreement', 'nda', 'employment', 'rental', 'loan',
  'sales', 'license', 'partnership', 'consulting', 'freelance', 'general',
];

const VALID_CLAUSE_TYPES = [
  'standard', 'recital', 'definition', 'obligation', 'right', 'condition',
  'warranty', 'indemnity', 'limitation', 'termination', 'confidential',
  'dispute', 'general', 'signature',
];

function sanitizeContractStructure(data: any): any {
  // Strip fields the app manages
  const { id, status, parties, ...rest } = data;

  // Default category
  if (!rest.category || !VALID_CATEGORIES.includes(rest.category)) {
    rest.category = 'general';
  }

  // Ensure metadata exists
  rest.metadata = {
    version: '1.0.0',
    language: 'en',
    jurisdiction: '',
    createdAt: '',
    updatedAt: '',
    ...rest.metadata,
  };

  // Ensure preamble
  rest.preamble = {
    date: '',
    introText: '',
    ...rest.preamble,
  };

  // Ensure recitals
  rest.recitals = {
    enabled: false,
    introText: 'RECITALS',
    items: [],
    ...rest.recitals,
  };

  // Ensure definitions
  rest.definitions = {
    enabled: false,
    terms: [],
    ...rest.definitions,
  };

  // Ensure articles array and sanitize clause types
  if (!Array.isArray(rest.articles)) {
    rest.articles = [];
  }
  for (const article of rest.articles) {
    if (!Array.isArray(article.clauses)) {
      article.clauses = [];
    }
    for (const clause of article.clauses) {
      if (!VALID_CLAUSE_TYPES.includes(clause.type)) {
        clause.type = 'standard';
      }
      if (!Array.isArray(clause.terms)) {
        clause.terms = [];
      }
    }
  }

  // Ensure generalProvisions
  rest.generalProvisions = {
    entireAgreement: true,
    amendments: true,
    severability: true,
    waiver: true,
    notices: true,
    assignment: true,
    counterparts: true,
    headings: true,
    governingLaw: { enabled: false, jurisdiction: '' },
    disputeResolution: { enabled: false, method: 'litigation', venue: '' },
    ...rest.generalProvisions,
  };

  // Ensure signatures
  rest.signatures = {
    introText: 'IN WITNESS WHEREOF, the parties have executed this Agreement as of the date last signed below.',
    witnessRequired: false,
    notarizationRequired: false,
    ...rest.signatures,
  };

  // Ensure attachments
  if (!Array.isArray(rest.attachments)) {
    rest.attachments = [];
  }

  return rest;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate via Bearer token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired session', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // 2. Check AI access (subscription gate)
    const access = await checkAIAccess(user.id);
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason || 'AI features not available', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // 3. Parse and validate request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide a description of at least 10 characters', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: 'Description must be under 2000 characters', code: 'INPUT_TOO_LONG' },
        { status: 400 }
      );
    }

    // 4. Call OpenAI
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: buildFullContractSystemPrompt() },
        { role: 'user', content: buildFullContractUserPrompt(prompt.trim()) },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'AI did not generate a response. Please try again.', code: 'EMPTY_RESPONSE' },
        { status: 502 }
      );
    }

    // 5. Parse JSON
    let contractData: any;
    try {
      contractData = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: 'AI generated invalid JSON. Please try again.', code: 'INVALID_JSON' },
        { status: 502 }
      );
    }

    // 6. Validate basic structure
    if (!contractData.title || !contractData.articles || !Array.isArray(contractData.articles)) {
      return NextResponse.json(
        { error: 'AI generated an incomplete contract structure. Please try again.', code: 'INVALID_STRUCTURE' },
        { status: 502 }
      );
    }

    // 7. Sanitize and return
    const sanitized = sanitizeContractStructure(contractData);
    return NextResponse.json({ contract: sanitized });

  } catch (error: any) {
    console.error('Contract generation error:', error);

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.', code: 'RATE_LIMITED' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate contract. Please try again.', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
