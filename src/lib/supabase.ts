import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qhjnlrxvitrwzutzeftc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoam5scnh2aXRyd3p1dHplZnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNzg1NjcsImV4cCI6MjA4MjY1NDU2N30.pGIGPd02-2m-n90XcBcpYppkNVJajSJlotcESsQE3co';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Registration {
  id: number;
  name: string;
  email: string;
  registration_type: string;
  company?: string | null;
  phone?: string | null;
  created_at: string;
}
