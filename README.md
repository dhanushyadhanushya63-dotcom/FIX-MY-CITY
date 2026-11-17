# FixMyStreet — professional civic issue reporting frontend

A React + Vite civic issue reporting demo using Leaflet and OpenStreetMap.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Included workflows

- Citizen complaint registration with category, description, location pin and optional image.
- OpenStreetMap pin selection, draggable marker, current-location selection and address lookup.
- Complaint success screen with a detailed digital acknowledgement receipt.
- Receipt includes Complaint ID, issue category, description, selected location, coordinates and submission date/time.
- Use **Save / Print PDF** to open the browser print dialog, then choose **Save as PDF** as the destination.
- Copy Complaint ID and open complaint tracking directly from the receipt.
- Complaint tracking timeline and guidance for a lost complaint ID.
- Admin dashboard with complaint filters, map view, priority/duplicate/overdue indicators and a manual smart-validation review queue.
- Authority workflow for progress updates and resolution proof.
- English/Tamil language selector.
- Full-width home hero with a refreshed civic-centre illustration and responsive layout.
- Compact footer without repeated page-navigation links; the main navigation remains in the header.
- Contact form appears only on the Home page.
- Complaint metadata is saved in browser localStorage for this frontend demo.

## Important demo limitations

This ZIP is a frontend demo. It does not connect to a live Spring Boot/MySQL backend, send OTPs, notify authorities, or perform server-side fraud verification. Smart validation only highlights records for a human admin to review; it must not be treated as proof of fraud or automatically reject complaints. Photo preview/proof URLs are browser-session URLs and are not durable file storage.

Address lookup uses the public Nominatim/OpenStreetMap service. Use it respectfully and follow the service usage policy. A production deployment should use an appropriate geocoding provider/service setup and backend API.

## Backend integration

The main demo data and state transitions are in `src/App.jsx` and `src/data.js`. Replace the local state handlers with authenticated Spring Boot API calls when the backend is ready. Validate complaint ownership and staff roles on the server; frontend role selection is only a demo convenience.


## Contributors
- **Dhanushya** - Core setup, routing and pages
- **Dhivya** - Maps, i18n and tracking
- **Devasri** - UI components, feedback and footer
