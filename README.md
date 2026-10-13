# CampusConnect — Campus Event Management & Registration Portal

**Course:** CSE326  
**Technology:** HTML5, CSS3, Vanilla JavaScript  
**Project type:** Individual, front-end demonstration  
**Project selection:** 7 — Campus Event Management & Registration Portal

## Overview
CampusConnect helps students discover campus events and register for a seat. Organizers can create events, set seat capacity, and manage event listings from a simple dashboard.

## Features
- Responsive event discovery page with search, category filter, and date filters.
- Event cards show date, time, venue, category, and remaining seats.
- Registration form with basic browser validation.
- Prevents duplicate registration for the same event in the current browser.
- Prevents registration when an event is full and updates seat counts immediately.
- Confirmation slip with a unique confirmation code and print option.
- My Registrations list with view-slip and cancel actions.
- Organizer form to create events and an event list to delete events.
- Dashboard totals for events, registrations, and seats filled.
- Browser localStorage persistence and optional dark theme.
- Seed/demo events appear on first visit.

## Run locally
1. Download or clone this folder.
2. Keep `index.html`, `styles.css`, and `script.js` in the same folder.
3. Open `index.html` in a modern browser. For the most reliable experience, use VS Code + Live Server.

No package installation or build step is required.

## Deploy to GitHub Pages
1. Create a GitHub repository named `campusconnect-cse326` (or another available name).
2. Upload `index.html`, `styles.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for the Pages URL to appear and test it in a private/incognito window.
7. Add the actual repository and deployed URLs to the submission sheet.

## Demo flow for evaluation
1. Search for an event and filter by category.
2. Open registration, enter a name and email, and confirm.
3. Show the confirmation code and print slip.
4. Return to the event list and point out the updated seat count and disabled duplicate registration.
5. Cancel a registration and show the seat becoming available again.
6. Create a new event from Organizer dashboard.
7. Delete a test event and show the dashboard metrics updating.
8. Refresh the page to demonstrate localStorage persistence.

## Important limitations (explain honestly in viva)
- This is a client-side prototype; localStorage data belongs to the current browser/device and is not shared between users.
- There is no real login, email notification, payment, server/database, or organizer access control.
- The registration number is optional in the demo and is not verified.
- For production, a backend API, database, authentication, role-based authorization, server-side capacity checks, and email service would be required.
- Google Fonts needs an internet connection; system fonts remain a fallback.

## File structure
```text
Campus_Event_Portal_CSE326/
├── index.html
├── styles.css
├── script.js
└── README.md
```
