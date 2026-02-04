/**
 * KONFIGURASI AWAL
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out-quart',
        once: false,
        mirror: true,
        offset: 100,
        disable: window.innerWidth < 768 ? true : false
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
        let name = '';
        
        const urlParams = new URLSearchParams(window.location.search);
        name = urlParams.get('to');
        
        if (!name) {
            const url = window.location.href;
            let match = url.match(/[?&]to=([^&]+)/);
            if (match) name = match[1];
            
            if (!name) {
                const hash = window.location.hash.substring(1);
                if (hash.startsWith('to=')) name = hash.substring(3);
            }
        }
        
        const nameDisplay = document.getElementById('guest-name-display');
        const rsvpNameInput = document.querySelector('input[name="Nama"]');
        
        if (name) {
            name = decodeURIComponent(name.replace(/\+/g, ' '));
            name = name.toLowerCase().split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            
            guestName = name;
            nameDisplay.innerText = name;
            
            if (rsvpNameInput) {
                rsvpNameInput.value = name;
                rsvpNameInput.classList.add('valid');
                const event = new Event('input', { bubbles: true });
                rsvpNameInput.dispatchEvent(event);
            }
            
            localStorage.setItem('weddingGuestName', name);
            console.log('Nama tamu ditemukan:', name);
        } else {
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
    getGuestName();
    updateRSVPStats();
    loadMessages();
    
    // Inisialisasi audio
    audio.volume = 0.3;
    audio.preload = 'auto';
    
    // Auto-hide floating tasbih di mobile
    if (window.innerWidth < 768) {
        document.querySelector('.floating-tasbih').style.display = 'none';
    }

    /**
     * LOGIKA BUKA UNDANGAN & AUDIO
     */
    openBtn.addEventListener('click', () => {
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.pointerEvents = 'none';
        
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        isPlaying = true;
                        musicBtn.querySelector('i').className = 'fas fa-volume-up';
                    })
                    .catch(error => {
                        console.log("Autoplay prevented:", error);
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
    window.copyBankNumber = function(text, bankName) {
        navigator.clipboard.writeText(text.replace(/\s/g, ''))
            .then(() => {
                showNotification(`Nomor rekening ${bankName} berhasil disalin!`);
            })
            .catch(err => {
                console.error('Gagal menyalin:', err);
                showNotification('Gagal menyalin, coba manual ya!', 'error');
            });
    }

    window.copyDoa = function() {
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
        const oldNotif = document.querySelector('.custom-notification');
        if (oldNotif) oldNotif.remove();
        
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * RSVP FORM - VERSI FINAL FIX
     */
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_ZSamiEpIBLtDLy9B9lUaiC0PpaAwBWwww6JN5tooow4z8ezOMXy0LAnQhW_KksrQ/exec';

    const rsvpForm = document.getElementById('rsvpForm');
    
    if (rsvpForm) {
        // HAPUS SEMUA EVENT LISTENER LAMA
        const newForm = rsvpForm.cloneNode(true);
        rsvpForm.parentNode.replaceChild(newForm, rsvpForm);
        
        // EVENT LISTENER BARU
        document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.log('📝 Form submitted - PREVENTED DEFAULT');
            
            // Ambil data dengan cara yang aman
            const formElements = this.elements;
            const data = {
                Nama: (formElements.Nama && formElements.Nama.value) || '',
                Jumlah: (formElements.Jumlah && formElements.Jumlah.value) || '1',
                Kehadiran: (formElements.Kehadiran && formElements.Kehadiran.value) || '',
                Acara: (formElements.Acara && formElements.Acara.value) || '',
                Pesan: (formElements.Pesan && formElements.Pesan.value) || ''
            };
            
            console.log('📤 Data to send:', data);
            
            // Validasi
            if (!data.Nama.trim()) {
                showNotification('❌ Mohon isi nama lengkap', 'error');
                return false;
            }
            
            if (!data.Kehadiran) {
                showNotification('❌ Mohon pilih konfirmasi kehadiran', 'error');
                return false;
            }
            
            if (!data.Acara) {
                showNotification('❌ Mohon pilih acara yang akan dihadiri', 'error');
                return false;
            }
            
            // Tampilkan loading
            const submitBtn = document.getElementById('submitBtn');
            if (!submitBtn) return false;
            
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            
            // Buat loading overlay
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
            document.body.appendChild(loadingOverlay);
            
            try {
                console.log('🌐 Sending to Google Sheets...');
                
                // Kirim ke Google Sheets
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('📥 Response type:', response.type);
                
                // Simpan ke localStorage
                saveToLocalStorage(data);
                
                // Update statistik
                updateRSVPStats();
                
                // Reset form (jaga nama)
                const namaField = this.querySelector('[name="Nama"]');
                const savedName = namaField ? namaField.value : '';
                
                this.reset();
                if (namaField) {
                    namaField.value = savedName;
                }
                
                // Tampilkan sukses
                showNotification('✅ Konfirmasi berhasil dikirim! Terima kasih atas doanya. ❤️', 'success');
                
                // Scroll ke statistik
                setTimeout(() => {
                    const statsSection = document.querySelector('.rsvp-stats');
                    if (statsSection) {
                        statsSection.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }
                }, 500);
                
                console.log('✅ Success!');
                
            } catch (error) {
                console.error('❌ Submit error:', error);
                
                // Fallback ke localStorage
                saveToLocalStorage(data);
                updateRSVPStats();
                
                showNotification('⚠️ Data disimpan secara lokal. ' + error.message, 'error');
                
            } finally {
                // Reset tombol
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                
                // Hapus loading overlay
                if (document.querySelector('.loading-overlay')) {
                    document.querySelector('.loading-overlay').remove();
                }
            }
            
            return false;
        });
    }

    /**
     * Simpan ke localStorage
     */
    function saveToLocalStorage(data) {
        try {
            const key = 'wedding_rsvp_data';
            let existing = JSON.parse(localStorage.getItem(key)) || [];
            
            const entry = {
                ...data,
                timestamp: new Date().toISOString(),
                id: Date.now()
            };
            
            existing.unshift(entry);
            if (existing.length > 100) {
                existing = existing.slice(0, 100);
            }
            
            localStorage.setItem(key, JSON.stringify(existing));
            console.log('💾 Saved to localStorage:', entry.Nama);
            
        } catch (err) {
            console.error('Error saving to localStorage:', err);
        }
    }

    /**
     * UPDATE RSVP STATISTICS
     */
    function updateRSVPStats() {
        try {
            const rsvpList = JSON.parse(localStorage.getItem('wedding_rsvp_data')) || [];
            
            const total = rsvpList.length;
            const attending = rsvpList.filter(item => 
                item.Kehadiran === 'Hadir' || item.Kehadiran === 'Hadir (Insha Allah)'
            ).length;
            const maybe = rsvpList.filter(item => 
                item.Kehadiran === 'Ragu' || item.Kehadiran === 'Masih Ragu'
            ).length;
            
            // Update display
            const totalEl = document.getElementById('totalGuests');
            const attendingEl = document.getElementById('attendingGuests');
            const maybeEl = document.getElementById('maybeGuests');
            
            if (totalEl) totalEl.textContent = total;
            if (attendingEl) attendingEl.textContent = attending;
            if (maybeEl) maybeEl.textContent = maybe;
            
            console.log('📊 Stats updated:', { total, attending, maybe });
            
        } catch (error) {
            console.error('Error updating stats:', error);
        }
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
        const diff = Math.floor((now - past) / 1000);
        
        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
        return `${Math.floor(diff / 604800)} minggu lalu`;
    }

    /**
     * WHATSAPP RSVP
     */
    const whatsappBtn = document.querySelector('.btn-whatsapp');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const name = document.querySelector('input[name="Nama"]')?.value || 
                        localStorage.getItem('weddingGuestName') || 
                        'Tamu Undangan';
            const jumlah = document.querySelector('input[name="Jumlah"]')?.value || '1';
            const kehadiran = document.querySelector('select[name="Kehadiran"]')?.value || 'Hadir';
            const acara = document.querySelector('select[name="Acara"]')?.value || 'Keduanya';
            const pesan = document.querySelector('textarea[name="Pesan"]')?.value || '';
            
            const phone = '6285161808524';
            
            const message = `Assalamu'alaikum,

*Konfirmasi Kehadiran Pernikahan*

Nama: ${name}
Jumlah: ${jumlah} orang
Kehadiran: ${kehadiran}
Acara: ${acara}
Pesan: ${pesan}

*Konfirmasi via WhatsApp*
`;
            
            const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, '_blank', 'noopener,noreferrer');
        });
    }

    /**
     * SAVE TO CONTACTS
     */
    window.saveToContacts = function(name, account, bank) {
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
    window.openTransferApp = function(account, bank) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            const bankApps = {
                'BSI': 'bsimobile://',
                'Mandiri': 'livin://'
            };
            
            if (bankApps[bank]) {
                window.location.href = bankApps[bank];
            } else {
                window.open(`https://m.${bank.toLowerCase()}.co.id`, '_blank');
            }
        } else {
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
     * NAVIGATION SCROLL
     */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.islamic-nav a');

    // Smooth scroll untuk semua link navigasi
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = window.innerWidth < 768 ? 80 : 100;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update fungsi scroll untuk aktifkan nav
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            const offset = window.innerWidth < 768 ? 100 : 200;
            
            if (pageYOffset >= sectionTop - offset) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            
            if (href === current) {
                link.classList.add('active');
            }
        });
    });

    /**
     * ADDITIONAL CSS FOR DYNAMIC ELEMENTS
     */
    const style = document.createElement('style');
    style.textContent = `
        /* Loading Overlay */
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 25, 47, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10004;
            backdrop-filter: blur(5px);
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            border-top-color: var(--accent-gold);
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        /* Audio Instructions */
        .audio-instructions {
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: linear-gradient(135deg, var(--secondary-dark), var(--primary-dark));
            border: 1px solid var(--accent-gold);
            border-radius: 15px;
            padding: 15px;
            max-width: 280px;
            width: calc(100% - 40px);
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
            gap: 12px;
            text-align: center;
        }
        
        .instructions-content i {
            font-size: 1.8rem;
            color: var(--accent-gold);
        }
        
        .instructions-content p {
            color: var(--text-light);
            font-size: 0.85rem;
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
            font-size: 0.9rem;
        }
        
        .instructions-content button:hover {
            transform: translateY(-2px);
        }
        
        /* Notifications */
        .custom-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            left: 20px;
            background: linear-gradient(135deg, var(--secondary-dark), var(--primary-dark));
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 10px;
            padding: 12px 15px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10002;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            margin: 0 auto;
        }
        
        .custom-notification.show {
            opacity: 1;
            transform: translateY(0);
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
            font-size: 1.1rem;
            flex-shrink: 0;
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
            font-size: 0.85rem;
            line-height: 1.4;
        }
        
        /* Messages */
        .message-item {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 15px;
            border: 1px solid rgba(212, 175, 55, 0.1);
        }
        
        .message-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        
        .message-header i {
            font-size: 1.8rem;
            color: var(--accent-gold);
            flex-shrink: 0;
        }
        
        .message-header strong {
            color: var(--text-light);
            display: block;
            margin-bottom: 3px;
            font-size: 0.95rem;
        }
        
        .message-header small {
            color: var(--text-dim);
            font-size: 0.75rem;
        }
        
        .message-content p {
            color: var(--text-dim);
            line-height: 1.5;
            font-size: 0.85rem;
        }
        
        /* QR Modal */
        .qr-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10003;
            backdrop-filter: blur(5px);
            padding: 20px;
        }
        
        .qr-modal-content {
            background: linear-gradient(145deg, var(--secondary-dark), var(--primary-dark));
            border-radius: 20px;
            padding: 25px;
            max-width: 400px;
            width: 100%;
            border: 1px solid rgba(212, 175, 55, 0.3);
            position: relative;
        }
        
        .qr-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .qr-modal-header h3 {
            color: var(--text-light);
            font-size: 1.1rem;
            line-height: 1.3;
        }
        
        .qr-close {
            background: none;
            border: none;
            color: var(--text-light);
            font-size: 1.8rem;
            cursor: pointer;
            line-height: 1;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .qr-code-display {
            background: white;
            border-radius: 10px;
            padding: 25px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 200px;
            margin-bottom: 20px;
        }
        
        .qr-placeholder {
            text-align: center;
            color: var(--primary-dark);
        }
        
        .qr-placeholder i {
            font-size: 3rem;
            margin-bottom: 12px;
            opacity: 0.5;
        }
        
        .qr-placeholder p {
            font-size: 0.85rem;
        }
        
        .qr-account {
            font-family: 'Courier New', monospace;
            font-size: 1rem;
            color: var(--primary-dark);
            margin-top: 15px;
            letter-spacing: 1px;
            background: #f8f9fa;
            padding: 10px 15px;
            border-radius: 5px;
            width: 100%;
            text-align: center;
            word-break: break-all;
        }
        
        .qr-instruction {
            color: var(--text-dim);
            font-size: 0.85rem;
            text-align: center;
            margin-top: 15px;
            line-height: 1.5;
        }
        
        /* Event Live */
        .event-live {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            color: var(--islamic-green);
            font-size: 1rem;
            font-weight: 500;
            padding: 15px;
        }
        
        .event-live i {
            color: var(--islamic-green);
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        @media (min-width: 768px) {
            .custom-notification {
                left: auto;
                right: 30px;
                max-width: 350px;
            }
            
            .qr-modal-content {
                padding: 30px;
            }
            
            .audio-instructions {
                right: 30px;
                max-width: 300px;
            }
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

    preloadImages();

    /**
     * LAZY LOAD IMAGES
     */
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('src');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });
    
    images.forEach(img => imageObserver.observe(img));

    /**
     * Handle Waze button
     */
    const wazeBtn = document.querySelector('.btn-waze');
    if (wazeBtn) {
        wazeBtn.addEventListener('click', function() {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const wazeURL = isMobile ? 'waze://' : 'https://www.waze.com/ul';
            
            if (isMobile) {
                window.location.href = wazeURL;
                setTimeout(() => {
                    window.location.href = 'https://www.waze.com/ul';
                }, 500);
            } else {
                window.open('https://www.waze.com/ul', '_blank');
            }
        });
    }
});