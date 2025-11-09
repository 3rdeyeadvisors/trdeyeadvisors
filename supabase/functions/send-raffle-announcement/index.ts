import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Fetching subscribers for raffle announcement...");

    // Fetch all subscribers
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email, name');

    if (error) throw error;

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No subscribers found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending raffle announcement to ${subscribers.length} subscribers...`);

    // Send emails in batches
    const emailPromises = subscribers.map(subscriber => 
      resend.emails.send({
        from: "3rdeyeadvisors <noreply@the3rdeyeadvisors.com>",
        to: [subscriber.email],
        subject: "🎟 Learn to Earn — Join Our $50 Bitcoin Raffle Now",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #8B5CF6; margin-bottom: 20px;">The Future Rewards Learning 🚀</h1>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Hi ${subscriber.name || 'there'},
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              The future of finance is decentralized — and now, learning it pays.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6;">
              <strong>3rdeyeadvisors</strong> has officially launched the <strong>Learn-to-Earn Raffle</strong>, rewarding our community for learning and engaging in DeFi education.
            </p>
            
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
              <h2 style="margin: 0 0 20px 0; color: white;">How to Enter</h2>
              <ul style="list-style: none; padding: 0; text-align: left; font-size: 16px; line-height: 2;">
                <li>✅ Follow us on <strong>Instagram</strong> @3rdeyeadvisors</li>
                <li>✅ Follow us on <strong>X</strong> @3rdeyeadvisors</li>
                <li>✅ Subscribe to the newsletter (you're already in! 🎉)</li>
                <li>✅ Complete the <strong>DeFi Foundations</strong> and <strong>Staying Safe with DeFi</strong> courses</li>
                <li>✅ Rate the courses and join the discussion</li>
              </ul>
              
              <div style="margin: 30px 0; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <p style="font-size: 18px; margin: 10px 0;">💡 <strong>Bonus:</strong> Each referral link shared from your dashboard earns extra entries when someone signs up.</p>
              </div>
              
              <div style="font-size: 48px; font-weight: bold; margin: 20px 0;">🪙 $50</div>
              <p style="font-size: 20px; margin: 10px 0;">Prize: Bitcoin</p>
              <p style="font-size: 16px; margin: 10px 0;">🕒 Active Period: November 10–23, 2025</p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://the3rdeyeadvisors.com/raffles" style="display: inline-block; background: #8B5CF6; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px;">
                Join the Raffle Now →
              </a>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; font-style: italic; text-align: center; color: #666;">
              The more you learn, the more you earn — because awareness is the real currency.
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="font-size: 18px; font-weight: bold; color: #8B5CF6;">
                Awareness is advantage.
              </p>
              <p style="font-size: 14px; color: #666;">
                — 3rdeyeadvisors
              </p>
            </div>
          </div>
        `,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Raffle announcement sent: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successful, 
        failed: failed,
        total: subscribers.length 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-raffle-announcement:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
