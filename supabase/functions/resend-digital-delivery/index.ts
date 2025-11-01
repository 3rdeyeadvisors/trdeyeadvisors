import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(JSON.stringify({ error: 'Order ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log(`Resending digital delivery email for order: ${order_id}`);

    // Get existing downloads for this order
    const { data: downloads, error: downloadsError } = await supabase
      .from('digital_downloads')
      .select('*')
      .eq('order_id', order_id);

    if (downloadsError || !downloads || downloads.length === 0) {
      return new Response(JSON.stringify({ error: 'No digital items found for this order' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Generate new tokens and update expiry
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 7);

    const updatedDownloads = [];

    for (const download of downloads) {
      const newToken = crypto.randomUUID();
      
      const { data: updated, error: updateError } = await supabase
        .from('digital_downloads')
        .update({
          download_token: newToken,
          expires_at: newExpiryDate.toISOString(),
          download_count: 0, // Reset download count
          updated_at: new Date().toISOString()
        })
        .eq('id', download.id)
        .select()
        .single();

      if (!updateError && updated) {
        updatedDownloads.push({
          product_id: updated.product_id,
          product_name: updated.product_name,
          download_token: updated.download_token
        });
      }
    }

    // Send the email
    const customer_email = downloads[0].user_email;
    const customer_name = customer_email.split('@')[0]; // Simple fallback

    const { error: emailError } = await supabase.functions.invoke('send-digital-delivery-email', {
      body: {
        order_id,
        customer_email,
        customer_name,
        digital_items: updatedDownloads
      }
    });

    if (emailError) {
      throw emailError;
    }

    // Log the resend action
    await supabase.from('order_action_logs').insert({
      order_id,
      action_type: 'download_email_resent',
      status: 'success',
      metadata: { digital_items_count: updatedDownloads.length }
    });

    console.log(`Digital delivery email resent successfully for order: ${order_id}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Digital delivery email resent successfully',
      items_count: updatedDownloads.length 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error resending digital delivery email:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
