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
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(JSON.stringify({ error: 'Download token is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log(`Processing download request for token: ${token}`);

    // Fetch download record
    const { data: download, error: downloadError } = await supabase
      .from('digital_downloads')
      .select('*')
      .eq('download_token', token)
      .single();

    if (downloadError || !download) {
      console.error('Download not found:', downloadError);
      return new Response(JSON.stringify({ error: 'Invalid or expired download link' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Check expiry
    if (new Date(download.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'Download link has expired' }), {
        status: 410,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Check download count
    if (download.download_count >= download.max_downloads) {
      return new Response(JSON.stringify({ error: 'Download limit reached' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Get file IDs
    const fileIds = download.file_ids as string[];
    
    if (!fileIds || fileIds.length === 0) {
      return new Response(JSON.stringify({ error: 'No files available' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // For simplicity, return the first file. In production, you might want to create a ZIP
    const fileId = fileIds[0];

    // Get file info from digital_product_files
    const { data: fileInfo, error: fileError } = await supabase
      .from('digital_product_files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fileError || !fileInfo) {
      console.error('File not found:', fileError);
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Generate signed URL (valid for 1 hour)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('digital-products')
      .createSignedUrl(fileInfo.file_path, 3600);

    if (urlError || !signedUrlData) {
      console.error('Error generating signed URL:', urlError);
      return new Response(JSON.stringify({ error: 'Failed to generate download link' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Increment download count
    await supabase
      .from('digital_downloads')
      .update({ 
        download_count: download.download_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', download.id);

    console.log(`Download successful for token: ${token}, count: ${download.download_count + 1}`);

    // Redirect to the signed URL
    return new Response(null, {
      status: 302,
      headers: {
        'Location': signedUrlData.signedUrl,
        ...corsHeaders
      },
    });

  } catch (error: any) {
    console.error('Error processing download:', error);
    
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
