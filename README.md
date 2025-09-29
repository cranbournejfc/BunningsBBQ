# Cranbourne Eagles JFC — Bunnings BBQ EOI (GitHub Pages)

A lightweight, mobile‑friendly Expression of Interest form for volunteers to help at a Bunnings BBQ fundraiser. Hosts on GitHub Pages; submissions go to a Google Sheet via Apps Script.

## Files
- `index.html` — the form
- `style.css` — club‑branded styling
- `app.js` — submission logic
- `eagles-logo.png` — place your logo file here (optional)
- `gas/Code.gs` — Google Apps Script backend (paste into Apps Script editor)

## Google Sheet Setup
Create a Google Sheet with a header row exactly like this (A1:J1):

```
Timestamp | Event Name | Name | Email | Mobile | Team | Roles | Slots | Notes | User Agent
```

## Apps Script Backend
1. In Google Drive, create a new **Apps Script** project.
2. Create a spreadsheet and copy its file ID.
3. Paste the code from `gas/Code.gs`. Replace the `SPREADSHEET_ID`.
4. Deploy: **Deploy > New deployment > Web app**  
   - Execute as: **Me**  
   - Who has access: **Anyone** (or **Anyone with the link**)  
   - Copy the **Web app URL** ending with `/exec`.
5. In `index.html`, replace `PASTE_YOUR_EXEC_URL_HERE` with your Web App URL.

## GitHub Pages Hosting
1. Create a new repo (e.g., `cranbournejfc.github.io/bunnings-bbq-eoi`).
2. Add the files in this folder to the repo root.
3. In repo settings → **Pages**, set source to **Deploy from a branch**, branch: **main**, folder: **/**.
4. Your site will publish at `https://<username>.github.io/<repo>/`.

## Local test
Open `index.html` directly. Submitting will fail until `GAS_ENDPOINT` is set and the web app is deployed.

## Customising
- Add/remove role labels in the “Preferred Roles” section.
- Adjust slots in the “Availability” section (2‑hour windows from 08:00 to 16:00 by default).
- Swap the logo file `eagles-logo.png` or remove the `<img>` tag if not needed.
