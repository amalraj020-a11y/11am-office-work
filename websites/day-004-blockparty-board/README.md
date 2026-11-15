# BlockParty Board

A mobile-friendly, zero-cost neighborhood event-card creator. It works on GitHub Pages without accounts, trackers, paid APIs or a backend.

## Working features

- Create, edit and delete an event on the organizer's browser.
- Store event details and local RSVPs in `localStorage`.
- Encode public event details in a shareable URL so the event card opens on another device.
- Add attendee names and notes locally with an optional capacity limit.
- Responsive layout, accessible labels, keyboard focus and form validation.

## Run and test

Open `index.html`, create an event, then copy its share link. Open that link in a private window and confirm the event details appear. Add an RSVP and reload to confirm it persists in that browser. Test editing and deleting from the original browser.

## Honest limitation

Because this version has no backend, RSVP lists do not synchronize between different devices. The event itself can be shared because its public details are encoded in the URL. A future opt-in cloud tier could provide shared RSVPs and reminders.

## Business hypothesis

The free version can attract apartment associations and local organizers. A potential paid tier could add shared cloud RSVPs, QR-code flyers, reminders and custom branding. Revenue is not guaranteed and requires customer validation.

## Hosting and costs

GitHub Pages hosting costs ₹0 within its published limits. The project uses plain HTML, CSS and JavaScript.
