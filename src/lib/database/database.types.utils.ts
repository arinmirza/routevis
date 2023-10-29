import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

declare global {
	type Tables = keyof Database['public']['Tables'];
	type Entry<Table extends Tables> = Database['public']['Tables'][Table]['Row'];
	type Insert<Table extends Tables> = Database['public']['Tables'][Table]['Insert'];
	type Update<Table extends Tables> = Database['public']['Tables'][Table]['Update'];
	type Relationships<Table extends Tables> = Database['public']['Tables'][Table]['Relationships'];
	type SupabaseSchema = Database;
    type MySupabaseClient = SupabaseClient<SupabaseSchema>;
}

