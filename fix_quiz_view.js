import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

async function run() {
  const { error } = await supabase.rpc('exec_sql', {
    sql_query: `
      CREATE OR REPLACE VIEW quiz_questions_secure AS
      SELECT id, quiz_id, question, type, options, correct_answers, explanation, points, created_at
      FROM quiz_questions;

      GRANT SELECT ON quiz_questions_secure TO anon, authenticated;
    `
  })

  if (error) {
    // If exec_sql doesn't exist, we might need another way or just accept we can't do it easily here.
    // But usually in these environments there's a way.
    console.error(error)
  } else {
    console.log("View updated successfully")
  }
}

run()
