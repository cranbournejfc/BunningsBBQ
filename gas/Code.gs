/**
 * Google Apps Script backend for Cranbourne Eagles JFC — Bunnings BBQ EOI
 * - Accepts JSON POST
 * - Appends to a Google Sheet
 */

const SPREADSHEET_ID = '1lh1jBVdEAJPD_OdMjD5D8S7iS5N7nNCehZvViILH32A';
const SHEET_NAME = 'Responses'; // or your preferred sheet/tab name

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Ensure header row exists
    const HEADER = [
      'Timestamp','Event Name','Event Location','Event Date','Name','Email','Mobile','Team','Roles','Slots','Notes','User Agent'
    ];
    if (sh.getLastRow() === 0) {
      sh.getRange(1,1,1,HEADER.length).setValues([HEADER]);
    }

    const row = [
      new Date(),
      payload.eventName || '',
      payload.eventLocation || '',
      payload.eventDate || '',
      payload.name || '',
      payload.email || '',
      payload.phone || '',
      payload.team || '',
      Array.isArray(payload.roles) ? payload.roles.join(', ') : '',
      Array.isArray(payload.slots) ? payload.slots.join(', ') : '',
      payload.notes || '',
      payload.userAgent || ''
    ];
    sh.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok:false, error: String(err) }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  // Optional: simple health check
  return ContentService.createTextOutput(JSON.stringify({ ok:true, msg:'EOI backend running' }))
                       .setMimeType(ContentService.MimeType.JSON);
}
