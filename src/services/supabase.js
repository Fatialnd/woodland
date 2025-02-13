import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mdnwcbfjphtoasdxhusl.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbndjYmZqcGh0b2FzZHhodXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNDMxNjEsImV4cCI6MjA1NDkxOTE2MX0.CbSjh1HxorkgM3EMgOc1fkLq7DuXQc6ZeT1c0R89uUE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
