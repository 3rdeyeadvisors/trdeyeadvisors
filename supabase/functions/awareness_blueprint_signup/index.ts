import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const MAILCHIMP_API_KEY = Deno.env.get("Mailchimp_Key")!;
const MAILCHIMP_AUDIENCE_ID = Deno.env.get("MAILCHIMP_AUDIENCE_ID") || "5eb3bda38d";
const MAILCHIMP_SERVER_PREFIX = "us3"; // datacenter
const MAILCHIMP_TAG_NAME = "Awareness Blueprint Subscriber";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  let body: { email?: string };

  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const email = body.email?.trim();
  if (!email) {
    return new Response("Email is required", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const lowerEmail = email.toLowerCase();

  console.log("Processing Mailchimp signup for:", lowerEmail);

  const authHeader = "Basic " + btoa(`anystring:${MAILCHIMP_API_KEY}`);

  // Calculate MD5 hash for Mailchimp member ID
  const encoder = new TextEncoder();
  const data = encoder.encode(lowerEmail);
  const digest = await crypto.subtle.digest("MD5", data);
  const hash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const memberUrl = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${hash}`;

  // Upsert member
  const memberRes = await fetch(memberUrl, {
    method: "PUT",
    headers: {
      "Authorization": authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: lowerEmail,
      status_if_new: "subscribed",
    }),
  });

  if (!memberRes.ok) {
    const errorText = await memberRes.text();
    console.error("Mailchimp member error:", errorText);
    return new Response("Failed to sync with Mailchimp", { 
      status: 500,
      headers: corsHeaders 
    });
  }

  console.log("Member synced successfully");

  // Apply tag
  const tagRes = await fetch(`${memberUrl}/tags`, {
    method: "POST",
    headers: {
      "Authorization": authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tags: [{ name: MAILCHIMP_TAG_NAME, status: "active" }],
    }),
  });

  if (!tagRes.ok) {
    const errorText = await tagRes.text();
    console.error("Mailchimp tag error:", errorText);
    return new Response("Synced but failed to tag", { 
      status: 500,
      headers: corsHeaders 
    });
  }

  console.log("Tag applied successfully");

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 
      "Content-Type": "application/json",
      ...corsHeaders 
    },
  });
}

serve(handler);
