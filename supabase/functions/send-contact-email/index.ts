import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Input validation functions
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 100 && /^[a-zA-Z\s'-]+$/.test(name);
};

const validateSubject = (subject: string): boolean => {
  return subject.length >= 5 && subject.length <= 200;
};

const validateMessage = (message: string): boolean => {
  return message.length >= 10 && message.length <= 2000;
};

// Rate limiting function
const checkRateLimit = async (email: string, ipAddress: string): Promise<boolean> => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  try {
    // Check submissions in the last hour for this email or IP
    const { data: recentSubmissions, error } = await supabase
      .from('contact_submissions')
      .select('id')
      .or(`email.eq.${email},ip_address.eq.${ipAddress}`)
      .gte('submitted_at', oneHourAgo.toISOString());

    if (error) {
      console.error('Rate limit check error:', error);
      return false; // Fail safe - deny if we can't check
    }

    return (recentSubmissions?.length || 0) < 3; // Max 3 submissions per hour
  } catch (error) {
    console.error('Rate limit check error:', error);
    return false;
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received contact form request:", JSON.stringify({ email: req.headers.get('content-type'), method: req.method }));
    const { name, email, subject, message }: ContactFormRequest = await req.json();
    console.log("Parsed form data:", { name: name?.substring(0, 10), email: email?.substring(0, 15), hasSubject: !!subject, hasMessage: !!message });

    // Input validation
    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Invalid email address" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!validateName(name)) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Invalid name format" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!validateSubject(subject)) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Subject must be between 5 and 200 characters" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!validateMessage(message)) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Message must be between 10 and 2000 characters" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    // Check rate limiting
    const canSubmit = await checkRateLimit(email, clientIP);
    if (!canSubmit) {
      return new Response(JSON.stringify({ 
        success: false,
        error: "Too many submissions. Please try again later." 
      }), {
        status: 429,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Sanitize inputs for display
    const sanitizedName = sanitizeInput(name);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

    // Record the submission
    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        email,
        name: sanitizedName,
        subject: sanitizedSubject,
        ip_address: clientIP
      });

    if (insertError) {
      console.error('Error recording submission:', insertError);
      // Continue anyway - don't fail the email send for this
    }

    // Send email to info
    const supportEmailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["info@the3rdeyeadvisors.com"],
      subject: `Contact Form: ${sanitizedSubject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${sanitizedName} (${email})</p>
        <p><strong>Subject:</strong> ${sanitizedSubject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${sanitizedMessage.replace(/\n/g, '<br>')}
        </div>
        <hr>
        <p style="font-size: 12px; color: #666;">
          This email was sent from the 3rdeyeadvisors contact form.
        </p>
      `,
    });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "We received your message!",
      html: `
        <h1>Thank you for contacting us, ${sanitizedName}!</h1>
        <p>We have received your message regarding: <strong>${sanitizedSubject}</strong></p>
        <p>We typically respond within 24 hours during weekdays. For urgent matters, we'll prioritize your inquiry.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Your Message:</h3>
          <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
        </div>
        
        <p>Thank you for your patience as we work to support your journey toward financial consciousness.</p>
        <p>Best regards,<br>The 3rdeyeadvisors Team</p>
        
        <hr>
        <p style="font-size: 12px; color: #666;">
          This is an automated response. Please do not reply to this email.
        </p>
      `,
    });

    // Log successful submission without exposing sensitive data
    console.log("Contact form submission processed for:", email.replace(/(.{2})(.*)(@.*)/, '$1***$3'));

    return new Response(JSON.stringify({ 
      success: true,
      message: "Email sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error?.message || 'Unknown error');
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "An error occurred while processing your request. Please try again later." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);