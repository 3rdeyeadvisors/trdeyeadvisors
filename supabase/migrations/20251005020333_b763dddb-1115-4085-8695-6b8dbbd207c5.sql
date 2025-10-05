-- Update digital-products bucket to allow CSV file uploads
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY[
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'video/mp4',
  'text/csv'
]
WHERE name = 'digital-products';