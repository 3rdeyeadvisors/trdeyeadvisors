-- Update digital product files to match the actual uploaded file names and paths
UPDATE digital_product_files
SET 
  file_path = 'defi-mastery-complete-guide.pdf',
  file_name = 'defi-mastery-complete-guide.pdf',
  file_type = 'application/pdf',
  description = 'Complete 150+ page guide covering all aspects of DeFi from basics to advanced strategies'
WHERE product_id = 1;

UPDATE digital_product_files
SET 
  file_path = 'defi-portfolio-tracker.csv',
  file_name = 'defi-portfolio-tracker.csv',
  file_type = 'text/csv',
  description = 'Comprehensive CSV template for tracking your entire DeFi portfolio across multiple protocols'
WHERE product_id = 2;

UPDATE digital_product_files
SET 
  file_path = 'advanced-defi-strategies.pdf',
  file_name = 'advanced-defi-strategies.pdf',
  file_type = 'application/pdf',
  description = 'Advanced DeFi trading and yield optimization strategies for professional traders'
WHERE product_id = 3;

UPDATE digital_product_files
SET 
  file_path = 'yield-farming-calculator.csv',
  file_name = 'yield-farming-calculator.csv',
  file_type = 'text/csv',
  description = 'Excel-compatible calculator for analyzing yield farming opportunities and ROI'
WHERE product_id = 4;

UPDATE digital_product_files
SET 
  file_path = 'security-audit-checklist.pdf',
  file_name = 'security-audit-checklist.pdf',
  file_type = 'application/pdf',
  description = 'Complete security audit checklist for evaluating DeFi protocols before investing'
WHERE product_id = 5;

UPDATE digital_product_files
SET 
  file_path = 'defi-comparison.pdf',
  file_name = 'defi-comparison.pdf',
  file_type = 'application/pdf',
  description = 'Side-by-side comparison of major DeFi protocols, features, and risk profiles'
WHERE product_id = 6;
