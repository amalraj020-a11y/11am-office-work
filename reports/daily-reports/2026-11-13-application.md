# 2026-11-13 — ShiftSwap Lite

- **Mission:** application
- **Project:** `applications/day-001-shiftswap-lite`
- **Deployment:** attempted only after validation

## Problem

Part‑time and gig workers often need to swap or pick up last‑minute shift changes, but coordinating via chat groups leads to missed opportunities, confusion, and unpaid hours.

## Solution

A lightweight, mobile‑responsive web app that lets workers post available shifts, browse nearby openings, and claim them instantly, with simple calendar view and local storage persistence.

## Target customers

- part‑time retail staff
- gig economy workers
- hospitality employees

## Features completed

- Create a shift offer with date, time, location and notes
- Browse open shifts filtered by distance and time
- Claim a shift with one click; the claim is stored locally
- Calendar view of your own posted and claimed shifts
- Responsive design for phones and tablets

## Technologies

- HTML
- CSS
- JavaScript

## Competitor notes

- Shiftboard: ShiftSwap Lite is free, no login, works entirely client‑side, no corporate onboarding (no URL; human verification required)
- When I Work: Provides only employer‑driven scheduling; our app focuses on peer‑to‑peer swaps (no URL; human verification required)

## Test scenarios

- Create a shift, then refresh the page – the shift should persist in the list
- Filter shifts by time range – only matching shifts appear
- Claim a shift – it moves from open list to your claimed list and is saved after reload

## Next improvements

- Add optional email notification via mailto links
- Implement distance calculation using browser geolocation
- Allow export of claimed shifts to iCal

> Market and competitor statements are model-generated research leads requiring human verification.
