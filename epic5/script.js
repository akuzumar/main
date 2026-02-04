// Google Apps Script untuk Menyimpan Data RSVP ke Google Sheets

// ID Spreadsheet Anda
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'RSVP_Data';

// Fungsi utama untuk menangani POST request
function doPost(e) {
  try {
    // Parse data yang diterima
    const data = JSON.parse(e.postData.contents);
    
    // Validasi data wajib
    if (!data.nama || !data.doa || !data.kehadiran) {
      return createResponse(400, 'Data tidak lengkap', null);
    }
    
    // Buka spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Jika sheet belum ada, buat baru
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Buat header
      sheet.getRange(1, 1, 1, 6).setValues([[
        'Timestamp', 
        'Nama Lengkap', 
        'Doa/Ucapan', 
        'Jumlah Tamu', 
        'Konfirmasi Kehadiran', 
        'Status'
      ]]);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    }
    
    // Tambahkan data baru
    const lastRow = sheet.getLastRow();
    const timestamp = new Date();
    
    sheet.getRange(lastRow + 1, 1, 1, 6).setValues([[
      timestamp,
      data.nama,
      data.doa,
      data.jumlahTamu || '2',
      data.kehadiran,
      'Pending'
    ]]);
    
    // Format tanggal
    sheet.getRange(lastRow + 1, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    
    // Kirim email notifikasi (opsional)
    sendNotificationEmail(data);
    
    return createResponse(200, 'Data berhasil disimpan', {
      id: lastRow + 1,
      timestamp: timestamp.toISOString()
    });
    
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, 'Terjadi kesalahan server: ' + error.toString(), null);
  }
}

// Fungsi untuk menangani GET request (untuk testing)
function doGet(e) {
  return createResponse(200, 'API RSVP Wedding berjalan', {
    endpoint: '/exec',
    method: 'POST',
    required_fields: ['nama', 'doa', 'kehadiran'],
    version: '1.0'
  });
}

// Fungsi untuk mengirim email notifikasi
function sendNotificationEmail(data) {
  try {
    const recipient = Session.getActiveUser().getEmail(); // Email Anda
    const subject = `RSVP Baru - Pernikahan Ahmad & Fatimah`;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 10px;">
          📬 Konfirmasi Kehadiran Baru
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #1b5e20;">Detail Konfirmasi:</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 150px;">Nama Lengkap</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.nama}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Konfirmasi</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">
                <span style="color: ${data.kehadiran === 'Hadir' ? '#2e7d32' : '#d32f2f'}; font-weight: bold;">
                  ${data.kehadiran}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Jumlah Tamu</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.jumlahTamu || '2'} orang</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Waktu</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date().toLocaleString('id-ID')}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #1b5e20;">💌 Doa & Ucapan:</h3>
          <p style="font-style: italic; line-height: 1.6;">"${data.doa}"</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
          <p style="color: #666; font-size: 14px;">
            Email ini dikirim otomatis dari sistem undangan pernikahan.<br>
            <a href="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit" style="color: #2e7d32;">
              Lihat data lengkap di Google Sheets
            </a>
          </p>
        </div>
      </div>
    `;
    
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody
    });
    
  } catch (error) {
    console.error('Gagal mengirim email:', error);
  }
}

// Fungsi helper untuk membuat response
function createResponse(statusCode, message, data) {
  const response = {
    success: statusCode === 200,
    message: message,
    data: data
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Fungsi untuk setup awal spreadsheet
function setupSpreadsheet() {
  const spreadsheet = SpreadsheetApp.create('RSVP Pernikahan Ahmad & Fatimah');
  const sheet = spreadsheet.getActiveSheet();
  
  // Set header
  sheet.getRange(1, 1, 1, 6).setValues([[
    'Timestamp', 
    'Nama Lengkap', 
    'Doa/Ucapan', 
    'Jumlah Tamu', 
    'Konfirmasi Kehadiran', 
    'Status'
  ]]);
  
  // Format header
  const headerRange = sheet.getRange(1, 1, 1, 6);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#2e7d32');
  headerRange.setFontColor('#ffffff');
  
  // Set kolom width
  sheet.setColumnWidth(1, 180); // Timestamp
  sheet.setColumnWidth(2, 200); // Nama
  sheet.setColumnWidth(3, 400); // Doa
  sheet.setColumnWidth(4, 100); // Jumlah
  sheet.setColumnWidth(5, 150); // Kehadiran
  sheet.setColumnWidth(6, 100); // Status
  
  // Freeze header
  sheet.setFrozenRows(1);
  
  // Protect sheet (opsional)
  const protection = sheet.protect();
  protection.setWarningOnly(true);
  
  // Share spreadsheet dengan email Anda
  spreadsheet.addEditor('your-email@gmail.com');
  
  // Return spreadsheet ID
  return spreadsheet.getId();
}

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: false,
        offset: 100,
        easing: 'ease-in-out'
    });
    
    // Handle guest name from URL
    handleGuestName();
    
    // Initialize loading screen
    initializeLoadingScreen();
    
    // Initialize dummy wishes
    loadDummyWishes();
    
    // Initialize countdown
    initializeCountdown();
    
    // Setup event listeners
    setupEventListeners();
});

// --- HANDLE GUEST NAME FROM URL ---
function handleGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    
    if (guestName) {
        // Decode URL parameters (handle spaces and special characters)
        const decodedName = decodeURIComponent(guestName.replace(/\+/g, ' '));
        
        // Display on loading screen
        document.getElementById('guestName').textContent = `Kepada Yth. ${decodedName}`;
        
        // Display on cover section
        document.getElementById('displayGuestName').textContent = decodedName;
        
        // Store in localStorage for persistence
        localStorage.setItem('weddingGuestName', decodedName);
    } else {
        // Check localStorage for previously stored name
        const storedName = localStorage.getItem('weddingGuestName');
        if (storedName) {
            document.getElementById('guestName').textContent = `Kepada Yth. ${storedName}`;
            document.getElementById('displayGuestName').textContent = storedName;
        }
    }
}

// --- LOADING SCREEN ---
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const openBtn = document.getElementById('openBtn');
    
    // HIDE LOADING SCREEN AUTOMATICALLY AFTER LOAD
    setTimeout(() => {
        if (!loadingScreen.classList.contains('fade-out')) {
            proceedToInvitation();
        }
    }, 2000); // Reduced from 5 seconds to 2 seconds
    
    // Click anywhere on loading screen to proceed
    loadingScreen.addEventListener('click', function() {
        proceedToInvitation();
    });
    
    // Handle open button click - INI TIDAK PERLU LAGI KARENA BUTTON ADA DI COVER SECTION
    // openBtn hanya untuk scroll ke couple section, bukan untuk masuk dari loading
}

function proceedToInvitation() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (loadingScreen.classList.contains('fade-out')) {
        return; // Already proceeding
    }
    
    // Add fade-out animation
    loadingScreen.classList.add('fade-out');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        
        // Play background music
        playBackgroundMusic();
        
        // Unlock scroll
        document.body.style.overflow = 'auto';
        
        // Auto-scroll sedikit ke atas untuk memastikan cover terlihat
        window.scrollTo(0, 0);
        
        // Refresh AOS animations
        setTimeout(() => {
            AOS.refresh();
        }, 300);
    }, 1000);
}

// --- BACKGROUND MUSIC ---
function playBackgroundMusic() {
    const music = document.getElementById('backgroundMusic');
    const icon = document.getElementById('musicIcon');
    
    try {
        // Set volume
        music.volume = 0.3; // Reduced volume
        
        // Try to play music
        const playPromise = music.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Update icon to pause
                icon.className = "fas fa-pause";
                console.log("Musik background berhasil diputar");
            }).catch(error => {
                console.log("Auto-play diblokir oleh browser:", error);
                // Don't show toast here, it might be annoying
            });
        }
    } catch (error) {
        console.log("Error playing music:", error);
    }
}

// Toggle music play/pause
document.getElementById('musicControl').addEventListener('click', function() {
    const music = document.getElementById('backgroundMusic');
    const icon = document.getElementById('musicIcon');
    
    if (music.paused) {
        music.play();
        icon.className = "fas fa-pause";
        showToast('Musik diputar', 'success');
    } else {
        music.pause();
        icon.className = "fas fa-play";
        showToast('Musik dijeda', 'info');
    }
});

// --- BUKA UNDANGAN BUTTON ---
document.getElementById('openBtn').addEventListener('click', function() {
    // Scroll ke couple section dengan smooth
    document.getElementById('couple').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    // Jika musik belum diputar, putar sekarang
    const music = document.getElementById('backgroundMusic');
    if (music.paused) {
        music.play();
        document.getElementById('musicIcon').className = "fas fa-pause";
    }
});

// ... (sisanya tetap sama, countdown, lightbox, dll)