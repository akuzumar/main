// Google Apps Script for RSVP Form Submission
function doPost(e) {
  try {
    // Parse the POST data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Append the data to the sheet
    sheet.appendRow([
      new Date(), // Timestamp
      data.name,
      data.email,
      data.guestCount,
      data.attendance,
      data.message
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to test the script
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}