import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rumxyxmeqwqceuwlktxt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bXh5eG1lcXdxY2V1d2xrdHh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2Njk2MDQsImV4cCI6MjA2MjI0NTYwNH0.5Gc1X3UQxsDDIYd-zdxai-594LsvmW0b4HazaEMpWhI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
