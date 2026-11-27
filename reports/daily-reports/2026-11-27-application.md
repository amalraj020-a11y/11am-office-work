# 2026-11-27 — Carpool Connect

- **Mission:** application
- **Project:** `applications/day-010-carpool-connect`
- **Deployment:** attempted only after validation

## Problem

Urban commuters often drive alone, increasing traffic, emissions, and costs, while lacking a simple, offline‑first way to find reliable local carpool partners with matching schedules.

## Solution

Carpool Connect lets users create recurring ride offers or requests, match based on route, time, and seat availability, and confirm rides via a lightweight UI that works fully offline and stores data in the browser.

## Target customers

- urban commuters
- students
- employees in office districts

## Features completed

- Create recurring ride offers or requests with start/end locations, time, and seat count
- Automatic matching of compatible rides within a 5‑km radius
- Accept or decline matches with one‑click confirmation
- Local storage of all rides and matches for offline access
- Responsive design for mobile and desktop

## Technologies

- HTML
- CSS
- JavaScript

## Competitor notes

- Waze Carpool: Waze requires accounts and internet; Carpool Connect is offline‑first, no login, and stores data locally. (no URL; human verification required)
- BlaBlaCar: BlaBlaCar focuses on intercity trips and payment processing; our app targets short daily commutes and is free with no payments. (no URL; human verification required)

## Test scenarios

- Create a ride offer for 8:00 AM, 2 seats, route A→B; create a ride request for 8:05 AM, 1 seat, same route – the app should show a match and allow acceptance.
- Turn off internet, reload page – previously saved rides and matches should persist and be viewable.

## Next improvements

- Add map preview using OpenStreetMap static images
- Implement export/import of rides via JSON file
- Introduce optional email notifications using mailto links

> Market and competitor statements are model-generated research leads requiring human verification.
