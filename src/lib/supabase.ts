// Re-export browser client for backward compatibility. Prefer importing from '@/lib/supabase/client'.
import { createClient as createBrowserClient } from '@/lib/supabase/client';

export const supabase = createBrowserClient();