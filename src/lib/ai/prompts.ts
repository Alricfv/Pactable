import type { ContractCategory } from '@/lib/contracts/types';

export const CONTRACT_JSON_SCHEMA = `{
  "title": "string (e.g., 'MUTUAL NON-DISCLOSURE AGREEMENT')",
  "category": "one of: service_agreement | nda | employment | rental | loan | sales | license | partnership | consulting | freelance | general",
  "metadata": {
    "version": "1.0.0",
    "language": "en",
    "jurisdiction": "string or empty",
    "createdAt": "",
    "updatedAt": ""
  },
  "preamble": {
    "date": "",
    "introText": "string (e.g., 'This Agreement is entered into as of the date last signed below...')"
  },
  "recitals": {
    "enabled": boolean,
    "introText": "RECITALS",
    "items": ["string WHEREAS clause", ...]
  },
  "definitions": {
    "enabled": boolean,
    "terms": [
      { "term": "string", "definition": "string (starts with 'means...')" }
    ]
  },
  "articles": [
    {
      "id": "art_N",
      "number": "N",
      "title": "string (UPPERCASE)",
      "clauses": [
        {
          "id": "cl_N_M",
          "number": "N.M",
          "type": "one of: standard | obligation | right | condition | warranty | indemnity | limitation | termination | confidential | dispute | general",
          "title": "string",
          "terms": [
            {
              "id": "t_N_M_K",
              "text": "string (the actual legal clause text)",
              "isEditable": true,
              "required": boolean
            }
          ],
          "isRequired": boolean,
          "isEditable": true
        }
      ]
    }
  ],
  "generalProvisions": {
    "entireAgreement": boolean,
    "amendments": boolean,
    "severability": boolean,
    "waiver": boolean,
    "notices": boolean,
    "assignment": boolean,
    "counterparts": boolean,
    "headings": boolean,
    "governingLaw": { "enabled": boolean, "jurisdiction": "string" },
    "disputeResolution": { "enabled": boolean, "method": "arbitration | mediation | litigation", "venue": "string" }
  },
  "signatures": {
    "introText": "IN WITNESS WHEREOF, the parties have executed this Agreement as of the date last signed below.",
    "witnessRequired": boolean,
    "notarizationRequired": boolean
  },
  "attachments": []
}`;

export function buildFullContractSystemPrompt(): string {
  return `You are a professional legal contract drafting assistant. You generate legally-sound contract structures in JSON format.

CRITICAL RULES:
1. You MUST output ONLY valid JSON. No markdown, no code fences, no explanation text.
2. The JSON must conform EXACTLY to the schema below.
3. Do NOT include "parties" array — parties are added separately by the user.
4. Do NOT include "id" or "status" fields at the root level.
5. Use professional legal language appropriate for the contract type.
6. Generate comprehensive articles with detailed clauses covering all aspects the user described.
7. Use placeholder syntax like [AMOUNT], [DATE], [DURATION], [PARTY_NAME] for user-fillable values. Mark those terms with "isEditable": true and "required": true.
8. Each article should have 1-4 clauses. Each clause should have 1-3 terms.
9. Generate IDs in the pattern: art_1, cl_1_1, t_1_1_1 (matching the numbering).
10. The "number" fields must be sequential: articles "1", "2", "3"... clauses "1.1", "1.2"...
11. Set appropriate clause types (obligation, right, warranty, termination, etc.) based on content.
12. Always enable generalProvisions with sensible defaults for the contract type.
13. If the user mentions a jurisdiction, set it in generalProvisions.governingLaw.
14. Generate at least 3 articles for simple contracts, 5+ for complex ones.
15. Include relevant recitals (WHEREAS clauses) when appropriate for the contract type.
16. Include relevant definitions for key legal terms used in the contract.

JSON SCHEMA:
${CONTRACT_JSON_SCHEMA}`;
}

export function buildFullContractUserPrompt(userDescription: string): string {
  return `Generate a complete contract JSON for the following request:

${userDescription}

Remember: Output ONLY the JSON object. No "parties", no root "id", no root "status".`;
}

export function buildDefinitionsPrompt(
  contractTitle: string,
  category: ContractCategory,
  existingArticles: string
): string {
  return `You are a legal contract assistant. Given the following contract context, generate appropriate legal definitions.

Contract: ${contractTitle}
Category: ${category}
Existing articles/clauses summary:
${existingArticles}

Output ONLY a JSON object with a "definitions" key containing an array of definition objects:
{"definitions": [{ "term": "string", "definition": "string (starts with 'means...')" }]}

Generate 4-8 definitions that are relevant to the contract's articles and clauses. Include standard legal definitions (e.g., "Agreement", "Effective Date", "Confidential Information") plus domain-specific ones based on the contract content.

Output ONLY the JSON object. No markdown, no explanation.`;
}

export function buildArticlesPrompt(
  contractTitle: string,
  category: ContractCategory,
  existingDefinitions: string,
  existingArticles: string,
  userInstruction?: string
): string {
  return `You are a legal contract assistant. Generate or regenerate the articles and clauses for a contract.

Contract: ${contractTitle}
Category: ${category}
Current definitions: ${existingDefinitions}
Current articles: ${existingArticles}
${userInstruction ? `User instruction: ${userInstruction}` : 'Regenerate the articles with improved, comprehensive legal language.'}

Output ONLY a JSON object with an "articles" key containing an array of article objects:
{"articles": [{
  "id": "art_N",
  "number": "N",
  "title": "string",
  "clauses": [{
    "id": "cl_N_M",
    "number": "N.M",
    "type": "standard | obligation | right | condition | warranty | indemnity | limitation | termination | confidential | dispute | general",
    "title": "string",
    "terms": [{ "id": "t_N_M_K", "text": "string", "isEditable": true, "required": false }],
    "isRequired": true,
    "isEditable": true
  }]
}]}

Use placeholder syntax like [AMOUNT], [DATE] for user-fillable values.
Generate sequential IDs: art_1, cl_1_1, t_1_1_1.

Output ONLY the JSON object. No markdown, no explanation.`;
}
