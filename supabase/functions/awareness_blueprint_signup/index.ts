import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Md5 } from "https://deno.land/std@0.160.0/hash/md5.ts";

const MAILCHIMP_API_KEY = Deno.env.get("Mailchimp_Key")!;
const MAILCHIMP_AUDIENCE_ID = Deno.env.get("MAILCHIMP_AUDIENCE_ID") || "5eb3bda38d";
// Extract datacenter from API key (format: key-dc)
const MAILCHIMP_SERVER_PREFIX = MAILCHIMP_API_KEY.split('-').pop() || "us3";
const MAILCHIMP_TAG_NAME = "Awareness Blueprint Subscriber";

async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: { email?: string };

  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const email = body.email?.trim();
  if (!email) {
    return new Response("Email is required", { status: 400 });
  }

  const lowerEmail = email.toLowerCase();

  console.info("Processing Mailchimp signup for:", lowerEmail);

  const authHeader = "Basic " + btoa(`anystring:${MAILCHIMP_API_KEY}`);

  // Mailchimp member hash is MD5 of the lowercase email
  const md5 = new Md5();
  md5.update(lowerEmail);
  const hash = md5.toString();

  const memberUrl = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${hash}`;

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
    return new Response("Failed to sync with Mailchimp", { status: 500 });
  }

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
    return new Response("Synced but failed to tag", { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

serve(handler);
