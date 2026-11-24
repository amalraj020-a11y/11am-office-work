# 2026-11-24 — PickupPlay

- **Mission:** application
- **Project:** `applications/day-008-pickupplay`
- **Deployment:** attempted only after validation

## Problem

Neighbors and small community groups want to organize informal sports pickup games (e.g., basketball, soccer, badminton) but lack a simple tool to propose a game, collect RSVPs, set a time, and manage last‑minute changes, leading to low turnout and wasted effort.

## Solution

PickupPlay is a lightweight, offline‑first web app that lets a host create a game event, specify sport, location, date, and time, and share a short link. Participants can RSVP, add comments, and the host can see a real‑time attendee list. All data is stored locally in the browser, so no backend is required.

## Target customers

- urban residents who play informal sports
- community center organizers
- park enthusiasts

## Features completed

- Create game event with sport, location, date, time
- Generate shareable link
- RSVP with optional note
- Host view of attendee list
- Local storage persistence
- Responsive mobile UI

## Technologies

- HTML
- CSS
- JavaScript

## Competitor notes

- Meetup: Meetup is a broad social platform with paid plans and requires an account; PickupPlay is free, no login, focused on quick sports games. (no URL; human verification required)
- TeamSnap: TeamSnap targets organized teams and charges per season; PickupPlay is for ad‑hoc games with zero cost. (no URL; human verification required)

## Test scenarios

- Create a new game, copy the link, open it in a second browser tab, RSVP as a participant, and verify the host view shows the name.
- Refresh the page and ensure the event persists via localStorage.

## Next improvements

- Add optional email reminders (via mailto links)
- Allow multiple concurrent events per user
- Implement dark mode

> Market and competitor statements are model-generated research leads requiring human verification.
