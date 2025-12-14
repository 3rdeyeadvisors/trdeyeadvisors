import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if this is a bulk send for existing subscribers
    const url = new URL(req.url);
    const sendToAll = url.searchParams.get('sendToAll') === 'true';
    
    console.log(`Starting subscriber signup reminder. Send to all: ${sendToAll}`);
    
    // Get all subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('subscribers')
      .select('id, email, name, created_at');
    
    if (subError) {
      console.error('Error fetching subscribers:', subError);
      throw subError;
    }
    
    if (!subscribers || subscribers.length === 0) {
      console.log('No subscribers found');
      return new Response(
        JSON.stringify({ success: true, message: 'No subscribers to process', emailsSent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Get all user emails from auth
    const { data: authUsers, error: authError } = await supabase
      .rpc('get_user_emails_with_profiles');
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      throw authError;
    }
    
    const registeredEmails = new Set(authUsers?.map(u => u.email.toLowerCase()) || []);
    
    // Filter subscribers who don't have accounts
    let subscribersWithoutAccounts = subscribers.filter(
      sub => !registeredEmails.has(sub.email.toLowerCase())
    );
    
    console.log(`Found ${subscribersWithoutAccounts.length} subscribers without accounts`);
    
    // If not sending to all, only send to those who subscribed ~24 hours ago
    if (!sendToAll) {
      const now = new Date();
      const twentyThreeHoursAgo = new Date(now.getTime() - 23 * 60 * 60 * 1000);
      const twentyFiveHoursAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000);
      
      subscribersWithoutAccounts = subscribersWithoutAccounts.filter(sub => {
        const createdAt = new Date(sub.created_at);
        return createdAt >= twentyFiveHoursAgo && createdAt <= twentyThreeHoursAgo;
      });
      
      console.log(`After time filter: ${subscribersWithoutAccounts.length} subscribers in 24-hour window`);
    }
    
    // Check which subscribers have already received this email
    const { data: sentEmails, error: logsError } = await supabase
      .from('email_logs')
      .select('recipient_email')
      .eq('email_type', 'subscriber_signup_reminder');
    
    if (logsError) {
      console.error('Error fetching email logs:', logsError);
    }
    
    const alreadySent = new Set(sentEmails?.map(e => e.recipient_email.toLowerCase()) || []);
    
    // Filter out subscribers who already received this email
    subscribersWithoutAccounts = subscribersWithoutAccounts.filter(
      sub => !alreadySent.has(sub.email.toLowerCase())
    );
    
    console.log(`After deduplication: ${subscribersWithoutAccounts.length} subscribers to email`);
    
    if (subscribersWithoutAccounts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No new subscribers to email', emailsSent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    let emailsSent = 0;
    const errors: string[] = [];
    
    for (const subscriber of subscribersWithoutAccounts) {
      const firstName = subscriber.name?.split(' ')[0] || 'there';
      
      try {
        const emailResponse = await resend.emails.send({
          from: "3rdeyeadvisors <info@the3rdeyeadvisors.com>",
          to: [subscriber.email],
          subject: "Unlock Your Full DeFi Learning Experience 🔓",
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #020817; color: #fff; padding: 20px; border-radius: 12px;">
              <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #0f172a, #1e1b4b); border-radius: 12px; margin-bottom: 24px; border: 1px solid #1e293b;">
                <h1 style="color: #3b82f6; font-size: 28px; margin: 0 0 8px 0; font-weight: bold;">3rdeyeadvisors</h1>
                <h2 style="color: #a78bfa; font-size: 20px; margin: 0;">Take Your Learning to the Next Level</h2>
              </div>
              
              <p style="color: #e5e5e5; font-size: 18px; margin: 0 0 16px 0; line-height: 1.6;">
                Hey ${firstName}! 👋
              </p>
              
              <p style="color: #d4d4d4; font-size: 16px; margin: 0 0 24px 0; line-height: 1.6;">
                Thanks for subscribing to our newsletter! We noticed you haven't created an account yet – and you're missing out on some amazing features.
              </p>
              
              <div style="background: linear-gradient(135deg, #1e293b, #1e1b4b); padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #334155;">
                <h3 style="color: #60a5fa; margin: 0 0 16px 0; font-size: 18px;">🎁 What You Get With a Free Account:</h3>
                <ul style="color: #d4d4d4; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li><strong style="color: #60a5fa;">Track Your Progress</strong> - Save your place in courses and tutorials</li>
                  <li><strong style="color: #60a5fa;">Free DeFi Courses</strong> - Access beginner-friendly content at no cost</li>
                  <li><strong style="color: #60a5fa;">Community Access</strong> - Join discussions and Q&A with other learners</li>
                  <li><strong style="color: #60a5fa;">Raffle Entries</strong> - Participate in exclusive giveaways and prizes</li>
                  <li><strong style="color: #60a5fa;">Certificates</strong> - Earn badges as you complete courses</li>
                </ul>
              </div>
              
              <p style="color: #d4d4d4; font-size: 16px; margin: 0 0 24px 0; line-height: 1.6;">
                Creating an account takes less than 30 seconds – just use the same email you subscribed with!
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://the3rdeyeadvisors.com/auth" style="background: linear-gradient(45deg, #3b82f6, #8b5cf6); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                  Create Free Account
                </a>
              </div>
              
              <p style="color: #9ca3af; font-size: 14px; margin: 24px 0 0 0; line-height: 1.6;">
                Questions? Just reply to this email – we're here to help!
              </p>
              
              <hr style="margin: 32px 0; border: none; border-top: 1px solid #1e293b;">
              <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
                You're receiving this because you subscribed at 3rdeyeadvisors.com
              </p>
            </div>
          `,
        });
        
        console.log(`Signup reminder sent to ${subscriber.email}:`, emailResponse);
        
        await supabase.from('email_logs').insert({
          email_type: 'subscriber_signup_reminder',
          recipient_email: subscriber.email,
          status: 'sent',
          edge_function_name: 'send-subscriber-signup-reminder',
          metadata: { name: subscriber.name, resend_id: emailResponse.data?.id }
        });
        
        emailsSent++;
        
        // Delay to respect Resend's rate limit (2 req/sec)
        await new Promise(resolve => setTimeout(resolve, 550));
        
      } catch (emailErr: any) {
        console.error(`Failed to send to ${subscriber.email}:`, emailErr);
        errors.push(`${subscriber.email}: ${emailErr.message}`);
        
        await supabase.from('email_logs').insert({
          email_type: 'subscriber_signup_reminder',
          recipient_email: subscriber.email,
          status: 'failed',
          edge_function_name: 'send-subscriber-signup-reminder',
          error_message: emailErr.message
        });
      }
    }
    
    console.log(`Subscriber signup reminder complete. Sent ${emailsSent} emails.`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        emailsSent,
        totalSubscribersWithoutAccounts: subscribersWithoutAccounts.length,
        errors: errors.length > 0 ? errors : undefined
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
    
  } catch (error: any) {
    console.error("Error in send-subscriber-signup-reminder:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
