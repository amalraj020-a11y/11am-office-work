# PickupPlay – Simple Sports Game Organizer

## Overview
PickupPlay is a static, offline‑first web app that lets anyone create a quick sports pickup‑game invitation, share a link, and collect RSVPs. All data lives in the browser’s `localStorage`; no server, login, or external services are required.

## Features
- Create a game (sport, location, date, time)
- Generate a shareable URL containing an event ID
- Participants RSVP with name and optional note
- Host sees a live list of players
- Data persists locally across page reloads
- Fully responsive and keyboard accessible

## Usage
1. Open `index.html` in a browser (or deploy to GitHub Pages). 
2. Fill the **Create a Game** form and submit.
3. Copy the generated link and share it via chat, email, or social media.
4. Recipients open the link, enter their name, and join the game.

## Testing
- **Create flow**: Fill all fields, submit, verify a link appears and the event view shows the correct details.
- **RSVP flow**: Open the link in a second tab/window, submit a name, check that the host view updates the player list.
- **Persistence**: Refresh the event page; the player list should remain.
- **Edge cases**: Attempt to RSVP with the same name twice – the app should alert the user.

## Business Hypothesis
- **Target**: Urban residents, college students, and community groups who organize informal sports.
- **Monetization**: Free core app; optional one‑time purchase ($2.99) to export attendee lists as CSV and remove the “Powered by PickupPlay” branding.
- **Cost**: Zero hosting cost on GitHub Pages; no ongoing server expenses.

## Limitations
- Works only in browsers that support `localStorage`.
- Events are stored per device; sharing across devices requires the same browser on the same machine.
- No authentication, so anyone with the link can edit the event.

## Launch Checklist
- [x] Repository created and GitHub Pages enabled.
- [x] Basic UI tested on desktop and mobile.
- [ ] Collect feedback from 5 local park users.
- [ ] Iterate on UI polish and add dark‑mode toggle.

## License
MIT – feel free to fork and improve!
