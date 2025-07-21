import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

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

    // Create custom email content based on type
    let subject: string;
    let htmlContent: string;

    if (type === 'signup') {
      subject = 'Welcome to 3rdeyeadvisors! 🚀';
      htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00d4ff; font-size: 28px; margin: 0;">Welcome to 3rdeyeadvisors!</h1>
            <p style="color: #666; font-size: 16px; margin: 10px 0;">Your DeFi Education Journey Starts Now</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #0a0a0a, #1a1a1a); padding: 30px; border-radius: 12px; color: white; margin: 20px 0;">
            <h2 style="color: #00d4ff; margin: 0 0 15px 0;">🎉 Account Successfully Created!</h2>
            <p style="line-height: 1.6; margin: 0 0 20px 0;">
              Welcome to the community! Your account is now active and you can start exploring our comprehensive DeFi education platform.
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${redirect_url || 'https://3rdeyeadvisors.com'}" 
                 style="background: #00d4ff; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Start Learning Now
              </a>
            </div>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin: 0 0 15px 0;">🚀 What's Next?</h3>
            <ul style="color: #666; line-height: 1.6; padding-left: 20px;">
              <li>Explore our comprehensive course library</li>
              <li>Start with DeFi Foundations for beginners</li>
              <li>Join our community discussions</li>
              <li>Track your learning progress</li>
            </ul>
          </div>

          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Questions? Reply to this email or contact us at <a href="mailto:support@3rdeyeadvisors.com" style="color: #00d4ff;">support@3rdeyeadvisors.com</a>
            </p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
              © 2024 3rdeyeadvisors. All rights reserved.
            </p>
          </div>
        </div>
      `;
    } else if (type === 'recovery') {
      subject = 'Reset Your 3rdeyeadvisors Password 🔑';
      htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #00d4ff; font-size: 28px; margin: 0;">Password Reset Request</h1>
            <p style="color: #666; font-size: 16px; margin: 10px 0;">3rdeyeadvisors Account Security</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #0a0a0a, #1a1a1a); padding: 30px; border-radius: 12px; color: white; margin: 20px 0;">
            <h2 style="color: #00d4ff; margin: 0 0 15px 0;">🔑 Reset Your Password</h2>
            <p style="line-height: 1.6; margin: 0 0 20px 0;">
              We received a request to reset your password for your 3rdeyeadvisors account. Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${redirect_url || 'https://3rdeyeadvisors.com/auth?reset=true'}" 
                 style="background: #00d4ff; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #ccc; margin: 20px 0 0 0;">
              This link will expire in 24 hours for security reasons.
            </p>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
            </p>
          </div>

          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Need help? Contact us at <a href="mailto:support@3rdeyeadvisors.com" style="color: #00d4ff;">support@3rdeyeadvisors.com</a>
            </p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
              © 2024 3rdeyeadvisors. All rights reserved.
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