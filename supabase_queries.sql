-- LiveWedding Studio: Client Query System Setup
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  client_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved'))
);

-- Enable Realtime for this table (Optional)
ALTER PUBLICATION supabase_realtime ADD TABLE queries;

-- Policies (Ensure anyone with the API key can insert, but only authenticated can select?)
-- For this simulation, we'll keep it open for simplicity like the bookings table.
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to queries" ON queries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select from queries" ON queries FOR SELECT USING (true);
CREATE POLICY "Allow public update to queries" ON queries FOR UPDATE USING (true);
