/**
 * KONFIGURASI AWAL
 */


/**
 * FUNGSI AMBIL NAMA TAMU DARI URL
 */
function getGuestName() {
    // Ambil parameter dari URL (misal: ?to=Nama+Tamu)
    const urlParams = new URLSearchParams(window.location.search);
    let guestName = urlParams.get('to');

    // Target elemen di HTML
    const nameDisplay = document.getElementById('guest-name-display');
    const rsvpNameInput = document.querySelector('input[name="Nama"]');

    if (guestName) {
        // Ganti tanda plus (+) dengan spasi
        guestName = guestName.replace(/\+/g, ' ');
        
        // Tampilkan di Welcome Screen
        nameDisplay.innerText = guestName;

        // Otomatis isi kolom Nama di form RSVP agar tamu tidak repot mengetik
        if (rsvpNameInput) {
            rsvpNameInput.value = guestName;
            // Tambahkan class agar label tidak menumpuk (jika menggunakan animasi label)
            rsvpNameInput.classList.add('valid');
        }
    }
}

// Jalankan fungsi saat halaman dimuat
window.addEventListener('DOMContentLoaded', getGuestName);






AOS.init({
    duration: 1000,
    easing: 'ease-out-quart',
    once: false,
    mirror: true
});

// Elemen DOM
const welcomeScreen = document.getElementById('welcome-screen');
const openBtn        = document.getElementById('btn-open');
const audio          = document.getElementById('bg-music');
const musicBtn       = document.getElementById('music-btn');
const musicIcon      = musicBtn.querySelector('i');
const iosNotif       = document.getElementById('ios-notif'); // Pastikan ID ini ada di HTML

let isPlaying = false;

/**
 * LOGIKA BUKA UNDANGAN & AUDIO
 */
openBtn.addEventListener('click', () => {
    // Sembunyikan screen awal
    welcomeScreen.style.opacity = '0';
    
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        
        // Putar Musik
        audio.play().catch(e => console.log("Audio play blocked", e));
        isPlaying = true;

        // Tampilkan Notifikasi ala iPhone (Jika ada di HTML)
        if (iosNotif) {
            iosNotif.style.display = 'block';
            // Hilang otomatis setelah 6 detik
            setTimeout(() => {
                iosNotif.style.opacity = '0';
                setTimeout(() => { iosNotif.style.display = 'none'; }, 500);
            }, 6000);
        }
    }, 800);
});

// Kontrol tombol musik manual
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        musicIcon.className = 'fa-solid fa-volume-xmark';
        if (iosNotif) iosNotif.style.display = 'none';
    } else {
        audio.play();
        musicIcon.className = 'fa-solid fa-compact-disc fa-spin';
    }
    isPlaying = !isPlaying;
});

/**
 * CUSTOM CURSOR (Hanya untuk Desktop)
 */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (window.matchMedia("(min-width: 769px)").matches) {
    cursorDot.style.display = "block";
    cursorOutline.style.display = "block";

    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
        cursorOutline.animate({
            transform: `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`
        }, { duration: 500, fill: "forwards" });
    });

    // Efek hover pada elemen interaktif
    document.querySelectorAll('a, button, .timeline-item, .couple-card, .bank-card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}

/**
 * COUNTDOWN TIMER
 */
const weddingDate = new Date("Jan 09, 2027 08:00:00").getTime();

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
        document.getElementById("countdown").innerHTML = "Acara Sedang Berlangsung!";
    }
}, 1000);

/**
 * COPY TO CLIPBOARD
 */
function copyText(text) {
    navigator.clipboard.writeText(text);
    alert("Nomor rekening berhasil disalin: " + text);
}

/**
 * NAVIGATION SCROLL ACTIVE
 */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.glass-nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                let target = document.querySelector('.glass-nav a[href*=' + id + ']');
                if (target) target.classList.add('active');
            });
        }
    });
};

/**
 * RSVP FORM (GOOGLE SHEETS)
 */
const scriptURL = 'https://script.google.com/macros/s/AKfycbxZHoDpQ-JJnpplwbDh5N8gJwJ60dp6ZRbXsvM8i0n4UQF0r7qPzdeYoLBStef8sRIR/exec';
const form = document.getElementById('rsvpForm');
const btn = document.getElementById('submitBtn');

form.addEventListener('submit', e => {
    e.preventDefault();
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Mengirim <i class="fa-solid fa-spinner fa-spin"></i>';

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            alert('Terima kasih! Konfirmasi kehadiran Anda telah tersimpan.');
            form.reset();
        })
        .catch(error => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            alert('Maaf, terjadi kesalahan saat mengirim data.');
            console.error('Error!', error.message);
        });
});