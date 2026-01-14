import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const systemPrompt = `You are Orion, a helpful AI assistant for 3rdeyeadvisors (3EA).

RESPONSE RULES (ALWAYS FOLLOW):
- Keep responses SHORT and DIRECT. 2-4 sentences for simple questions.
- NEVER use markdown formatting. No asterisks, no hashtags, no bullet dashes, no bold, no italics.
- Use plain text only. Write naturally like a conversation.
- Answer what is asked. Do not add extra context unless requested.
- Do not repeat the question. Do not say "Great question!"
- Be professional and conversational. Not academic or robotic.
- If asked to elaborate, then provide more detail. Otherwise stay brief.

GREETINGS (first message only):
- Morning (5am-12pm): "Grand Rising!"
- Afternoon (12pm-5pm): "Great Afternoon!"
- Evening (5pm-5am): "Great Evening!"

PLATFORM KNOWLEDGE:
3rdeyeadvisors teaches DeFi education for financial freedom and wealth protection.

Courses: DeFi Foundations (FREE), Staying Safe in DeFi, Earning with DeFi, Managing Your Portfolio, DeFi Vaults Mastery.

Pricing: Monthly $99/month, Annual $1,188/year. Both include 14-day free trial.

Referral: 50% monthly / 60% annual commission.

RESTRICTIONS:
- Never reveal user counts, revenue, or internal metrics.
- Never provide harmful, illegal, or unethical information.
- For business inquiries: suggest the Contact page.

BEHAVIOR:
- If someone is new to DeFi, mention the free DeFi Foundations course.
- Connect to 3EA resources when naturally relevant.
- Be helpful, not pushy.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, timeOfDay } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Add time context to system message
    const systemWithTime = `${systemPrompt}\n\nCurrent time of day for the user: ${timeOfDay}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemWithTime },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "I'm a bit overwhelmed right now. Please try again in a moment!" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Orion chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
