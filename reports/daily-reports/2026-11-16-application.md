# 2026-11-16 — GigTime Tracker

- **Mission:** application
- **Project:** `applications/day-004-gigtime-tracker`
- **Deployment:** attempted only after validation

## Problem

Gig and freelance workers often juggle multiple short‑term jobs but lack a simple, offline‑first tool to log hours, track earnings per client, and generate invoices, leading to lost income and administrative hassle.

## Solution

A lightweight, mobile‑responsive web app that lets users add clients, create jobs, start/stop timers, edit entries, and export CSV invoices—all stored locally in the browser with optional cloud backup via manual file import/export.

## Target customers

- gig workers
- freelancers
- part‑time contractors

## Features completed

- Add / edit clients and hourly rates
- Create jobs and start/stop timers
- Manual entry editing and deletion
- Summary view of total hours and earnings per client
- Export data as CSV for invoicing
- Local storage persistence with optional JSON import/export

## Technologies

- HTML
- CSS
- JavaScript

## Competitor notes

- Toggl Track: Toggl requires an online account and subscription for full features; GigTime works fully offline and is free for basic tracking. (no URL; human verification required)
- Harvest: Harvest is a paid SaaS with team features; GigTime is a single‑user static app with no recurring fees. (no URL; human verification required)

## Test scenarios

- Open the app, add a client named 'Acme Corp' with $30/hr, create a job, start timer for 2 minutes, stop, verify that total hours = 0.03 and earnings = $0.90 in the summary.
- Refresh the page, confirm that the entry persists via localStorage.
- Export CSV, open in spreadsheet, ensure columns: Date, Client, Job, Hours, Rate, Earnings are present and values match the logged entry.

## Next improvements

- Add dark mode toggle
- Implement PDF invoice template generation
- Sync data across devices via a low‑cost backend (e.g., Firebase free tier)

> Market and competitor statements are model-generated research leads requiring human verification.
