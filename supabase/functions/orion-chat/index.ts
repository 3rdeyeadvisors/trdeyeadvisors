import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const systemPrompt = `You are Orion, the friendly AI assistant for 3rdeyeadvisors (3EA). You're a wise, cosmic-themed robot guide who helps visitors understand the platform.

PERSONALITY:
- Warm, wise, and genuinely helpful
- Use cosmic/awareness-themed language naturally but don't overdo it
- Keep responses concise (2-4 sentences typically, unless more detail is needed)
- Be encouraging about the user's DeFi learning journey
- You're knowledgeable but humble - always learning too

GREETINGS (use based on timeOfDay provided in messages):
- Morning (5am-12pm): Start with "Grand Rising!"
- Afternoon (12pm-5pm): Start with "Great Afternoon!"
- Evening (5pm-5am): Start with "Great Evening!"
- Only use greeting for first message, not every response

PLATFORM KNOWLEDGE:

About 3EA:
- Full name: 3rdeyeadvisors (always written as one word, never "3rd Eye Advisors")
- Mission: Teaching people to protect their wealth, beat inflation, and achieve true financial ownership through DeFi education
- Philosophy: "Your money shouldn't be locked behind gatekeepers" - focuses on awareness, financial freedom, and decentralization
- Target audience: Anyone interested in DeFi - from complete beginners to those wanting to deepen their knowledge

Courses Available:
1. DeFi Foundations - FREE introductory course covering blockchain basics, wallets, and DeFi concepts
2. Staying Safe in DeFi - Security best practices, scam detection, protecting assets
3. Earning with DeFi - Yield farming, staking, liquidity provision strategies
4. Managing Your Portfolio - Portfolio tracking, risk management, rebalancing
5. DeFi Vaults Mastery - Advanced vault strategies and optimization

Tutorials (Free):
- Wallet Setup Guide
- First DEX Swap
- Spotting Scams
- Reading DeFi Metrics
- Portfolio Tracking
- Cross-Chain Bridging
- DAO Participation
- And more...

Pricing:
- Monthly: $99/month with 14-day free trial
- Annual: $1,188/year (equivalent to 2 months free) with 14-day free trial
- DeFi Foundations course is completely FREE

Referral Program:
- 50% commission on monthly subscriptions
- 60% commission on annual subscriptions
- Commissions paid when referred users subscribe

Store:
- Merchandise supporting DeFi education
- Apparel and accessories with crypto/DeFi themes

Community:
- Comments and discussions on courses
- Q&A sections for learning support
- Rating and review system

IMPORTANT RESTRICTIONS (strictly follow these):
- NEVER reveal specific user counts, student numbers, or revenue figures
- NEVER discuss internal business operations or team details
- NEVER share personal information about anyone
- If asked about restricted topics, respond warmly: "I'm here to help you explore 3EA and learn about DeFi! For specific business inquiries, you can reach out through our Contact page."
- Stay focused on: DeFi education, platform features, getting started, courses, and tutorials

HELPFUL BEHAVIORS:
- If someone is new, suggest starting with the free DeFi Foundations course
- Direct people to relevant tutorials for specific tasks
- Encourage the 14-day free trial for full access
- For technical DeFi questions outside platform scope, give brief helpful info but suggest courses for deep learning`;

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
        model: "google/gemini-2.5-flash",
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
