import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RaffleConfirmationRequest {
  email: string;
  first_name?: string;
  raffle_title: string;
  prize: string;
  prize_amount: number;
  end_date: string;
  entry_count: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, first_name, raffle_title, prize, prize_amount, end_date, entry_count }: RaffleConfirmationRequest = await req.json();

    console.log("Sending raffle confirmation email to:", email);

    const emailResponse = await resend.emails.send({
      from: "3rdeyeadvisors <noreply@the3rdeyeadvisors.com>",
      to: [email],
      subject: "You're officially entered — 3rdeyeadvisors Learn-to-Earn Raffle 🎟",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8B5CF6; margin-bottom: 20px;">You're In! 🎉</h1>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Hi ${first_name || 'there'},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            You've successfully joined our <strong>Learn-to-Earn Raffle</strong> — welcome to the next evolution of financial consciousness.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Each step you took — learning, sharing, and engaging — earns you energy in return. The system remembers. 🌐
          </p>
          
          <div style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
            <h2 style="margin: 0 0 20px 0; color: white;">Your Entry Details</h2>
            <div style="font-size: 48px; font-weight: bold; margin: 20px 0;">🪙 $${prize_amount}</div>
            <p style="font-size: 20px; margin: 10px 0;">Prize: ${prize}</p>
            <p style="font-size: 18px; margin: 10px 0;">Your Entries: ${entry_count}</p>
            <p style="font-size: 16px; margin: 10px 0;">⏰ Raffle Ends: ${new Date(end_date).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              timeZoneName: 'short'
            })}</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Stay tuned for updates, and keep sharing your referral link for extra entries!
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
            <p style="font-size: 18px; font-weight: bold; color: #8B5CF6;">
              Awareness is advantage.
            </p>
            <p style="font-size: 14px; color: #666;">
              — The 3rdeyeadvisors Team
            </p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px; text-align: center;">
            <p style="font-size: 14px; color: #666; margin: 0;">
              Want more entries? Share your referral link from your <a href="https://the3rdeyeadvisors.com/raffles" style="color: #8B5CF6; text-decoration: none;">raffle dashboard</a>.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Raffle confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-raffle-confirmation:", error);
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
