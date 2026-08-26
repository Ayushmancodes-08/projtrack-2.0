import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export function createClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://debhfqjgqmlmujrfyrny.supabase.co"
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlYmhmcWpncW1sbXVqcmZ5cm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MzUxODUsImV4cCI6MjA5NzQxMTE4NX0.DPSP69kfKlhvDFc6OErxIKrdjBsSTj93aHN80A14150"

  return createSupabaseClient(url, key)
}


