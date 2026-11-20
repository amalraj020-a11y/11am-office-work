# StreetSpot Share

## Overview
StreetSpot Share is a static, mobile‑responsive web app that lets neighbourhood residents list and reserve short‑term parking spots (driveways, curbside spaces). All data is stored locally in the browser using `localStorage`, making it easy to demo on GitHub Pages without a backend.

## Features
- Add a parking spot with address, ZIP, availability dates, price, and optional photo URL.
- Search listings by ZIP code and date.
- Reserve a spot (removes it from the list to simulate a booking).
- Export/Import JSON via the browser console for simple data persistence across devices.
- Responsive layout for phones and desktops.

## Usage
1. Open `index.html` in a browser (or visit the GitHub Pages URL after deployment).
2. Fill the **Create Listing** form and submit – the listing is saved in `localStorage`.
3. Use the **Search Listings** form to find spots in your ZIP for a specific date.
4. Click **Reserve** to claim a spot; the listing disappears.

## Testing
- **Add Listing**: After submitting, refresh the page – the listing should still appear in search results.
- **Empty State**: Search a ZIP with no listings; you should see a friendly "No listings found" message.
- **Reservation**: Reserve a spot, then refresh – the spot remains removed.

## Business Hypothesis
Targeting urban commuters and homeowners with unused driveway space, the app solves the friction of finding cheap, nearby parking. A freemium model could later charge a small transaction fee on paid reservations, while keeping basic listings free.

## Limitations
- Data is only stored locally; listings are not shared across users.
- No authentication or payment processing.
- No map integration – addresses are plain text.

## Future Improvements
- Backend (e.g., Firebase) for real‑time shared listings.
- Map view with OpenStreetMap.
- User accounts and rating system for trust.
- Payment integration for transaction fees.

## Deployment
The project works on GitHub Pages:
1. Push the repository to GitHub.
2. Enable GitHub Pages in the repository settings (source: `main` branch, `/` root).
3. Access the site at `https://<username>.github.io/<repo>/`.
