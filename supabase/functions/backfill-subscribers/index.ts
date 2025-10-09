import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BackfillResult {
  email: string;
  welcome_email_sent: boolean;
  mailchimp_synced: boolean;
  welcome_email_error?: string;
  mailchimp_error?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const targetEmails: string[] = body.emails || [];

    console.log('Starting subscriber backfill process...');
    if (targetEmails.length > 0) {
      console.log(`Targeting specific emails: ${targetEmails.join(', ')}`);
    } else {
      console.log('Processing all subscribers');
    }

    // Fetch subscribers (all or specific ones)
    let query = supabase
      .from('subscribers')
      .select('*');
    
    if (targetEmails.length > 0) {
      query = query.in('email', targetEmails);
    }
    
    const { data: subscribers, error: fetchError } = await query.order('created_at', { ascending: true });

    if (fetchError) {
      throw new Error(`Failed to fetch subscribers: ${fetchError.message}`);
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No subscribers to backfill',
          results: []
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Found ${subscribers.length} subscribers to backfill`);

    const results: BackfillResult[] = [];

    // Process each subscriber
    for (const subscriber of subscribers) {
      const result: BackfillResult = {
        email: subscriber.email,
        welcome_email_sent: false,
        mailchimp_synced: false,
      };

      // 1. Send welcome email via send-subscriber-thank-you
      try {
        const thankYouResponse = await supabase.functions.invoke('send-subscriber-thank-you', {
          body: {
            table: 'subscribers',
            record: {
              id: subscriber.id,
              email: subscriber.email,
              name: subscriber.name,
              created_at: subscriber.created_at,
            },
          },
        });

        if (thankYouResponse.error) {
          result.welcome_email_error = thankYouResponse.error.message;
          console.error(`Failed to send welcome email to ${subscriber.email}:`, thankYouResponse.error);
        } else {
          result.welcome_email_sent = true;
          console.log(`✓ Welcome email sent to ${subscriber.email}`);
        }
      } catch (error: any) {
        result.welcome_email_error = error.message;
        console.error(`Error sending welcome email to ${subscriber.email}:`, error);
      }

      // 2. Sync to Mailchimp
      try {
        const mailchimpResponse = await supabase.functions.invoke('mailchimp-sync', {
          body: {
            table: 'subscribers',
            record: {
              id: subscriber.id,
              email: subscriber.email,
              name: subscriber.name,
              created_at: subscriber.created_at,
            },
          },
        });

        if (mailchimpResponse.error) {
          result.mailchimp_error = mailchimpResponse.error.message;
          console.error(`Failed to sync ${subscriber.email} to Mailchimp:`, mailchimpResponse.error);
        } else {
          result.mailchimp_synced = true;
          console.log(`✓ Synced ${subscriber.email} to Mailchimp`);
        }
      } catch (error: any) {
        result.mailchimp_error = error.message;
        console.error(`Error syncing ${subscriber.email} to Mailchimp:`, error);
      }

      results.push(result);

      // Add a small delay to avoid overwhelming the services
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Summary
    const successCount = results.filter(r => r.welcome_email_sent && r.mailchimp_synced).length;
    const emailFailures = results.filter(r => !r.welcome_email_sent).length;
    const mailchimpFailures = results.filter(r => !r.mailchimp_synced).length;

    console.log(`
Backfill Summary:
- Total subscribers: ${subscribers.length}
- Successfully processed: ${successCount}
- Email failures: ${emailFailures}
- Mailchimp failures: ${mailchimpFailures}
    `);

    return new Response(
      JSON.stringify({ 
        success: true,
        summary: {
          total: subscribers.length,
          successful: successCount,
          email_failures: emailFailures,
          mailchimp_failures: mailchimpFailures,
        },
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in backfill-subscribers function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
