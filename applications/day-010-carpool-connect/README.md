# Carpool Connect

## Overview
Carpool Connect is a lightweight, offline‑first web application that helps urban commuters create and discover local carpool matches. All data is stored in the browser’s **localStorage**, so the app works without an internet connection and requires no sign‑up.

## Features
- Create ride **offers** or **requests** with origin, destination, time, and seat count.
- Automatic matching based on identical routes and a 30‑minute time window.
- Accept matches with a single click (confirmation is shown as an alert; actual coordination is left to users).
- Responsive design works on phones and desktops.
- All rides persist across page reloads using localStorage.

## Getting Started
1. Clone the repository or download the files.
2. Open `index.html` in any modern browser.
3. Use the form to add rides and see matches appear below.

## Testing
- **Create a ride offer**: Origin `Main St`, Destination `Oak Ave`, Time `08:00`, Seats `2`.
- **Create a ride request**: Same origin/destination, Time `08:10`, Seats `1`.
- The **Matches** section should list a match. Click **Accept** to see the alert.
- Turn off your internet, refresh the page – the rides and matches should still be displayed.

## Business Hypothesis
- **Target customers**: commuters, students, office workers in dense urban areas.
- **Monetization**: a freemium model where basic functionality is free; a paid tier adds CSV export and custom route colors ($2.99/month).
- **Launch plan**: publish on GitHub Pages, share on local commuter forums and university boards, collect feedback via an in‑app survey stored locally.

## Limitations
- Matching uses exact text comparison for origin/destination; no geocoding.
- No real‑time communication or notifications – users must arrange details offline.
- Data is limited to the browser; clearing storage removes all rides.

## Contributing
Feel free to fork the repo and submit pull requests. Improvements could include map integration, import/export of rides, or optional email notifications.
