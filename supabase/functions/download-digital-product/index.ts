import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    const { fileId } = await req.json();
    
    if (!fileId) {
      throw new Error("File ID is required");
    }

    // Get file info
    const { data: fileData, error: fileError } = await supabaseClient
      .from('digital_product_files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fileError || !fileData) {
      throw new Error("File not found");
    }

    // Check if user has purchased this product
    const { data: purchaseData, error: purchaseError } = await supabaseClient
      .from('user_purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', fileData.product_id);

    if (purchaseError || !purchaseData || purchaseData.length === 0) {
      throw new Error("Product not purchased. Please buy the product first.");
    }

    // Generate signed URL for download
    const { data: urlData, error: urlError } = await supabaseClient.storage
      .from('digital-products')
      .createSignedUrl(fileData.file_path, 3600); // 1 hour expiry

    if (urlError || !urlData) {
      throw new Error("Failed to generate download link");
    }

    return new Response(
      JSON.stringify({ 
        downloadUrl: urlData.signedUrl,
        fileName: fileData.file_name,
        fileType: fileData.file_type
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Download error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});