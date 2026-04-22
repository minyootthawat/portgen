import { createClient } from '@supabase/supabase-js'
import type { Portfolio, Profile, Subscription } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null!

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/api/auth/callback` },
  })
}

export async function signInWithGithub() {
  return supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: `${window.location.origin}/api/auth/callback` },
  })
}

export async function signInWithMagicLink(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  return supabase.auth.getSession()
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

// ─── Portfolios ──────────────────────────────────────────────────────────────

export async function getPortfolios(userId: string) {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .order('updated_at', { ascending: false })
  return { data, error }
}

export async function getPortfolio(id: string) {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function getPortfolioBySubdomain(subdomain: string) {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('subdomain', subdomain)
    .eq('is_published', true)
    .single()
  return { data, error }
}

export async function createPortfolio(portfolio: Partial<Portfolio>) {
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData?.session) throw new Error('Not authenticated')

  // Generate subdomain from name
  const { data: subdomainData } = await supabase.rpc('generate_subdomain', {
    base_name: portfolio.name || 'portfolio',
  })
  const subdomain = subdomainData || 'portfolio'

  // Generate slug
  const slug = `${Date.now()}-${subdomain}`

  const { data, error } = await supabase
    .from('portfolios')
    .insert({
      ...portfolio,
      user_id: sessionData.session.user.id,
      subdomain,
      slug,
    })
    .select()
    .single()
  return { data, error }
}

export async function updatePortfolio(id: string, updates: Partial<Portfolio>) {
  const { data, error } = await supabase
    .from('portfolios')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deletePortfolio(id: string) {
  // Soft delete
  const { data, error } = await supabase
    .from('portfolios')
    .update({ is_deleted: true })
    .eq('id', id)
  return { data, error }
}

export async function publishPortfolio(id: string) {
  const { data, error } = await supabase
    .from('portfolios')
    .update({ is_published: true, published_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function checkSubdomainAvailable(subdomain: string) {
  const { data } = await supabase.rpc('check_subdomain_available', { check_subdomain: subdomain })
  return data
}

// ─── Subscriptions ─────────────────────────────────────────────────────────────

export async function getSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()
  return { data, error }
}

export async function isProUser(userId: string) {
  const { data: profile } = await getProfile(userId)
  return profile?.plan === 'pro'
}
