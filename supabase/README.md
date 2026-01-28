# Supabase setup

1. Open the Supabase SQL editor for your project.
2. Run `supabase/setup.sql` to create tables, policies, and the storage bucket.
3. Set the environment variables in your app:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

If you need stricter access control, adjust the RLS policies in the SQL file.
