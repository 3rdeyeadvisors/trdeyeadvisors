

# Fix Feature Suggestion Form Layout Issues

## Problem Analysis

The "Submit Your Feature Idea" box on the `/roadmap` page has two issues:

1. **Overextended appearance**: The form content (inputs, buttons) is left-aligned while the header is centered, creating visual inconsistency
2. **Content not centered**: The input labels, character counts, and action buttons don't follow the centered design pattern used in the header

## Current Structure

```text
       [Icon]              <- centered
  [Title + Description]    <- centered  
     [Open Button]         <- centered
------------------------
[Title label] [count]      <- left-aligned (issue)
[Input field............]
[Desc label] [count]       <- left-aligned (issue)  
[Textarea................]
[Submit] [Cancel]          <- left-aligned (issue)
```

## Solution

Center the form content to match the header, while keeping form inputs full-width for usability.

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/roadmap/FeatureSuggestionForm.tsx` | Center form content, center action buttons |

## Detailed Changes

### 1. Center the CardContent Container
Add `text-center` and adjust the internal layout:

```text
Line 96: Add items-center to the CardContent
CardContent className="space-y-4 pt-0" 
  → CardContent className="space-y-4 pt-0 flex flex-col items-center"
```

### 2. Constrain Form Width
Add a max-width container for the form fields to prevent overextension:

```text
Wrap form inputs in a container with:
- w-full max-w-md (limits width on larger screens)
- space-y-4 (maintains vertical spacing)
```

### 3. Center Input Labels and Character Counts
The label/count rows (lines 99-104, 115-120):

```text
Before: flex items-center justify-between
After:  flex items-center justify-between w-full
```

### 4. Center Action Buttons
Change action buttons layout (lines 133-154):

```text
Before: flex flex-col sm:flex-row items-stretch sm:items-center gap-2
After:  flex flex-col sm:flex-row items-center justify-center gap-2
```

Also remove `w-full sm:w-auto` from buttons to let them size naturally when centered.

## Code Changes Summary

```text
File: src/components/roadmap/FeatureSuggestionForm.tsx

Line 96 (CardContent):
- Add flex flex-col items-center to center all form content

Lines 97-131 (form inputs):
- Wrap in a div with "w-full max-w-md space-y-4" to constrain width

Lines 133-154 (action buttons):
- Change to "flex flex-col sm:flex-row items-center justify-center gap-2"
- Update button widths to "sm:w-auto" (remove full-width on mobile for centering)
```

## Expected Result

After these changes:
- Form content will be centered within the card, matching the header
- Inputs will have a reasonable max-width preventing overextension
- Action buttons will be centered beneath the form
- Maintains the centered, compact design pattern used throughout the roadmap page

