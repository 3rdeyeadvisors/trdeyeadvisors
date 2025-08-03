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

interface NotificationPayload {
  table: string;
  record: {
    id: string;
    email: string;
    name?: string;
    display_name?: string;
    created_at: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: NotificationPayload = await req.json();
    console.log('Received notification payload:', payload);

    const { table, record } = payload;
    const email = record.email;
    const name = record.name || record.display_name || 'Not provided';
    
    // Determine the type of signup
    const signupType = table === 'subscribers' ? 'subscriber' : 'user signup';
    
    // Send notification email
    const emailResponse = await resend.emails.send({
      from: "3rdeyeadvisors <notifications@the3rdeyeadvisors.com>",
      to: ["info@the3rdeyeadvisors.com"],
      subject: `New ${signupType === 'subscriber' ? 'Subscriber' : 'Signup'} on 3rdeyeadvisors`,
      html: `
        <h2>New ${signupType === 'subscriber' ? 'Subscriber' : 'User Signup'} Alert</h2>
        <p>A new ${signupType} has been added to your website.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Details:</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Table:</strong> ${table}</p>
          <p><strong>Date:</strong> ${new Date(record.created_at).toLocaleString()}</p>
          <p><strong>User ID:</strong> ${record.id}</p>
        </div>
        
        <p>You can view this information in your <a href="https://supabase.com/dashboard/project/zapbkuaejvzpqerkkcnc">Supabase dashboard</a>.</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated notification from your 3rdeyeadvisors website.
        </p>
      `,
    });

    console.log("Notification email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notification sent for new ${signupType}`,
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
    console.error("Error in notify-new-signup function:", error);
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