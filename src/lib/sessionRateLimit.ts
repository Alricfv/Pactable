class SessionRateLimit {
  private lastCheck: number = 0
  private minInterval: number = 1000 // Minimum 1 second between checks
  private checkPromise: Promise<any> | null = null

  async checkSession(supabase: any): Promise<{ session: any; user: any }> {
    const now = Date.now()
    
    // If we just checked recently, return the cached promise
    if (this.checkPromise && (now - this.lastCheck) < this.minInterval) {
      return this.checkPromise
    }

    // Create new check promise
    this.checkPromise = this.performCheck(supabase)
    this.lastCheck = now

    return this.checkPromise
  }

  private async performCheck(supabase: any) {
    try {
      const [sessionResult, userResult] = await Promise.all([
        supabase.auth.getSession(),
        supabase.auth.getUser()
      ])

      return {
        session: sessionResult.data.session,
        user: userResult.data.user
      }
    } catch (error) {
      console.error('Session check error:', error)
      throw error
    }
  }
}

export const sessionRateLimit = new SessionRateLimit()