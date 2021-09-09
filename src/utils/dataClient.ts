import { createClient } from '@supabase/supabase-js'
import { getEnv } from '@src/utils/getEnv'


export const supabase = createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_PUBLIC_KEY'))