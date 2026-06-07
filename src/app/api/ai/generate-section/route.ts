import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getOpenAIClient, checkAIAccess } from '@/lib/ai/openai';
import { buildDefinitionsPrompt, buildArticlesPrompt } from '@/lib/ai/prompts';
import type { ContractCategory } from '@/lib/contracts/types';

const VALID_CATEGORIES = [
  'service_agreement', 'nda', 'employment', 'rental', 'loan',
  'sales', 'license', 'partnership', 'consulting', 'freelance', 'general',
];

const VALID_CLAUSE_TYPES = [
  'standard', 'recital', 'definition', 'obligation', 'right', 'condition',
  'warranty', 'indemnity', 'limitation', 'termination', 'confidential',
  'dispute', 'general', 'signature',
];

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

    // 2. Check AI access
    const access = await checkAIAccess(user.id);
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason || 'AI features not available', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // 3. Parse request
    const body = await request.json();
    const { section, contractContext, instruction } = body;

    if (!section || !contractContext) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    if (section !== 'definitions' && section !== 'articles') {
      return NextResponse.json(
        { error: 'Invalid section. Must be "definitions" or "articles"', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    // 4. Build prompt based on section
    const openai = getOpenAIClient();
    let prompt: string;
    const category = (VALID_CATEGORIES.includes(contractContext.category) ? contractContext.category : 'general') as ContractCategory;

    if (section === 'definitions') {
      const articlesSummary = contractContext.articles
        ?.map((a: any) => `Article ${a.number}: ${a.title} (${a.clauses?.length || 0} clauses)`)
        .join('\n') || 'No articles yet';
      prompt = buildDefinitionsPrompt(contractContext.title || 'Untitled Contract', category, articlesSummary);
    } else {
      const defSummary = contractContext.definitions?.terms
        ?.map((d: any) => `"${d.term}": ${d.definition}`)
        .join('\n') || 'No definitions';
      const artSummary = contractContext.articles
        ?.map((a: any) => `Article ${a.number}: ${a.title} - ${a.clauses?.map((c: any) => c.title).join(', ')}`)
        .join('\n') || 'No existing articles';
      prompt = buildArticlesPrompt(contractContext.title || 'Untitled Contract', category, defSummary, artSummary, instruction);
    }

    // 5. Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 3000,
      messages: [
        { role: 'system', content: 'You are a legal contract assistant. Output ONLY valid JSON as specified in the user message.' },
        { role: 'user', content: prompt },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'AI did not generate a response. Please try again.', code: 'EMPTY_RESPONSE' },
        { status: 502 }
      );
    }

    // 6. Parse and validate
    let result: any;
    try {
      result = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: 'AI generated invalid JSON. Please try again.', code: 'INVALID_JSON' },
        { status: 502 }
      );
    }

    // 7. Sanitize section output
    if (section === 'definitions') {
      const definitions = result.definitions || result;
      if (!Array.isArray(definitions)) {
        return NextResponse.json(
          { error: 'AI generated invalid definitions structure', code: 'INVALID_STRUCTURE' },
          { status: 502 }
        );
      }
      return NextResponse.json({ definitions });
    } else {
      const articles = result.articles || result;
      if (!Array.isArray(articles)) {
        return NextResponse.json(
          { error: 'AI generated invalid articles structure', code: 'INVALID_STRUCTURE' },
          { status: 502 }
        );
      }
      // Sanitize clause types
      for (const article of articles) {
        if (Array.isArray(article.clauses)) {
          for (const clause of article.clauses) {
            if (!VALID_CLAUSE_TYPES.includes(clause.type)) {
              clause.type = 'standard';
            }
          }
        }
      }
      return NextResponse.json({ articles });
    }

  } catch (error: any) {
    console.error('Section generation error:', error);

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.', code: 'RATE_LIMITED' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate section. Please try again.', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
