/**
 * KONFIGURASI AWAL
 */
AOS.init({
    duration: 800,
    easing: 'ease-out-quart',
    once: false,
    mirror: true,
    offset: 100
});

// Elemen DOM
const welcomeScreen = document.getElementById('welcome-screen');
const openBtn = document.getElementById('btn-open');
const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const backToTop = document.getElementById('backToTop');
const bismillahOverlay = document.querySelector('.bismillah-overlay');

let isPlaying = false;
let guestName = '';
let rsvpStats = {
    total: 0,
    attending: 0,
    maybe: 0
};

/**
 * HILANGKAN BISMILLAH OVERLAY SETELAH 3 DETIK
 */
setTimeout(() => {
    bismillahOverlay.style.opacity = '0';
    bismillahOverlay.style.visibility = 'hidden';
    document.body.style.overflow = 'auto';
}, 3000);

/**
 * AMBIL NAMA TAMU DARI URL & FORMAT
 */
function getGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get('to');
    
    const nameDisplay = document.getElementById('guest-name-display');
    const rsvpNameInput = document.querySelector('input[name="Nama"]');
    
    if (name) {
        // Decode URL dan format nama
        name = decodeURIComponent(name.replace(/\+/g, ' '));
        
        // Capitalize setiap kata
        name = name.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        guestName = name;
        
        // Tampilkan di Welcome Screen
        nameDisplay.innerText = name;
        
        // Otomatis isi form RSVP
        if (rsvpNameInput) {
            rsvpNameInput.value = name;
            rsvpNameInput.classList.add('valid');
            
            // Trigger event untuk animasi label
            const event = new Event('input', { bubbles: true });
            rsvpNameInput.dispatchEvent(event);
        }
        
        // Simpan nama di localStorage untuk form doa
        localStorage.setItem('weddingGuestName', name);
    } else {
        // Coba dari localStorage jika ada
        const savedName = localStorage.getItem('weddingGuestName');
        if (savedName) {
            nameDisplay.innerText = savedName;
            if (rsvpNameInput) {
                rsvpNameInput.value = savedName;
                rsvpNameInput.classList.add('valid');
            }
        }
    }
}

// Jalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    getGuestName();
    updateRSVPStats();
    loadMessages();
    
    // Inisialisasi audio
    audio.volume = 0.5;
    audio.preload = 'auto';
});

/**
 * LOGIKA BUKA UNDANGAN & AUDIO
 */
openBtn.addEventListener('click', () => {
    // Animasi fade out welcome screen
    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.pointerEvents = 'none';
    
    // Play audio setelah delay
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Coba play audio
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    isPlaying = true;
                    musicBtn.querySelector('i').className = 'fas fa-volume-up';
                })
                .catch(error => {
                    console.log("Autoplay prevented:", error);
                    // Tampilkan instruksi manual
                    showAudioInstructions();
                });
        }
    }, 800);
});

/**
 * TAMPILKAN INSTRUKSI AUDIO
 */
function showAudioInstructions() {
    const instructions = document.createElement('div');
    instructions.className = 'audio-instructions';
    instructions.innerHTML = `
        <div class="instructions-content">
            <i class="fas fa-volume-up"></i>
            <p>Klik tombol musik di pojok kanan bawah untuk memutar audio</p>
            <button onclick="this.parentElement.parentElement.remove()">Mengerti</button>
        </div>
    `;
    
    document.body.appendChild(instructions);
    
    setTimeout(() => {
        instructions.style.opacity = '1';
        instructions.style.transform = 'translateY(0)';
    }, 100);
}

// Kontrol tombol musik manual
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        musicBtn.querySelector('i').className = 'fas fa-volume-mute';
    } else {
        audio.play();
        musicBtn.querySelector('i').className = 'fas fa-volume-up';
    }
    isPlaying = !isPlaying;
});

/**
 * BACK TO TOP BUTTON
 */
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/**
 * COUNTDOWN TIMER
 */
const weddingDate = new Date("December 08, 2026 08:00:00").getTime();

const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? '0' + days : days;
    document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;

    if (distance < 0) {
        clearInterval(countdown);
        document.getElementById("countdown").innerHTML = `
            <div class="event-live">
                <i class="fas fa-circle"></i>
                <span>Acara Sedang Berlangsung</span>
            </div>
        `;
    }
}, 1000);

/**
 * COPY TEXT TO CLIPBOARD
 */
function copyBankNumber(text, bankName) {
    navigator.clipboard.writeText(text.replace(/\s/g, ''))
        .then(() => {
            showNotification(`Nomor rekening ${bankName} berhasil disalin!`);
        })
        .catch(err => {
            console.error('Gagal menyalin:', err);
            showNotification('Gagal menyalin, coba manual ya!', 'error');
        });
}

function copyDoa() {
    const doaText = "بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ";
    navigator.clipboard.writeText(doaText)
        .then(() => {
            showNotification("Doa untuk pengantin berhasil disalin! ❤️");
        });
}

/**
 * NOTIFICATION SYSTEM
 */
function showNotification(message, type = 'success') {
    // Hapus notifikasi sebelumnya
    const oldNotif = document.querySelector('.custom-notification');
    if (oldNotif) oldNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animasi masuk
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Hapus setelah 3 detik
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * RSVP FORM HANDLING
 */
const scriptURL = 'https://script.google.com/macros/s/AKfycbxZHoDpQ-JJnpplwbDh5N8gJwJ60dp6ZRbXsvM8i0n4UQF0r7qPzdeYoLBStef8sRIR/exec';
const form = document.getElementById('rsvpForm');
const submitBtn = document.getElementById('submitBtn');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        const originalContent = submitBtn.innerHTML;
        const formData = new FormData(form);
        
        // Tambahkan timestamp dan user agent
        formData.append('Timestamp', new Date().toLocaleString('id-ID'));
        formData.append('UserAgent', navigator.userAgent);
        
        // Animasi loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <span>Mengirim...</span>
        `;
        
        fetch(scriptURL, { 
            method: 'POST', 
            body: formData,
            mode: 'no-cors'
        })
            .then(() => {
                // Simpan di localStorage sebagai fallback
                const rsvpData = {
                    nama: formData.get('Nama'),
                    kehadiran: formData.get('Kehadiran'),
                    acara: formData.get('Acara'),
                    jumlah: formData.get('Jumlah'),
                    pesan: formData.get('Pesan'),
                    timestamp: new Date().toISOString()
                };
                
                saveRSVPLocal(rsvpData);
                updateRSVPStats();
                
                showNotification('Terima kasih! Konfirmasi Anda telah tersimpan. 😊');
                form.reset();
                
                // Reset form fields
                form.querySelectorAll('input, select, textarea').forEach(input => {
                    if (input.name !== 'Nama') {
                        input.value = '';
                    }
                });
            })
            .catch(error => {
                console.error('Error!', error);
                showNotification('Menyimpan secara lokal...', 'info');
                
                // Fallback ke localStorage
                const rsvpData = {
                    nama: formData.get('Nama'),
                    kehadiran: formData.get('Kehadiran'),
                    acara: formData.get('Acara'),
                    jumlah: formData.get('Jumlah'),
                    pesan: formData.get('Pesan'),
                    timestamp: new Date().toISOString()
                };
                
                saveRSVPLocal(rsvpData);
                updateRSVPStats();
                
                showNotification('Data disimpan secara lokal.', 'info');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
            });
    });
}

/**
 * SIMPAN RSVP DI LOCALSTORAGE
 */
function saveRSVPLocal(data) {
    let rsvpList = JSON.parse(localStorage.getItem('weddingRSVP')) || [];
    rsvpList.push(data);
    localStorage.setItem('weddingRSVP', JSON.stringify(rsvpList));
}

/**
 * UPDATE RSVP STATISTICS
 */
function updateRSVPStats() {
    const rsvpList = JSON.parse(localStorage.getItem('weddingRSVP')) || [];
    
    rsvpStats.total = rsvpList.length;
    rsvpStats.attending = rsvpList.filter(item => 
        item.kehadiran === 'Hadir' || item.kehadiran === 'Hadir (Insha Allah)'
    ).length;
    rsvpStats.maybe = rsvpList.filter(item => item.kehadiran === 'Ragu').length;
    
    // Update display
    document.getElementById('totalGuests').textContent = rsvpStats.total;
    document.getElementById('attendingGuests').textContent = rsvpStats.attending;
    document.getElementById('maybeGuests').textContent = rsvpStats.maybe;
}

/**
 * DOA FORM HANDLING
 */
const doaForm = document.getElementById('doaForm');
if (doaForm) {
    doaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('doaName').value;
        const message = document.getElementById('doaMessage').value;
        
        if (!name || !message) {
            showNotification('Mohon isi nama dan doa terlebih dahulu.', 'error');
            return;
        }
        
        // Simpan doa
        const doaData = {
            name: name,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        saveDoaLocal(doaData);
        
        // Tampilkan di gallery doa
        displayMessage(doaData);
        
        // Reset form
        doaForm.reset();
        
        showNotification('Doa Anda telah dikirim. Jazakallah! ❤️');
    });
}

/**
 * SIMPAN DOA DI LOCALSTORAGE
 */
function saveDoaLocal(data) {
    let doaList = JSON.parse(localStorage.getItem('weddingDoa')) || [];
    doaList.push(data);
    localStorage.setItem('weddingDoa', JSON.stringify(doaList));
}

/**
 * LOAD DAN DISPLAY MESSAGES
 */
function loadMessages() {
    const doaList = JSON.parse(localStorage.getItem('weddingDoa')) || [];
    const container = document.querySelector('.messages-container');
    
    if (container && doaList.length > 0) {
        container.innerHTML = '';
        
        // Tampilkan 6 pesan terbaru
        doaList.slice(-6).reverse().forEach(data => {
            displayMessage(data, container);
        });
    }
}

function displayMessage(data, container = null) {
    if (!container) {
        container = document.querySelector('.messages-container');
    }
    
    if (!container) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = 'message-item';
    
    const timeAgo = getTimeAgo(data.timestamp);
    
    messageEl.innerHTML = `
        <div class="message-header">
            <i class="fas fa-user-circle"></i>
            <div>
                <strong>${data.name}</strong>
                <small>${timeAgo}</small>
            </div>
        </div>
        <div class="message-content">
            <p>${data.message}</p>
        </div>
    `;
    
    container.insertBefore(messageEl, container.firstChild);
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.floor((now - past) / 1000); // dalam detik
    
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return `${Math.floor(diff / 604800)} minggu lalu`;
}

/**
 * WHATSAPP RSVP
 */
document.querySelector('.btn-whatsapp')?.addEventListener('click', () => {
    const name = document.querySelector('input[name="Nama"]')?.value || guestName || 'Tamu';
    const phone = '6285161808524'; // Ganti dengan nomor panitia
    
    const message = `Assalamu'alaikum, saya ${name} ingin mengkonfirmasi kehadiran untuk acara pernikahan Fulan & Fulanah.`;
    
    const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
});

/**
 * SAVE TO CONTACTS
 */
function saveToContacts(name, account, bank) {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name} (Rekening ${bank})
TEL;TYPE=CELL:${account}
ORG:${bank}
END:VCARD`;
    
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name} - ${bank}.vcf`;
    a.click();
    
    showNotification(`Kontak ${name} berhasil disimpan!`);
}

/**
 * OPEN TRANSFER APP
 */
function openTransferApp(account, bank) {
    // Cek perangkat
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Untuk mobile, buka aplikasi bank
        const bankApps = {
            'BSI': 'bsimobile://',
            'Mandiri': 'livin://'
        };
        
        if (bankApps[bank]) {
            window.location.href = bankApps[bank];
        } else {
            // Fallback ke browser
            window.open(`https://m.${bank.toLowerCase()}.co.id`, '_blank');
        }
    } else {
        // Untuk desktop, tampilkan QR code
        showQRCode(account, bank);
    }
}

function showQRCode(account, bank) {
    const modal = document.createElement('div');
    modal.className = 'qr-modal';
    modal.innerHTML = `
        <div class="qr-modal-content">
            <div class="qr-modal-header">
                <h3>Scan QR Code untuk ${bank}</h3>
                <button class="qr-close">&times;</button>
            </div>
            <div class="qr-code-display">
                <div class="qr-placeholder">
                    <i class="fas fa-qrcode"></i>
                    <p>QR Code akan muncul di sini</p>
                </div>
                <p class="qr-account">${account}</p>
            </div>
            <p class="qr-instruction">Gunakan aplikasi mobile banking untuk scan QR Code</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.qr-close').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

/**
 * NAVIGATION SCROLL ACTIVE
 */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.islamic-nav a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

/**
 * ADDITIONAL CSS FOR DYNAMIC ELEMENTS
 */
const style = document.createElement('style');
style.textContent = `
    .audio-instructions {
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: linear-gradient(135deg, var(--secondary-dark), var(--primary-dark));
        border: 1px solid var(--accent-gold);
        border-radius: 15px;
        padding: 20px;
        max-width: 300px;
        z-index: 10001;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .instructions-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        text-align: center;
    }
    
    .instructions-content i {
        font-size: 2rem;
        color: var(--accent-gold);
    }
    
    .instructions-content p {
        color: var(--text-light);
        font-size: 0.9rem;
        line-height: 1.5;
    }
    
    .instructions-content button {
        background: var(--accent-gold);
        color: var(--primary-dark);
        border: none;
        padding: 8px 20px;
        border-radius: 20px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .instructions-content button:hover {
        transform: translateY(-2px);
    }
    
    .custom-notification {
        position: fixed;
        top: 30px;
        right: 30px;
        background: linear-gradient(135deg, var(--secondary-dark), var(--primary-dark));
        border: 1px solid rgba(212, 175, 55, 0.3);
        border-radius: 10px;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10002;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .custom-notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .custom-notification.success {
        border-left: 4px solid var(--islamic-green);
    }
    
    .custom-notification.error {
        border-left: 4px solid #e74c3c;
    }
    
    .custom-notification.info {
        border-left: 4px solid var(--accent-gold);
    }
    
    .custom-notification i {
        font-size: 1.2rem;
    }
    
    .custom-notification.success i {
        color: var(--islamic-green);
    }
    
    .custom-notification.error i {
        color: #e74c3c;
    }
    
    .custom-notification.info i {
        color: var(--accent-gold);
    }
    
    .custom-notification span {
        color: var(--text-light);
        font-size: 0.9rem;
    }
    
    .message-item {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        padding: 20px;
        border: 1px solid rgba(212, 175, 55, 0.1);
    }
    
    .message-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
    }
    
    .message-header i {
        font-size: 2rem;
        color: var(--accent-gold);
    }
    
    .message-header strong {
        color: var(--text-light);
        display: block;
        margin-bottom: 5px;
    }
    
    .message-header small {
        color: var(--text-dim);
        font-size: 0.8rem;
    }
    
    .message-content p {
        color: var(--text-dim);
        line-height: 1.6;
        font-size: 0.9rem;
    }
    
    .qr-modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10003;
        backdrop-filter: blur(5px);
    }
    
    .qr-modal-content {
        background: linear-gradient(145deg, var(--secondary-dark), var(--primary-dark));
        border-radius: 20px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        border: 1px solid rgba(212, 175, 55, 0.3);
        position: relative;
    }
    
    .qr-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
    }
    
    .qr-modal-header h3 {
        color: var(--text-light);
        font-size: 1.2rem;
    }
    
    .qr-close {
        background: none;
        border: none;
        color: var(--text-light);
        font-size: 2rem;
        cursor: pointer;
        line-height: 1;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .qr-code-display {
        background: white;
        border-radius: 10px;
        padding: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 250px;
        margin-bottom: 20px;
    }
    
    .qr-placeholder {
        text-align: center;
        color: var(--primary-dark);
    }
    
    .qr-placeholder i {
        font-size: 4rem;
        margin-bottom: 15px;
        opacity: 0.5;
    }
    
    .qr-placeholder p {
        font-size: 0.9rem;
    }
    
    .qr-account {
        font-family: 'Courier New', monospace;
        font-size: 1.1rem;
        color: var(--primary-dark);
        margin-top: 20px;
        letter-spacing: 1px;
        background: #f8f9fa;
        padding: 10px 20px;
        border-radius: 5px;
        width: 100%;
        text-align: center;
    }
    
    .qr-instruction {
        color: var(--text-dim);
        font-size: 0.9rem;
        text-align: center;
        margin-top: 20px;
    }
    
    .event-live {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        color: var(--islamic-green);
        font-size: 1.2rem;
        font-weight: 500;
    }
    
    .event-live i {
        color: var(--islamic-green);
        animation: pulse 1.5s ease-in-out infinite;
    }
`;

document.head.appendChild(style);

/**
 * PRELOAD IMAGES
 */
function preloadImages() {
    const images = [
        'pengantinpria.jpg',
        'mempelaiwanita.jpg',
        '1.jpeg',
        '2.jpg',
        '3.jpg',
        '4.jpg',
        '5.jpg',
        '6.jpg',
        'BSI.jpg',
        'mandiri.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Jalankan preload
preloadImages();

/**
 * LAZY LOAD IMAGES
 */
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

/**
 * SERVICE WORKER REGISTRATION (Optional - untuk PWA)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

/**
 * OFFLINE DETECTION
 */
window.addEventListener('online', () => {
    showNotification('Koneksi internet kembali pulih.', 'info');
});

window.addEventListener('offline', () => {
    showNotification('Anda sedang offline. Beberapa fitur mungkin terbatas.', 'error');
});

/**
 * SHARE BUTTON FUNCTIONALITY
 */
function shareInvitation() {
    const shareData = {
        title: 'Undangan Pernikahan Fulan & Fulanah',
        text: 'Saya mengundang Anda untuk menghadiri pernikahan kami. Klik link untuk melihat undangan digital.',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Berhasil berbagi'))
            .catch(error => console.log('Gagal berbagi:', error));
    } else {
        // Fallback untuk browser yang tidak support Web Share API
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                showNotification('Link undangan berhasil disalin!');
            });
    }
}