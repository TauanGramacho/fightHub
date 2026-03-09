import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  // Lançamos um erro cedo para ficar claro no console de dev
  throw new Error(
    'VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY não estão definidos nas variáveis de ambiente.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

