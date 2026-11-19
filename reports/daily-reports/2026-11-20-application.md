# 2026-11-20 — VolunteerMatch Local

- **Mission:** application
- **Project:** `applications/day-006-volunteermatch-local`
- **Deployment:** attempted only after validation

## Problem

Community events and small NGOs need volunteers, but organizers struggle to find local people with matching availability and skills, while volunteers waste time searching scattered flyers and group chats.

## Solution

A lightweight offline‑first web app where organizers post volunteer slots with required skills and time, and locals browse, filter, and claim spots. Claims are stored in localStorage and can be exported as a CSV for organizers.

## Target customers

- Community organizers of small events
- Local volunteers looking for micro‑volunteering opportunities

## Features completed

- Create volunteer slots with title, description, required skill tags, date & time, and needed number of people
- Browse and filter slots by skill, date, and distance (manual entry)
- Claim a slot; claim stored locally and displayed in a personal dashboard
- Export all claimed slots as a CSV for sharing with organizers
- Responsive design works on phones and desktops

## Technologies

- HTML
- CSS
- JavaScript

## Competitor notes

- VolunteerMatch: National platform with complex onboarding; our app is ultra‑simple, no accounts, local‑only, works offline (no URL; human verification required)
- SignUpGenius: Focuses on schools and larger groups; we target micro‑events and provide instant CSV export without login (no URL; human verification required)

## Test scenarios

- Create a new slot, refresh page, ensure slot persists (stored in localStorage).
- Filter slots by a skill tag and verify only matching slots appear.
- Claim a slot, then open the dashboard and see the claim listed.
- Export CSV and open in spreadsheet; claimed slot details should be present.

## Next improvements

- Add optional geolocation to auto‑filter nearby events
- Implement simple password‑protected organizer mode to hide slots from public view
- Sync claims via a small backend for multi‑device persistence (future)

> Market and competitor statements are model-generated research leads requiring human verification.
