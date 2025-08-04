import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscriberThankYouPayload {
  table: string;
  record: {
    id: string;
    email: string;
    name?: string;
    created_at: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: SubscriberThankYouPayload = await req.json();
    console.log('Received subscriber thank you payload:', payload);

    const { record } = payload;
    const email = record.email;
    const name = record.name || 'Valued Subscriber';
    const firstName = name.split(' ')[0] || 'there';
    
    // Send personalized thank you email to the subscriber
    const emailResponse = await resend.emails.send({
      from: "3rdeyeadvisors <info@the3rdeyeadvisors.com>",
      to: [email],
      subject: "🙏 Thank You for Subscribing - 3rdeyeadvisors Newsletter",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: hsl(222, 84%, 4.9%); color: hsl(0, 0%, 98%); padding: 20px; border-radius: 12px;">
          <!-- Cosmic Header -->
          <div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, hsl(217, 32%, 8%), hsl(217, 32%, 6%)); border-radius: 12px; margin-bottom: 32px; border: 1px solid hsl(217, 32%, 15%); position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(ellipse at center, hsl(217, 91%, 60%, 0.1) 0%, transparent 70%);"></div>
            <div style="position: relative;">
              <h1 style="color: hsl(217, 91%, 60%); font-size: 32px; margin: 0 0 8px 0; font-weight: bold; text-shadow: 0 0 20px hsl(217, 91%, 60%, 0.3);">3rdeyeadvisors</h1>
              <p style="color: hsl(271, 91%, 75%); font-size: 18px; margin: 0; font-weight: 500;">Conscious DeFi Education</p>
            </div>
          </div>
          
          <!-- Thank You Message -->
          <div style="margin: 32px 0;">
            <h2 style="color: hsl(217, 91%, 70%); font-size: 24px; margin: 0 0 16px 0; font-weight: 600;">
              🙏 Thank you for subscribing, ${firstName}!
            </h2>
            <p style="color: hsl(0, 0%, 95%); font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              You're now part of our conscious DeFi community! We're grateful to have you join us on this journey of financial awareness and decentralized education.
            </p>
          </div>

          <!-- What's Next -->
          <div style="background: linear-gradient(135deg, hsl(217, 32%, 10%), hsl(217, 32%, 12%)); padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid hsl(217, 32%, 15%);">
            <h3 style="color: hsl(217, 91%, 70%); margin: 0 0 16px 0; font-size: 18px;">What's coming your way:</h3>
            <ul style="color: hsl(0, 0%, 90%); line-height: 1.6; margin: 0; padding-left: 20px;">
              <li style="margin: 8px 0;">📧 <strong>Weekly DeFi insights</strong> directly to your inbox</li>
              <li style="margin: 8px 0;">🔍 <strong>Market analysis</strong> with a conscious perspective</li>
              <li style="margin: 8px 0;">🛡️ <strong>Security tips</strong> to protect your digital assets</li>
              <li style="margin: 8px 0;">🎓 <strong>Educational content</strong> for all experience levels</li>
              <li style="margin: 8px 0;">⚡ <strong>Early access</strong> to new courses and resources</li>
            </ul>
          </div>

          <!-- Explore Now -->
          <div style="background: linear-gradient(135deg, hsl(271, 91%, 10%), hsl(271, 91%, 12%)); padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid hsl(271, 91%, 25%);">
            <h3 style="color: hsl(271, 91%, 75%); margin: 0 0 16px 0; font-size: 18px;">Start exploring now:</h3>
            <p style="color: hsl(0, 0%, 90%); line-height: 1.6; margin: 0 0 16px 0;">
              While you wait for your first newsletter, dive into our free educational content:
            </p>
            <div style="text-align: center;">
              <a href="https://the3rdeyeadvisors.com/philosophy" style="background: linear-gradient(45deg, hsl(217, 91%, 60%), hsl(271, 91%, 65%)); color: hsl(0, 0%, 98%); padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 8px;">
                Our Philosophy
              </a>
              <a href="https://the3rdeyeadvisors.com/courses" style="background: linear-gradient(45deg, hsl(271, 91%, 60%), hsl(217, 91%, 65%)); color: hsl(0, 0%, 98%); padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 8px;">
                Free Courses
              </a>
            </div>
          </div>

          <!-- Personal Note -->
          <div style="text-align: center; margin: 32px 0; padding: 20px; background: linear-gradient(135deg, hsl(217, 32%, 8%), hsl(217, 32%, 10%)); border-radius: 8px; border: 1px solid hsl(217, 32%, 15%);">
            <p style="color: hsl(0, 0%, 90%); font-size: 14px; margin: 0 0 16px 0;">
              Have questions? Just reply to this email - we read every message personally.
            </p>
            <p style="color: hsl(217, 91%, 70%); font-size: 16px; margin: 0; font-weight: 500;">
              Thank you for trusting us with your DeFi education, ${firstName}! 🌟
            </p>
          </div>
          
          <hr style="margin: 32px 0; border: none; border-top: 1px solid hsl(217, 32%, 15%);">
          <p style="color: hsl(215, 20%, 65%); font-size: 12px; text-align: center; margin: 0;">
            You're receiving this because you subscribed to 3rdeyeadvisors newsletter.<br>
            <a href="#" style="color: hsl(215, 20%, 65%);">Unsubscribe</a> | <a href="https://the3rdeyeadvisors.com" style="color: hsl(215, 20%, 65%);">Visit Website</a>
          </p>
        </div>
      `,
    });

    console.log("Subscriber thank you email sent successfully to:", email);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Thank you email sent to ${email}`,
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-subscriber-thank-you function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);