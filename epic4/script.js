// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: false,
        offset: 100,
        easing: 'ease-in-out'
    });
    
    // Initialize dummy wishes
    loadDummyWishes();
    
    // Initialize countdown
    initializeCountdown();
    
    // Setup event listeners
    setupEventListeners();
});

// --- BAGIAN MUSIK & COVER (REPLACE KODE LAMA) ---

const music = document.getElementById('backgroundMusic');
const icon = document.getElementById('musicIcon');
const openBtn = document.getElementById('openBtn');

// 1. Setup Awal: Volume & Nonaktifkan Scroll
music.volume = 0.5;
document.body.style.overflow = 'hidden'; // Kunci scroll saat di cover

// 2. Fungsi Tombol "Buka Undangan"
openBtn.addEventListener('click', function() {
    // A. Putar Musik
    music.play().then(() => {
        icon.className = "fas fa-pause";
    }).catch((error) => {
        console.log("Gagal memutar audio otomatis: ", error);
    });

    // B. Buka Kunci Scroll
    document.body.style.overflow = 'auto';

    // C. Scroll Halus ke Section Mempelai
    document.getElementById('couple').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    // D. Jalankan Animasi AOS (opsional, untuk memastikan animasi jalan)
    setTimeout(() => {
        AOS.refresh();
    }, 500);
});

// 3. Toggle Icon Musik (Play/Pause manual)
document.getElementById('musicControl').onclick = () => {
    if (music.paused) {
        music.play();
        icon.className = "fas fa-pause";
    } else {
        music.pause();
        icon.className = "fas fa-play";
    }
};

// --- AKHIR BAGIAN MUSIK ---

// Countdown Timer
function initializeCountdown() {
    // Set the wedding date (June 15, 2024)
    const weddingDate = new Date('June 15, 2026 08:00:00').getTime();
    
    // Update countdown every second
    const countdownInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // If the countdown is over
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerHTML = "<h3>Acara akan dilaksanakan!</h3>";
        }
    }, 1000);
}

// Lightbox Gallery
// Lightbox Gallery dengan foto asli
function openLightbox(imgId) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Daftar foto dengan URL dan caption
    const photos = {
        'foto1': {
            url: '1.jpeg',//ganti
            caption: 'Prewedding'//ganti
        },
        'foto2': {
            url: '2.jpg',//ganti
            caption: 'Prewedding'//ganti
        },
        'foto3': {
            url: '3.jpg',//ganti
            caption: 'Prewedding'//ganti
        },
        'foto4': {
            url: '4.jpg',//ganti
            caption: 'Prewedding'//ganti
        },
        'foto5': {
            url: '5.jpg',//ganti
            caption: 'Sesi Foto Adat Jawa'//ganti
        },
        'foto6': {
            url: '7.jpg',//ganti
            caption: 'Persiapan Pernikahan'//ganti
        }
    };
    
    const photo = photos[imgId] || photos['foto1'];
    
    // Set image di lightbox
    lightboxImg.innerHTML = `<img src="${photo.url}" alt="${photo.caption}" style="width:100%; height:100%; object-fit:contain;">`;
    lightboxCaption.textContent = photo.caption;
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close lightbox when clicking outside
window.addEventListener('click', function(event) {
    const lightbox = document.getElementById('lightbox');
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// RSVP Form Submission
const rsvpForm = document.getElementById('rsvpForm');
const submitBtn = document.getElementById('submitBtn');

rsvpForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        nama: document.getElementById('nama').value,
        jumlahTamu: document.getElementById('jumlahTamu').value,
        kehadiran: document.querySelector('input[name="kehadiran"]:checked').value,
        pesan: document.getElementById('pesan').value
    };
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    submitBtn.disabled = true;
    
    try {
        // Replace with your Google Apps Script URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzo-3Xvp_LRkoRLOJr_9uMcF7d6qTQYKXQp5azGfk_tsbXkSCbcO2rnVs2a96zCi81p/exec';
        
        // Send data to Google Sheets via Google Apps Script
        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success message
            showToast('Konfirmasi kehadiran berhasil dikirim!', 'success');
            
            // Add wish to the list
            addWishToList(formData);
            
            // Reset form
            rsvpForm.reset();
            document.getElementById('hadir').checked = true;
        } else {
            throw new Error(result.message || 'Terjadi kesalahan');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Gagal mengirim konfirmasi. Silakan coba lagi.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Load Dummy Wishes
function loadDummyWishes() {
    const dummyWishes = [
        {
            nama: "Budi Santoso",
            kehadiran: "Hadir",
            jumlahTamu: "2",
            pesan: "Selamat menempuh hidup baru. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
            date: "2 hari yang lalu"
        },
        {
            nama: "Dewi Lestari",
            kehadiran: "Hadir",
            jumlahTamu: "1",
            pesan: "Bahagia selalu untuk Arjuna dan Sinta. Doa terbaik menyertai kalian.",
            date: "1 hari yang lalu"
        },
        {
            nama: "Rina Wijaya",
            kehadiran: "Tidak Hadir",
            jumlahTamu: "0",
            pesan: "Maaf tidak bisa hadir. Semoga pernikahan kalian diberkahi dan langgeng hingga akhir hayat.",
            date: "5 jam yang lalu"
        },
        {
            nama: "Ahmad Fauzi",
            kehadiran: "Hadir",
            jumlahTamu: "3",
            pesan: "Sugeng manten! Semoga menjadi pasangan yang harmonis dan sejahtera.",
            date: "3 jam yang lalu"
        }
    ];
    
    const wishesList = document.getElementById('wishesList');
    wishesList.innerHTML = '';
    
    dummyWishes.forEach(wish => {
        const wishElement = createWishElement(wish);
        wishesList.appendChild(wishElement);
    });
}

// Add New Wish to List
function addWishToList(wishData) {
    const wishesList = document.getElementById('wishesList');
    const wishElement = createWishElement({
        ...wishData,
        date: 'Baru saja'
    });
    
    // Add to the top of the list
    wishesList.insertBefore(wishElement, wishesList.firstChild);
    
    // Limit to 10 wishes
    if (wishesList.children.length > 10) {
        wishesList.removeChild(wishesList.lastChild);
    }
}

// Create Wish Element
function createWishElement(wish) {
    const wishItem = document.createElement('div');
    wishItem.className = 'wish-item';
    
    const statusClass = wish.kehadiran === 'Hadir' ? 'status-hadir' : 'status-tidak';
    
    wishItem.innerHTML = `
        <div class="wish-header">
            <div class="wish-name">${wish.nama}</div>
            <div class="wish-status ${statusClass}">${wish.kehadiran} (${wish.jumlahTamu} orang)</div>
        </div>
        <div class="wish-message">${wish.pesan || '(Tidak ada pesan)'}</div>
        <div class="wish-date">${wish.date}</div>
    `;
    
    return wishItem;
}

// Copy to Clipboard Function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Berhasil disalin ke clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Gagal menyalin. Silakan salin manual.', 'error');
    });
}

// Toast Notification
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Set icon based on type
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }, 5000);
}

// Navigation Dots
function setupEventListeners() {
    // Update active nav dot on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navDots = document.querySelectorAll('.nav-dot');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === currentSection) {
                dot.classList.add('active');
            }
        });
    });
    
    // Smooth scroll to section when clicking nav dots
    document.querySelectorAll('.nav-dot').forEach(dot => {
        dot.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        });
    });
}




