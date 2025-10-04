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

    console.log("Starting digital product file uploads...");

    // Define the files to upload with their local paths and storage paths
    const filesToUpload = [
      {
        localPath: "./public/resources/defi-mastery-complete-guide.pdf",
        storagePath: "defi-mastery-complete-guide.pdf",
        contentType: "application/pdf",
      },
      {
        localPath: "./public/resources/defi-portfolio-tracker.csv",
        storagePath: "defi-portfolio-tracker.csv",
        contentType: "text/csv",
      },
      {
        localPath: "./public/resources/advanced-defi-strategies.pdf",
        storagePath: "advanced-defi-strategies.pdf",
        contentType: "application/pdf",
      },
      {
        localPath: "./public/resources/yield-farming-calculator.csv",
        storagePath: "yield-farming-calculator.csv",
        contentType: "text/csv",
      },
      {
        localPath: "./public/resources/security-audit-checklist.pdf",
        storagePath: "security-audit-checklist.pdf",
        contentType: "application/pdf",
      },
      {
        localPath: "./public/resources/defi-comparison.pdf",
        storagePath: "defi-comparison.pdf",
        contentType: "application/pdf",
      },
    ];

    const results = [];

    for (const file of filesToUpload) {
      try {
        console.log(`Reading file: ${file.localPath}`);
        
        // Read the file content
        const fileContent = await Deno.readFile(file.localPath);
        
        console.log(`Uploading to storage: ${file.storagePath}`);
        
        // Upload to Supabase Storage
        const { data, error } = await supabaseClient.storage
          .from("digital-products")
          .upload(file.storagePath, fileContent, {
            contentType: file.contentType,
            upsert: true, // Overwrite if exists
          });

        if (error) {
          console.error(`Error uploading ${file.storagePath}:`, error);
          results.push({
            file: file.storagePath,
            success: false,
            error: error.message,
          });
        } else {
          console.log(`Successfully uploaded: ${file.storagePath}`);
          results.push({
            file: file.storagePath,
            success: true,
            path: data.path,
          });
        }
      } catch (fileError) {
        console.error(`Error processing ${file.localPath}:`, fileError);
        results.push({
          file: file.storagePath,
          success: false,
          error: fileError.message,
        });
      }
    }

    // Count successes and failures
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`Upload complete: ${successCount} succeeded, ${failureCount} failed`);

    return new Response(
      JSON.stringify({
        message: `Upload complete: ${successCount} succeeded, ${failureCount} failed`,
        results,
        summary: {
          total: filesToUpload.length,
          succeeded: successCount,
          failed: failureCount,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Upload function error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to upload digital product files"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
