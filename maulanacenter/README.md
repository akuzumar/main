# Maulana Center - Static Website

Website statis (HTML, CSS, JS) untuk Maulana Center. Tidak menggunakan framework.

## Struktur
- `index.html` — Beranda
- `about.html` — Tentang Kami
- `services.html` — Program/Layanan
- `registration-process.html` — Proses Registrasi
- `requirements.html` — Persyaratan
- `costs.html` — Biaya
- `articles.html` — Artikel/Blog
- `testimonials.html` — Testimoni
- `faq.html` — FAQ
- `contact.html` — Kontak
- `assets/css/styles.css` — Styling utama
- `assets/js/main.js` — Interaksi sederhana (menu, animasi)
- `assets/images/` — Gambar placeholder
- `assets/docs/brosur-maulana-center.pdf` — Placeholder brosur

## Menjalankan secara lokal
1. Buka `index.html` di browser.
2. Atau jalankan server statis sederhana:

```bash
python3 -m http.server 8080
```

Lalu buka `http://localhost:8080`.

## Mengganti aset gambar dan logo
Ganti placeholder berikut dengan file asli (nama file boleh sama agar tidak perlu mengubah HTML):
- `assets/images/logo-maulana-center.svg`
- `assets/images/placeholder-hero.svg`
- `assets/images/placeholder-card.svg`
- `assets/images/placeholder-person.svg`

Jika Anda mengganti nama file, perbarui referensi pada seluruh file HTML.

## Brosur
- Ganti `assets/docs/brosur-maulana-center.pdf` dengan file brosur resmi.

## Kontak & WhatsApp
- Perbarui tautan WhatsApp pada semua file HTML (`href` pada tombol WhatsApp) agar mengarah ke nomor resmi.
- Perbarui alamat kantor dan sumber Google Maps di `contact.html`.

## Deployment
Karena ini situs statis, Anda bisa men-deploy ke:
- GitHub Pages
- Netlify
- Vercel (Static)

Cukup unggah semua file di root folder ini.
