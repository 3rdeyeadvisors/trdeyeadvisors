

# Roadmap Voting Enhancement Plan

## Overview
This plan adds two features to the Roadmap voting system:
1. **Yes/No voting options** - Replace the single "Vote" button with separate "Yes" and "No" buttons
2. **Expandable description modal** - Click on a roadmap card to see the full description in a popup dialog

---

## Current Behavior
- Users can only upvote (single "Vote" button)
- Descriptions are truncated with `line-clamp-2` (shows only 2 lines)
- No way to read the full description

---

## Changes Summary

### 1. Database Migration
Add a `vote_type` column to track yes/no votes:

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `vote_type` | text | 'yes' | Either 'yes' or 'no' |

The total vote count will be calculated as: `SUM(yes_votes) - SUM(no_votes)`

### 2. RoadmapCard Component Updates
- Make the card clickable to open a detail dialog
- Replace single "Vote" button with "Yes" and "No" buttons side by side
- Show separate vote counts for yes and no
- Add visual indicators (thumbs up/down or similar icons)

### 3. Detail Dialog
- Opens when clicking anywhere on the card (except buttons)
- Shows full title, complete description, voting status
- Includes the yes/no voting buttons in the dialog too

### 4. Hook Updates (`useRoadmapVotes`)
- Update `castVote` to accept vote type ('yes' | 'no')
- Update vote counting to show net score or separate counts
- Track user's vote type for UI state

---

## Technical Details

### Database Migration
```sql
ALTER TABLE roadmap_votes 
ADD COLUMN vote_type text DEFAULT 'yes' 
CHECK (vote_type IN ('yes', 'no'));
```

### Updated Vote Calculation
Instead of summing all vote weights:
- **Yes votes**: Sum of vote_weight where vote_type = 'yes'
- **No votes**: Sum of vote_weight where vote_type = 'no'  
- **Net score**: Yes votes - No votes (or show both separately)

### UI Layout (RoadmapCard)
```text
+------------------------------------------+
| [Title]                    [Status Badge] |
| [Countdown timer]                         |
|-------------------------------------------|
| Description preview (2 lines)...          |
| "Click to read more"                      |
|-------------------------------------------|
| Support: +15 / -3 net                     |
| [========----------] progress bar         |
|-------------------------------------------|
| [3x badge]     [Yes ✓] [No ✗]            |
+------------------------------------------+
```

### Detail Dialog Layout
```text
+------------------------------------------+
|              Feature Title            [X] |
|-------------------------------------------|
| [In Progress Badge]     [3d 5h left]     |
|-------------------------------------------|
| Full description text that can be        |
| as long as needed, with proper           |
| formatting and line breaks...            |
|-------------------------------------------|
| Current Support: +15 yes, -3 no          |
| [========----------]                     |
|-------------------------------------------|
|        [Yes ✓ Vote]  [No ✗ Vote]         |
+------------------------------------------+
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/migrations/` | New migration adding `vote_type` column |
| `src/hooks/useRoadmapVotes.tsx` | Update castVote, vote calculation, track vote type |
| `src/components/roadmap/RoadmapCard.tsx` | Add dialog, yes/no buttons, click handler |
| `src/integrations/supabase/types.ts` | Auto-updated after migration |

---

## User Experience Flow

1. **Browsing**: User sees cards with truncated descriptions and "Click to read more" hint
2. **Reading**: Clicking a card opens a dialog with full details
3. **Voting**: User clicks either "Yes" (support) or "No" (oppose) button
4. **Feedback**: Vote is recorded with appropriate weight (1x or 3x), UI updates immediately
5. **Changing vote**: User can switch from Yes to No (or vice versa) by clicking the other button

