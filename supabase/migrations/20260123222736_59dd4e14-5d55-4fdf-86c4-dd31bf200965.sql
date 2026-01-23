-- Clean up orphaned subscriber records (accounts that were deleted but subscriber records remain)
DELETE FROM subscribers WHERE email IN (
  'tevin_roberson@yahoo.com', 'ailema88@icloud.com', 'laura_elizabeth0509@yahoo.com',
  'demond.hall98@gmail.com', 'ashleywalther56@gmail.com', 'enriquemartinezjr@yahoo.com',
  'derrtyem@yahoo.com', 'emart255@hotmail.com', 'nikhamm35@gmail.com',
  'blakerussell12@gmail.com', 'andresnr210@gmail.com', 'hnreinhard@gmail.com'
);