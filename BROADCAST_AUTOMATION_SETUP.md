# 3EA DeFi Broadcast Automation - Setup Guide

## Overview
This automation sends scheduled emails every Monday, Wednesday, and Friday at 9:00 AM Central Time to all subscribers. Content is dynamically injected via webhook from external sources (e.g., CoinGecko API).

## Architecture

### Components Created:
1. **Database Table**: `broadcast_email_queue` - Stores pending broadcast content
2. **Webhook Endpoint**: `3ea-broadcast` - Receives dynamic content via POST
3. **Scheduled Function**: `send-scheduled-broadcast` - Sends emails on schedule
4. **Email Template**: Dark, minimal, on-brand design with placeholder support

## Setup Instructions

### Step 1: Enable pg_cron Extension (REQUIRED)

**You must enable pg_cron in your Supabase dashboard:**

1. Go to: https://supabase.com/dashboard/project/zapbkuaejvzpqerkkcnc/database/extensions
2. Search for "pg_cron"
3. Click "Enable" on the pg_cron extension
4. Wait for it to activate (usually takes a few seconds)

### Step 2: Create the Cron Job

After enabling pg_cron, run this SQL in your Supabase SQL Editor:

```sql
-- Schedule the broadcast to run Mon/Wed/Fri at 9:00 AM Central Time (14:00 UTC)
SELECT cron.schedule(
  '3ea-defi-broadcast-mwf',
  '0 14 * * 1,3,5', -- 9 AM Central = 2 PM UTC (14:00)
  $$
  SELECT net.http_post(
    url := 'https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/send-scheduled-broadcast',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcGJrdWFlanZ6cHFlcmtrY25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NjAxMTksImV4cCI6MjA2ODUzNjExOX0.kmzeGjrbpI2qB5UhKoAOoEspxWYGk8UthowEA_f154o"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);
```

**Note:** The schedule uses UTC time. 9 AM Central Time = 14:00 UTC (2 PM UTC). Adjust if needed for daylight saving time.

### Step 3: Verify Cron Job

```sql
-- Check that the cron job was created
SELECT * FROM cron.job WHERE jobname = '3ea-defi-broadcast-mwf';
```

## Webhook Usage

### Webhook URL:
```
https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/3ea-broadcast
```

### Send Content via POST Request:

**Monday Example (Market Pulse):**
```json
{
  "day_type": "monday",
  "subject_line": "3EA Market Pulse: Top Movers",
  "intro_text": "Here are this week's top-performing DeFi tokens and their 24-hour performance metrics.",
  "market_block": "<h3>Top Movers</h3><ul><li><strong>Ethereum (ETH)</strong>: $2,450 <span style='color: #10b981;'>+5.2%</span></li><li><strong>Uniswap (UNI)</strong>: $8.75 <span style='color: #10b981;'>+12.4%</span></li><li><strong>Aave (AAVE)</strong>: $95.30 <span style='color: #ef4444;'>-2.1%</span></li></ul>",
  "cta_link": "https://the3rdeyeadvisors.com/courses"
}
```

**Wednesday Example (DeFi Trends):**
```json
{
  "day_type": "wednesday",
  "subject_line": "3EA DeFi Trends: What's Moving This Week",
  "intro_text": "Key trends shaping DeFi markets this week.",
  "market_block": "<h3>This Week's Trends</h3><p>🔥 <strong>Liquid Staking Dominance:</strong> LSTs now represent over $40B in TVL across major protocols.</p><p>📊 <strong>Cross-chain Activity:</strong> Bridge volume up 28% week-over-week.</p><p>⚡ <strong>Gas Optimizations:</strong> Layer 2 adoption continues accelerating with record-low fees.</p>",
  "cta_link": "https://the3rdeyeadvisors.com/blog"
}
```

**Friday Example (Education):**
```json
{
  "day_type": "friday",
  "subject_line": "3EA Learning Drop (DeFi Education)",
  "intro_text": "This week's DeFi education highlight: Understanding Impermanent Loss",
  "market_block": "<h3>📚 Understanding Impermanent Loss</h3><p><strong>What is it?</strong> Impermanent loss occurs when providing liquidity to automated market makers (AMMs). It represents the difference between holding tokens vs. providing liquidity.</p><p><strong>Key Takeaway:</strong> IL is temporary if token prices return to their original ratio. However, fees earned can offset the loss.</p><p><strong>Pro Tip:</strong> Use stable pairs (USDC/USDT) to minimize IL risk while earning fees.</p>",
  "cta_link": "https://the3rdeyeadvisors.com/courses/defi-mastery"
}
```

### cURL Example:
```bash
curl -X POST https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/3ea-broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "day_type": "monday",
    "subject_line": "3EA Market Pulse: Top Movers",
    "intro_text": "Here are this week'\''s top-performing DeFi tokens.",
    "market_block": "<h3>Top Movers</h3><p>ETH: $2,450 (+5.2%)</p>",
    "cta_link": "https://the3rdeyeadvisors.com"
  }'
```

## How It Works

1. **Webhook Receives Content**: External automation (e.g., CoinGecko API integration) sends JSON payload to the webhook endpoint
2. **Content Queued**: Data stored in `broadcast_email_queue` table with scheduled date
3. **Cron Triggers**: Every Mon/Wed/Fri at 9 AM Central, cron job calls `send-scheduled-broadcast`
4. **Email Sent**: Function checks for matching content, sends to all subscribers if found
5. **Logging**: All sends logged to `email_logs` table with status tracking

## Email Template Features

- **Dark, minimal design** matching 3rdeyeadvisors brand
- **Fully responsive** (mobile-friendly)
- **Dynamic placeholders**: `subject_line`, `intro_text`, `market_block`, `cta_link`
- **Professional footer** with disclaimer and links
- **Tag support**: All emails tagged as "3EA-subscriber" in Resend

## Subscriber Management

- **Auto-includes new subscribers**: Anyone who signs up is automatically added to future broadcasts
- **No duplicates**: Existing subscribers are not re-added
- **All from `subscribers` table**: Uses existing subscriber data

## Content Scheduling Logic

- If content is provided for Monday, it will send on the **next Monday** at 9 AM Central
- If no content exists for a scheduled day, **no email is sent** (prevents blank emails)
- Content can be pre-loaded for future dates
- Multiple pieces of content can be queued for different days

## Monitoring

### Check Pending Broadcasts:
```sql
SELECT * FROM broadcast_email_queue 
WHERE sent_at IS NULL 
ORDER BY scheduled_for;
```

### Check Sent Broadcasts:
```sql
SELECT * FROM broadcast_email_queue 
WHERE sent_at IS NOT NULL 
ORDER BY sent_at DESC;
```

### Check Email Logs:
```sql
SELECT * FROM email_logs 
WHERE email_type = '3ea-broadcast' 
ORDER BY created_at DESC 
LIMIT 50;
```

### View Cron Job Runs:
```sql
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = '3ea-defi-broadcast-mwf')
ORDER BY start_time DESC 
LIMIT 20;
```

## Troubleshooting

### Emails Not Sending?
1. Check if pg_cron is enabled
2. Verify cron job exists: `SELECT * FROM cron.job`
3. Check cron job logs: `SELECT * FROM cron.job_run_details`
4. Verify content exists: `SELECT * FROM broadcast_email_queue WHERE sent_at IS NULL`
5. Check edge function logs in Supabase dashboard

### Wrong Day/Time?
- Cron schedule is in UTC
- 9 AM Central = 14:00 UTC (15:00 during daylight saving)
- Adjust the cron schedule accordingly

### Duplicate Sends?
- The system marks broadcasts as sent with `sent_at` timestamp
- Each broadcast should only send once

## Testing

### Manual Trigger (for testing):
```bash
curl -X POST https://zapbkuaejvzpqerkkcnc.supabase.co/functions/v1/send-scheduled-broadcast \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcGJrdWFlanZ6cHFlcmtrY25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NjAxMTksImV4cCI6MjA2ODUzNjExOX0.kmzeGjrbpI2qB5UhKoAOoEspxWYGk8UthowEA_f154o"
```

### Test with Sample Content:
1. Send content via webhook (see examples above)
2. Manually trigger the send function
3. Check email logs for delivery status

## Important Notes

- **No website changes**: This automation only manages email sends, no frontend changes
- **Educational disclaimer**: All emails include "Educational purposes only. Not financial advice."
- **Resend limits**: Ensure your Resend account can handle the subscriber volume
- **Content validation**: Webhook validates required fields before queuing
- **Graceful skipping**: If no content for a day, simply skips (no error emails)

## Next Steps

1. ✅ Enable pg_cron extension in Supabase
2. ✅ Run the cron job SQL script
3. ✅ Test webhook with sample content
4. ✅ Connect your external automation (CoinGecko API, etc.)
5. ✅ Monitor first few sends to ensure everything works

---

**Ready to go!** Your 3EA DeFi Broadcast automation is set up and ready to receive content.
