# 2026-11-23 — Simple Invoice Builder

- **Mission:** application
- **Project:** `applications/day-007-simple-invoice-builder`
- **Deployment:** attempted only after validation

## Problem

Freelancers and gig workers need a quick, offline‑first way to create professional invoices without complex software or paid services, often ending up with ad‑hoc spreadsheets that look unprofessional.

## Solution

A static web app that lets users input client, service, and rate details, generates a printable PDF‑like invoice, and stores past invoices in localStorage for reuse.

## Target customers

- freelancers
- gig workers
- small consultants

## Features completed

- Create invoice with client, service line items, tax, and totals
- Live preview and printable view
- Save invoices locally and reload for editing
- Responsive design for mobile and desktop
- Keyboard‑friendly form with validation

## Technologies

- HTML
- CSS
- JavaScript

## Competitor notes

- Invoice Ninja: Full SaaS with recurring fees; our tool is free, static, no backend. (no URL; human verification required)
- Wave Invoicing: Offers accounting suite; we focus solely on quick invoice creation offline. (no URL; human verification required)

## Test scenarios

- Enter valid client data and line items → preview updates with correct totals and tax.
- Leave required fields empty → form shows validation messages and prevents preview.
- Refresh page after creating invoices → saved invoices reappear in the list.

## Next improvements

- Add PDF generation using jsPDF library
- Support multiple currencies and custom branding
- Sync invoices via optional Google Drive backup

> Market and competitor statements are model-generated research leads requiring human verification.
