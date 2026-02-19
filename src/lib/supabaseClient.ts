import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function createClient() {
    if (!browserClient) {
        browserClient = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                    // Use implicit flow - PKCE requires the verifier which gets lost on redirects
                    flowType: 'implicit'
                }
            }
        )
    }

    return browserClient
}

// Clear the cached client (useful for testing or sign out)
export function clearClient() {
    browserClient = null
}