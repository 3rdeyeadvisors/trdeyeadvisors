import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterEmailRequest {
  blogTitle: string;
  blogExcerpt: string;
  blogUrl: string;
  blogDate?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { blogTitle, blogExcerpt, blogUrl, blogDate }: NewsletterEmailRequest = await req.json();

    console.log("Sending newsletter for blog:", blogTitle);
    console.log("Blog URL:", blogUrl);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from("subscribers")
      .select("email, name");

    if (fetchError) {
      console.error("Error fetching subscribers:", fetchError);
      throw new Error("Failed to fetch subscribers");
    }

    // Fetch all registered users with profiles
    const { data: usersWithProfiles, error: usersError } = await supabase
      .rpc('get_user_emails_with_profiles');

    if (usersError) {
      console.error("Error fetching users:", usersError);
      // Continue with just subscribers if users fetch fails
    }

    // Build recipient list, avoiding duplicates
    const recipientMap = new Map<string, { email: string; name: string }>();

    // Add subscribers
    if (subscribers) {
      for (const sub of subscribers) {
        const email = sub.email.toLowerCase();
        if (!recipientMap.has(email)) {
          recipientMap.set(email, {
            email: sub.email,
            name: sub.name || "Reader"
          });
        }
      }
    }

    // Add registered users
    if (usersWithProfiles) {
      for (const user of usersWithProfiles) {
        const email = user.email.toLowerCase();
        if (!recipientMap.has(email)) {
          recipientMap.set(email, {
            email: user.email,
            name: user.display_name || "Reader"
          });
        }
      }
    }

    const recipients = Array.from(recipientMap.values());

    if (recipients.length === 0) {
      console.log("No recipients found");
      return new Response(
        JSON.stringify({ message: "No recipients to send to" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Found ${recipients.length} total recipients (subscribers + account holders, deduplicated)`);

    // Format date for email
    const formattedDate = blogDate 
      ? new Date(blogDate + 'T12:00:00').toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });

    // Send emails to all recipients
    const emailPromises = recipients.map((recipient) => {
      const firstName = recipient.name ? recipient.name.split(" ")[0] : "Reader";
      
      return resend.emails.send({
        from: "3rdeyeadvisors <info@the3rdeyeadvisors.com>",
        to: [recipient.email],
        subject: `New Blog Post: ${blogTitle}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  background-color: #0a0a0a;
                  color: #e0e0e0;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: linear-gradient(135deg, #1a0b2e 0%, #0a0a0a 100%);
                  border: 1px solid rgba(139, 92, 246, 0.2);
                }
                .header {
                  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
                  padding: 40px 30px;
                  text-align: center;
                }
                .header h1 {
                  margin: 0;
                  color: #ffffff;
                  font-size: 28px;
                  font-weight: 700;
                  letter-spacing: -0.5px;
                }
                .content {
                  padding: 40px 30px;
                }
                .greeting {
                  font-size: 18px;
                  color: #e0e0e0;
                  margin-bottom: 20px;
                }
                .blog-date {
                  font-size: 14px;
                  color: #8b5cf6;
                  margin-bottom: 10px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .blog-title {
                  font-size: 24px;
                  font-weight: 700;
                  color: #ffffff;
                  margin: 15px 0;
                  line-height: 1.3;
                }
                .blog-excerpt {
                  font-size: 16px;
                  line-height: 1.7;
                  color: #c0c0c0;
                  margin-bottom: 30px;
                }
                .cta-button {
                  display: inline-block;
                  padding: 16px 40px;
                  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 600;
                  font-size: 16px;
                  margin: 20px 0;
                }
                .footer {
                  padding: 30px;
                  text-align: center;
                  border-top: 1px solid rgba(139, 92, 246, 0.2);
                  background: rgba(0, 0, 0, 0.3);
                }
                .footer p {
                  margin: 5px 0;
                  font-size: 14px;
                  color: #808080;
                }
                .footer a {
                  color: #8b5cf6;
                  text-decoration: none;
                }
                .tagline {
                  font-size: 14px;
                  color: #a0a0a0;
                  font-style: italic;
                  margin-top: 25px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>3rdeyeadvisors</h1>
                </div>
                
                <div class="content">
                  <p class="greeting">Hey ${firstName},</p>
                  
                  <p style="color: #e0e0e0; line-height: 1.6;">
                    We just published a new educational blog post that you might find valuable:
                  </p>
                  
                  <p class="blog-date">Published ${formattedDate}</p>
                  <h2 class="blog-title">${blogTitle}</h2>
                  
                  <p class="blog-excerpt">${blogExcerpt}</p>
                  
                  <center>
                    <a href="${blogUrl}" class="cta-button">Read Full Article →</a>
                  </center>
                  
                  <p class="tagline">Awaken Awareness. Recode the System.</p>
                </div>
                
                <div class="footer">
                  <p><strong>3rdeyeadvisors</strong></p>
                  <p>Empowering conscious investors with DeFi education</p>
                  <p style="margin-top: 15px;">
                    <a href="https://www.the3rdeyeadvisors.com">Visit Website</a> | 
                    <a href="https://www.the3rdeyeadvisors.com/courses">Explore Courses</a>
                  </p>
                  <p style="margin-top: 15px; font-size: 12px;">
                    You're receiving this because you subscribed or have an account with us.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    });

    const results = await Promise.allSettled(emailPromises);
    
    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    // Log failed emails for debugging
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`Failed to send to ${recipients[index].email}:`, result.reason);
      }
    });

    console.log(`Newsletter sent: ${successful} successful, ${failed} failed`);

    // Log to email_logs table
    await supabase.from("email_logs").insert({
      email_type: "blog_newsletter",
      edge_function_name: "send-newsletter-email",
      recipient_email: `batch_${recipients.length}_recipients`,
      status: failed === 0 ? "success" : "partial",
      metadata: {
        blogTitle,
        blogUrl,
        totalRecipients: recipients.length,
        successful,
        failed
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        sent: successful,
        failed: failed,
        total: recipients.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-newsletter-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);