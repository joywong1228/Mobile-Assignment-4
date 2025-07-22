import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://olqavxxfmqpcnwcnsnyi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9scWF2eHhmbXFwY253Y25zbnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTg4NjgsImV4cCI6MjA2ODE3NDg2OH0.B6YlUhT4rj8nownrw5oGiymCz9in2RbIQWq0L-nPbq8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
