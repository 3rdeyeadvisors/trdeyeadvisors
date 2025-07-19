import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { topic, type } = await req.json()
    
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not configured')
    }

    let prompt = ''
    
    switch (type) {
      case 'comparison':
        prompt = `Create a detailed comparison between DeFi and Traditional Finance. Include specific metrics, advantages, disadvantages, fees, access requirements, security aspects, and real-world examples. Format as a structured document with clear sections and bullet points.`
        break
      case 'risk-checklist':
        prompt = `Create a comprehensive DeFi risk assessment checklist for beginners and intermediate users. Include smart contract risks, impermanent loss, regulatory risks, security practices, due diligence steps, and red flags to avoid. Format as an actionable checklist with explanations.`
        break
      case 'security-guide':
        prompt = `Create a comprehensive DeFi security best practices guide. Include wallet security, private key management, phishing prevention, smart contract interaction safety, transaction verification, and emergency procedures. Include specific tools and software recommendations.`
        break
      default:
        throw new Error('Invalid content type')
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a DeFi expert creating educational content. Be precise, factual, and include current data when available. Format content clearly with sections and actionable information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate content with Perplexity')
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    return new Response(
      JSON.stringify({ content }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})