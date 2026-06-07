import OpenAI from 'openai';

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

/**
 * Check if a user is allowed to use AI features.
 * Currently always returns true.
 *
 * When payment infrastructure is added, this function should:
 * 1. Accept a userId parameter
 * 2. Check Supabase for an active subscription
 * 3. Check usage limits (e.g., 10 AI generations per month on free tier)
 * 4. Return { allowed: boolean; reason?: string }
 */
export async function checkAIAccess(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  // TODO: Replace with actual subscription check
  return { allowed: true };
}
