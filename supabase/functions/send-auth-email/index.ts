import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  type: 'signup' | 'recovery';
  email: string;
  token?: string;
  redirect_url?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, token, redirect_url }: EmailRequest = await req.json();

    // Get user's name for personalization
    let firstName = 'there';
    try {
      const { data: user } = await supabase.auth.admin.getUserByEmail(email);
      if (user.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', user.user.id)
          .single();
        
        firstName = profile?.display_name?.split(' ')[0] || 
                   user.user.user_metadata?.first_name || 
                   user.user.user_metadata?.display_name?.split(' ')[0] || 
                   'there';
      }
    } catch (error) {
      console.log('Could not fetch user name, using default greeting');
    }

    // Create custom email content based on type
    let subject: string;
    let htmlContent: string;

    if (type === 'signup') {
      subject = 'Welcome to 3rdeyeadvisors - Your DeFi Journey Begins! 🚀';
      htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #fff; background: hsl(222, 84%, 4.9%);">
          
          <!-- Cosmic Welcome Header -->
          <div style="text-align: center; padding: 50px 30px 40px; background: linear-gradient(135deg, hsl(222, 84%, 4.9%), hsl(217, 32%, 8%)); border-radius: 12px 12px 0 0; position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 30% 20%, hsl(217, 91%, 60%, 0.15), transparent 50%), radial-gradient(circle at 70% 80%, hsl(271, 91%, 65%, 0.1), transparent 50%); border-radius: 12px 12px 0 0;"></div>
            <h1 style="color: hsl(217, 91%, 60%); font-size: 36px; margin: 0; font-weight: bold; text-shadow: 0 0 30px hsl(217, 91%, 60%, 0.5); position: relative; z-index: 1;">3rdeyeadvisors</h1>
            <p style="color: hsl(0, 0%, 95%); font-size: 20px; margin: 16px 0 0 0; opacity: 0.9; position: relative; z-index: 1;">Your DeFi Consciousness Awakening Begins</p>
          </div>
          
          <!-- Main Welcome Content -->
          <div style="background: linear-gradient(180deg, hsl(217, 32%, 8%), hsl(217, 32%, 6%)); padding: 40px 30px; border: 1px solid hsl(217, 32%, 15%); border-top: none;">
            <div style="background: linear-gradient(45deg, hsl(217, 91%, 60%, 0.1), hsl(271, 91%, 65%, 0.1)); padding: 32px; border-radius: 16px; margin: 0 0 32px 0; border: 1px solid hsl(217, 32%, 15%); position: relative;">
              <div style="position: absolute; top: -1px; left: -1px; right: -1px; bottom: -1px; background: linear-gradient(45deg, hsl(217, 91%, 60%, 0.3), hsl(271, 91%, 65%, 0.3)); border-radius: 16px; z-index: -1; filter: blur(8px);"></div>
              <h2 style="color: hsl(217, 91%, 70%); margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">🎉 Welcome ${firstName}!</h2>
              <p style="line-height: 1.7; margin: 0 0 24px 0; color: hsl(0, 0%, 90%); font-size: 16px;">
                Your journey into decentralized finance consciousness has begun. You now have access to our comprehensive DeFi education platform designed to elevate your understanding and mastery.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${redirect_url || 'https://the3rdeyeadvisors.com'}" 
                   style="background: linear-gradient(45deg, hsl(217, 91%, 60%), hsl(271, 91%, 65%)); color: hsl(222, 84%, 4.9%); padding: 18px 36px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 0 30px hsl(217, 91%, 60%, 0.4), 0 8px 20px rgba(0,0,0,0.3); transition: all 0.3s ease;">
                  🚀 Start Your Journey
                </a>
              </div>
            </div>

            <!-- Next Steps with Cosmic Styling -->
            <div style="background: linear-gradient(135deg, hsl(217, 32%, 10%), hsl(217, 32%, 12%)); padding: 28px; border-radius: 12px; margin: 32px 0; border: 1px solid hsl(217, 32%, 15%);">
              <h3 style="color: hsl(271, 91%, 75%); margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">🌟 Your Next Steps</h3>
              <ul style="color: hsl(0, 0%, 85%); line-height: 1.8; padding-left: 0; list-style: none; margin: 0;">
                <li style="margin: 0 0 12px 0; padding-left: 24px; position: relative;">
                  <span style="position: absolute; left: 0; color: hsl(217, 91%, 70%);">📚</span>
                  Explore our comprehensive course library
                </li>
                <li style="margin: 0 0 12px 0; padding-left: 24px; position: relative;">
                  <span style="position: absolute; left: 0; color: hsl(271, 91%, 70%);">🎯</span>
                  Start with DeFi Foundations for beginners
                </li>
                <li style="margin: 0 0 12px 0; padding-left: 24px; position: relative;">
                  <span style="position: absolute; left: 0; color: hsl(142, 76%, 46%);">💬</span>
                  Join our community discussions
                </li>
                <li style="margin: 0; padding-left: 24px; position: relative;">
                  <span style="position: absolute; left: 0; color: hsl(217, 91%, 70%);">📈</span>
                  Track your learning progress
                </li>
              </ul>
            </div>
          </div>

          <!-- Cosmic Footer -->
          <div style="text-align: center; padding: 32px 24px; background: linear-gradient(135deg, hsl(217, 32%, 6%), hsl(222, 84%, 4.9%)); margin-top: 0; border-radius: 0 0 12px 12px; border: 1px solid hsl(217, 32%, 15%); border-top: none;">
            <p style="color: hsl(215, 20%, 65%); font-size: 14px; margin: 0 0 12px 0; line-height: 1.5;">
              Questions? Contact us at 
              <a href="mailto:info@the3rdeyeadvisors.com" style="color: hsl(217, 91%, 70%); text-decoration: none; font-weight: 500;">info@the3rdeyeadvisors.com</a>
            </p>
            <p style="color: hsl(215, 20%, 50%); font-size: 12px; margin: 0;">
              © 2024 3rdeyeadvisors. Empowering DeFi consciousness.
            </p>
          </div>
        </div>
      `;
    } else if (type === 'recovery') {
      subject = 'Reset Your 3rdeyeadvisors Password 🔑';
      htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #fff; background: hsl(222, 84%, 4.9%);">
          
          <!-- Security Header -->
          <div style="text-align: center; padding: 50px 30px 30px; background: linear-gradient(135deg, hsl(222, 84%, 4.9%), hsl(217, 32%, 8%)); border-radius: 12px 12px 0 0; position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 50%, hsl(217, 91%, 60%, 0.1), transparent 70%); border-radius: 12px 12px 0 0;"></div>
            <h1 style="color: hsl(217, 91%, 60%); font-size: 32px; margin: 0; font-weight: bold; text-shadow: 0 0 20px hsl(217, 91%, 60%, 0.3); position: relative; z-index: 1;">Password Reset</h1>
            <p style="color: hsl(0, 0%, 95%); font-size: 16px; margin: 12px 0 0 0; opacity: 0.9; position: relative; z-index: 1;">3rdeyeadvisors Account Security</p>
          </div>
          
          <!-- Main Recovery Content -->
          <div style="background: linear-gradient(180deg, hsl(217, 32%, 8%), hsl(217, 32%, 6%)); padding: 40px 30px; border: 1px solid hsl(217, 32%, 15%); border-top: none;">
            <div style="background: linear-gradient(45deg, hsl(217, 91%, 60%, 0.1), hsl(271, 91%, 65%, 0.1)); padding: 32px; border-radius: 16px; margin: 0 0 32px 0; border: 1px solid hsl(217, 32%, 15%);">
              <h2 style="color: hsl(217, 91%, 70%); margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">🔑 Hello ${firstName}!</h2>
              <p style="line-height: 1.7; margin: 0 0 24px 0; color: hsl(0, 0%, 90%); font-size: 16px;">
                We received a request to reset your password for your 3rdeyeadvisors account. Click the button below to create a new secure password.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${redirect_url || 'https://the3rdeyeadvisors.com/auth?reset=true'}" 
                   style="background: linear-gradient(45deg, hsl(217, 91%, 60%), hsl(271, 91%, 65%)); color: hsl(222, 84%, 4.9%); padding: 18px 36px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 0 30px hsl(217, 91%, 60%, 0.4), 0 8px 20px rgba(0,0,0,0.3);">
                  🔐 Reset Password
                </a>
              </div>
              
              <p style="font-size: 14px; color: hsl(215, 20%, 65%); margin: 24px 0 0 0; text-align: center;">
                This link will expire in 24 hours for security.
              </p>
            </div>

            <!-- Security Warning -->
            <div style="background: linear-gradient(135deg, hsl(45, 100%, 25%), hsl(45, 100%, 20%)); border: 1px solid hsl(45, 100%, 40%); padding: 20px; border-radius: 12px; margin: 24px 0;">
              <p style="color: hsl(45, 100%, 85%); margin: 0; font-size: 14px; line-height: 1.5;">
                <strong style="color: hsl(45, 100%, 95%);">⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
              </p>
            </div>
          </div>

          <!-- Cosmic Footer -->
          <div style="text-align: center; padding: 32px 24px; background: linear-gradient(135deg, hsl(217, 32%, 6%), hsl(222, 84%, 4.9%)); margin-top: 0; border-radius: 0 0 12px 12px; border: 1px solid hsl(217, 32%, 15%); border-top: none;">
            <p style="color: hsl(215, 20%, 65%); font-size: 14px; margin: 0 0 12px 0; line-height: 1.5;">
              Need help? Contact us at 
              <a href="mailto:info@the3rdeyeadvisors.com" style="color: hsl(217, 91%, 70%); text-decoration: none; font-weight: 500;">info@the3rdeyeadvisors.com</a>
            </p>
            <p style="color: hsl(215, 20%, 50%); font-size: 12px; margin: 0;">
              © 2024 3rdeyeadvisors. Empowering DeFi consciousness.
            </p>
          </div>
        </div>
      `;
    } else {
      throw new Error('Invalid email type');
    }

    console.log(`Custom email prepared for ${type}: ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${type} email prepared`,
        subject,
        html: htmlContent 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in send-auth-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);