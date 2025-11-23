# ⚠️ DEPRECATED - DO NOT USE

**This function has been deprecated as of 2025-01-23**

## Reason
All marketing and nurture emails are now handled exclusively by Mailchimp's 18-day automation sequence. This function was creating duplicate welcome emails.

## Replacement
- **Mailchimp** handles all welcome emails and nurture sequences
- New signups are synced to Mailchimp via `mailchimp-sync` function
- Database trigger `notify_new_signup_mailchimp_only` handles the sync

## Status
- ❌ **DO NOT CALL** this function
- ❌ **DO NOT RE-ENABLE** database triggers for this function
- ✅ Function code preserved for reference only
- ✅ All triggers have been removed

## Lovable/Supabase Email Scope (Current)
Lovable/Supabase ONLY handles:
- Authentication emails (magic links, password resets, verification codes)
- Transactional emails (order confirmations, digital delivery)
- System notifications (raffle wins, course unlocks)

## See Also
- `supabase/functions/mailchimp-sync/` - Active Mailchimp sync function
- Database migration: Disabled marketing email triggers
