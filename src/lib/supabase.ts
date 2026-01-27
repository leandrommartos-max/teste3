import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://wdyegwgahbhqptbjigzm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkeWVnd2dhaGJocXB0YmppZ3ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0Mjc2OTEsImV4cCI6MjA4NTAwMzY5MX0.1HkaV5rlSTPmW2Z1wbAqT7LTHMV6lOd-jP80UZXvwxo"
);

