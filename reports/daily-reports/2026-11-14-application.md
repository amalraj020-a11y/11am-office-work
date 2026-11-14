# 2026-11-14 — StudyBuddy Scheduler

- **Mission:** application
- **Project:** `applications/day-002-studybuddy-scheduler`
- **Deployment:** attempted only after validation

## Problem

College and high‑school students often struggle to find suitable study partners for specific subjects, times, and locations, relying on fragmented group chats that lead to missed connections and inefficient study sessions.

## Solution

A lightweight web app where users can post short study‑session offers or requests, filter by subject, date, and location, and claim slots instantly. All data is stored locally, enabling quick matching without any backend.

## Target customers

- Students (high school, college) looking for peer study sessions

## Features completed

- Create study session offers or requests
- Filter listings by subject, date, and location
- Claim a session with one click
- Persist data in localStorage
- Responsive design for mobile and desktop

## Technologies

- HTML
- CSS
- JavaScript

## Competitor notes

- StudySoup: Focuses on tutoring services and paid content; ours is free, peer‑to‑peer matching with no backend. (no URL; human verification required)
- Meetup: General event platform; our app is purpose‑built for short, recurring study meet‑ups with simple UI. (no URL; human verification required)

## Test scenarios

- Open the app, click 'Add Session', fill all fields, and save – the new session appears in the list.
- Use the filter dropdowns to narrow results – only matching sessions remain visible.
- Click 'Claim' on a session – it moves to 'My Sessions' and is removed from the public list.

## Next improvements

- Add optional user profiles with optional email notifications.
- Implement a simple serverless backend (e.g., Netlify Functions) for cross‑device syncing.
- Introduce a rating system for study partners.

> Market and competitor statements are model-generated research leads requiring human verification.
