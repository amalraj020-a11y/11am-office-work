# 2026-11-19 — Roommate Chore Tracker

- **Mission:** application
- **Project:** `applications/day-005-roommate-chore-tracker`
- **Deployment:** attempted only after validation

## Problem

Roommates often forget or argue about household chores, leading to tension and uneven workload distribution because there is no simple shared tool to assign, track, and confirm completion of chores.

## Solution

A lightweight offline‑first web app that lets roommates create a shared chore list, assign tasks, set recurrence, and mark completion. Data is stored locally and can be synced manually via QR code or copy‑paste for small groups.

## Target customers

- College students sharing apartments
- Young professionals in shared housing

## Features completed

- Create, edit, and delete chores
- Assign chores to any housemate
- Set daily/weekly/monthly recurrence
- Mark chores as completed with timestamp
- Export/import data as JSON for manual sync
- Responsive design for phone and desktop

## Technologies

- HTML
- CSS
- JavaScript

## Competitor notes

- OurHome: OurHome is a mobile app with cloud sync and paid premium; this product is a static web app with no backend, free and privacy‑first. (no URL; human verification required)
- Tody: Tody focuses on personal cleaning schedules; ours is collaborative for multiple housemates with simple sharing. (no URL; human verification required)
- Flatmate: Flatmate includes rent splitting and chat; we focus solely on chore management with zero‑install web access. (no URL; human verification required)

## Test scenarios

- Create a new chore, assign to "Alex", set weekly recurrence, mark completed – verify it appears in the completed list with correct date.
- Export data, clear local storage, import the same JSON – verify all chores and assignments are restored.

## Next improvements

- Add QR code based data sharing for quick sync between devices
- Implement optional email reminders for upcoming chores
- Provide a simple analytics view of chore distribution per housemate

> Market and competitor statements are model-generated research leads requiring human verification.
