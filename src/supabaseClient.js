import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pyktaifjjgntpcqxykzm.supabase.co'
const supabaseKey = 'sb_publishable_gbFTU3QsCYVPfknWka4kaw_I3g2m6FZ'

export const supabase = createClient(supabaseUrl, supabaseKey)