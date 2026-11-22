# MicroEvent RSVP

A tiny static website for creating a single community event, collecting RSVPs, and automatically handling a waitlist. All data is stored in the browser using `localStorage`, so the site works offline and costs nothing to host on GitHub Pages.

## Features
- Event creation (title, date, time, location, capacity, description)
- RSVP form with name & email validation
- Automatic waitlist when capacity is exceeded
- Persistent storage in the browser (no backend)
- Responsive and accessible UI

## How to Use
1. Open `index.html` in a browser.
2. Fill the **Create Event** form and submit.
3. The event page appears; share the URL with participants.
4. Visitors fill the **RSVP** form. Confirmed guests appear under *Confirmed*; extra guests go to *Waitlist*.
5. Data persists across reloads because it is saved in `localStorage`.

## Testing Manual Scenarios
- **Create event**: Verify the event card shows correct details.
- **RSVP capacity**: Set capacity to 3, submit 5 RSVPs. First 3 should be in Confirmed, last 2 in Waitlist.
- **Persistence**: Refresh the page; event and RSVP lists should remain.

## Business Hypothesis
- **Target customers**: Neighborhood associations, clubs, community centers.
- **Problem**: Existing ticketing platforms are costly or over‑engineered for one‑off local events.
- **Solution Differentiator**: Free, zero‑fee, no sign‑up, capacity enforcement, waitlist.
- **Monetization**: Offer optional paid custom branding for $5 per event (freemium model).

## Deployment
1. Create a GitHub repository.
2. Add the four files (`index.html`, `styles.css`, `app.js`, `README.md`).
3. Enable GitHub Pages (source: `main` branch, root folder).
4. Share the generated URL.

## Limitations
- Only one event per site (can be extended).
- No email notifications – users must check the page.
- Data is stored per browser; not shared across devices.
- No server‑side backup; clearing browser data will erase everything.

---
*This prototype is intended for demonstration and early feedback only.*