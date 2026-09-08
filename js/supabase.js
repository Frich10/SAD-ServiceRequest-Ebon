// js/supabase.js
// -----------------------------------------------------------------------
// Supabase client initialization.
// IMPORTANT: Only the PUBLIC "anon"/"publishable" key goes here.
// NEVER put the service_role key in any file that is pushed to GitHub.
// -----------------------------------------------------------------------

const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_KEY = "YOUR-PUBLISHABLE-ANON-KEY";

// `supabase` here comes from the CDN script tag loaded in the HTML files:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
