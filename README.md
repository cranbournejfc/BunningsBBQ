# Cranbourne Eagles JFC — Bunnings BBQ EOI (GitHub Pages)

A lightweight, mobile-friendly Expression of Interest form for volunteers to help at a Bunnings BBQ fundraiser. Hosts on GitHub Pages; submissions go to a Google Sheet via Apps Script.

## Files
- `index.html` — the form
- `style.css` — club-branded styling
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
2. Create a spreadsheet and copy its file ID (already configured in `Code.gs` if you provided it).
3. Paste the code from `gas/Code.gs`. Replace the `SPREADSHEET_ID` if needed.
4. Deploy: **Deploy > New deployment > Web app**  
   - Execute as: **Me**  
   - Who has access: **Anyone** (or **Anyone with the link**)  
   - Copy the **Web app URL** ending with `/exec`.
5. In `index.html`, `GAS_ENDPOINT` is already set to your `/exec` URL.

## GitHub Pages Hosting
1. Create a new repo (e.g., `cranbournejfc.github.io/bunnings-bbq-eoi`).
2. Add the files in this folder to the repo root.
3. In repo settings → **Pages**, set source to **Deploy from a branch**, branch: **main**, folder: **/**.
4. Your site will publish at `https://<username>.github.io/<repo>/`.
