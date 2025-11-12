-- Manually create missing raffle entries and tickets for verified tasks

-- User 57ef7a37-cc93-49e1-b173-2173e9cb74dd has 2 verified tasks = 4 tickets
INSERT INTO raffle_entries (user_id, raffle_id, entry_count)
VALUES ('57ef7a37-cc93-49e1-b173-2173e9cb74dd', 'c6008efe-7ee7-4db3-96ca-451bacc07a2a', 4)
ON CONFLICT (user_id, raffle_id) DO UPDATE 
SET entry_count = EXCLUDED.entry_count;

-- Create 4 tickets for this user
INSERT INTO raffle_tickets (user_id, raffle_id, ticket_source, metadata)
SELECT 
  '57ef7a37-cc93-49e1-b173-2173e9cb74dd',
  'c6008efe-7ee7-4db3-96ca-451bacc07a2a',
  'verification',
  '{"backfilled": true}'::jsonb
FROM generate_series(1, 4);

-- User 10b82fc0-2572-4ba0-b616-80606a594159 has 1 verified task = 2 tickets
INSERT INTO raffle_entries (user_id, raffle_id, entry_count)
VALUES ('10b82fc0-2572-4ba0-b616-80606a594159', 'c6008efe-7ee7-4db3-96ca-451bacc07a2a', 2)
ON CONFLICT (user_id, raffle_id) DO UPDATE 
SET entry_count = EXCLUDED.entry_count;

-- Create 2 tickets for this user  
INSERT INTO raffle_tickets (user_id, raffle_id, ticket_source, metadata)
SELECT 
  '10b82fc0-2572-4ba0-b616-80606a594159',
  'c6008efe-7ee7-4db3-96ca-451bacc07a2a',
  'verification',
  '{"backfilled": true}'::jsonb
FROM generate_series(1, 2);