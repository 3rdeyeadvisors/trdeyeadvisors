

# Feature Idea Submission System for Premium Members

## Overview
Add a section to the Roadmap page where premium members (Founding 33 and Annual subscribers) can submit feature ideas that you (the admin) can review on the backend and optionally promote to a public vote.

---

## What Will Be Built

### 1. Database - New `feature_suggestions` Table
A new table to store submitted ideas:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Who submitted it (references auth.users) |
| title | text | Feature title (required, max 100 chars) |
| description | text | Detailed description (required, max 1000 chars) |
| status | text | 'pending' / 'approved' / 'rejected' / 'promoted' |
| admin_notes | text | Admin-only notes (not visible to users) |
| created_at | timestamp | When submitted |
| reviewed_at | timestamp | When admin reviewed it |

Row Level Security:
- Premium members can INSERT their own suggestions
- All authenticated users can SELECT (so everyone can see submitted ideas)
- Only admins can UPDATE status

### 2. Roadmap Page - New "Submit Your Idea" Section
A new section above the current CTA that includes:

**For Premium Members (canVote = true):**
- Collapsible form with title input and description textarea
- Character limits displayed (100 for title, 1000 for description)
- Submit button with loading state
- Success/error toast notifications

**For Non-Premium Users:**
- Shows the section but with a message explaining only premium members can submit
- Upgrade CTA button linking to subscription page

**For Everyone:**
- List of recently submitted ideas (last 5-10)
- Shows title, truncated description, submitter name, and status badge
- Click to expand full description in a dialog

### 3. Admin Dashboard - New "Feature Suggestions" Panel
Add a new tab/section to the admin RoadmapManager showing:
- Table of all submitted suggestions
- Filter by status (pending/approved/rejected/promoted)
- For each suggestion: title, description, submitter info, date
- Action buttons:
  - "Promote to Vote" - creates a new roadmap_item from the suggestion
  - "Approve" - marks as approved (for potential future use)
  - "Reject" - marks as rejected with optional notes

---

## UI/UX Design

### Submit Form (Premium Members)
```
+--------------------------------------------------+
| [Lightbulb Icon] Submit Your Feature Idea        |
|--------------------------------------------------|
| Share your ideas and help shape the platform     |
|                                                  |
| Title (100 chars max)                            |
| [____________________________________] 23/100    |
|                                                  |
| Description (1000 chars max)                     |
| [                                     ]          |
| [    Describe your feature idea...    ]          |
| [                                     ] 156/1000 |
|                                                  |
|              [Cancel] [Submit Idea]              |
+--------------------------------------------------+
```

### Recent Ideas List
```
+--------------------------------------------------+
| Recent Community Ideas                           |
|--------------------------------------------------|
| [Pending] Dark mode for charts - by @user1       |
|   "Add ability to toggle dark mode on..."        |
|   Click to read more                             |
|--------------------------------------------------|
| [Under Review] Mobile app notifications          |
|   "Push notifications for price alerts..."       |
|   Click to read more                             |
+--------------------------------------------------+
```

### Non-Premium View
```
+--------------------------------------------------+
| [Lock Icon] Premium Feature                      |
|--------------------------------------------------|
| Annual and Founding 33 members can submit        |
| feature ideas for consideration.                 |
|                                                  |
|              [View Plans ->]                     |
+--------------------------------------------------+
```

---

## Technical Implementation

### Files to Create
| File | Purpose |
|------|---------|
| `supabase/migrations/[timestamp]_feature_suggestions.sql` | New table + RLS policies |
| `src/hooks/useFeatureSuggestions.tsx` | Hook for CRUD operations |
| `src/components/roadmap/FeatureSuggestionForm.tsx` | Submit form component |
| `src/components/roadmap/FeatureSuggestionsList.tsx` | List of recent ideas |
| `src/components/admin/FeatureSuggestionsManager.tsx` | Admin review panel |

### Files to Modify
| File | Changes |
|------|---------|
| `src/pages/Roadmap.tsx` | Add new section with form + list |
| `src/components/admin/RoadmapManager.tsx` | Add tab for suggestions |
| `src/integrations/supabase/types.ts` | Auto-updated after migration |

### Database Migration
```sql
-- Create feature_suggestions table
CREATE TABLE public.feature_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) <= 100),
  description text NOT NULL CHECK (char_length(description) <= 1000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'promoted')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

-- Enable RLS
ALTER TABLE public.feature_suggestions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can view suggestions"
  ON public.feature_suggestions FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Premium members can insert suggestions"
  ON public.feature_suggestions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Admin update handled via edge function or security definer
```

### Premium Check Logic
Reuse existing logic from useRoadmapVotes:
```typescript
const canSubmit = canVote; // Same eligibility as voting
```

---

## Responsive Design Considerations

- Form inputs use full width on mobile, max-width on desktop
- Character counters positioned right-aligned on all screen sizes
- Suggestion cards stack vertically on mobile
- Dialog for full description works on all devices
- Button groups stack vertically on mobile (< 640px)
- Proper padding: `p-4` mobile, `p-6` desktop
- Grid: 1 column mobile, 2 columns tablet, 3 columns desktop for suggestion cards

---

## Post-Implementation Audit Checklist

After implementation, verify:

1. **Database**: Table created with correct constraints and RLS
2. **Form Validation**: Character limits enforced, required fields work
3. **Premium Check**: Non-premium users cannot submit (UI hidden + RLS backup)
4. **Responsive Layout**: Test on mobile (375px), tablet (768px), desktop (1440px)
5. **Dialog Behavior**: Full description modal opens/closes correctly
6. **Admin Panel**: Can view, filter, and promote suggestions
7. **Promote Flow**: Promoted suggestion creates roadmap item correctly
8. **Toast Notifications**: Success/error states show properly
9. **Loading States**: Buttons disable during submission
10. **Empty States**: Graceful handling when no suggestions exist

