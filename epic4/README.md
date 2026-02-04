# Undangan Pernikahan Digital - Tema Adat Jawa

Undangan pernikahan digital dengan tema adat Jawa yang high-end, interaktif, dan responsif.

## Fitur

1. **Desain Bertema Adat Jawa**:
   - Warna cokelat tua, emas, cream, dan terracotta
   - Ornamen batik Jawa sebagai background pattern
   - Tipografi elegan dengan kombinasi font serif dan sans-serif

2. **Sections Lengkap**:
   - Cover depan dengan animasi gunungan wayang
   - Profil mempelai dengan foto dan informasi orang tua
   - Detail acara dengan countdown timer
   - Love story timeline
   - Lokasi dengan Google Maps embed
   - Live stream placeholder
   - Galeri foto masonry dengan lightbox
   - Form RSVP dengan pengiriman data ke Google Sheets
   - Footer dengan kata penutup bahasa Jawa

3. **Fitur Interaktif**:
   - Musik gamelan dengan kontrol floating
   - Navigasi bawah untuk mobile
   - Animasi scroll menggunakan AOS
   - Amplop digital dengan copy rekening dan QRIS
   - Add to Calendar button

4. **Responsive Design**:
   - Mobile-first approach
   - Tampilan optimal di semua ukuran layar

## Cara Menggunakan

### 1. Menjalankan Website
- Buka file `index.html` di browser
- Website sudah bisa digunakan secara offline

### 2. Menghubungkan Form RSVP ke Google Sheets

**Langkah-langkah:**

1. **Buat Google Sheet baru**:
   - Buka [Google Sheets](https://sheets.google.com)
   - Buat spreadsheet baru dengan nama "Wedding RSVP Data"
   - Tambahkan header di baris pertama: `Timestamp, Nama, Email, Jumlah Tamu, Kehadiran, Pesan`

2. **Buat Google Apps Script**:
   - Di Google Sheets, pilih `Extensions` → `Apps Script`
   - Hapus kode default dan ganti dengan isi file `code.gs`
   - Simpan project dengan nama "Wedding RSVP Handler"

3. **Deploy sebagai Web App**:
   - Klik tombol `Deploy` → `New deployment`
   - Pilih type: `Web app`
   - Description: "Wedding RSVP API"
   - Execute as: `Me`
   - Who has access: `Anyone`
   - Klik `Deploy`
   - Authorize aplikasi ketika diminta

4. **Dapatkan URL Web App**:
   - Setelah deploy, copy URL Web App yang diberikan
   - URL akan terlihat seperti: `https://script.google.com/macros/s/.../exec`

5. **Hubungkan ke Website**:
   - Buka file `script.js`
   - Cari fungsi `sendToGoogleSheets` (sekitar baris 244)
   - Ganti `'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'` dengan URL Web App Anda

### 3. Kustomisasi Konten
- **Nama Mempelai**: Edit di file `index.html` pada section `#hero` dan `#couple`
- **Tanggal Acara**: Edit di file `script.js` baris 114 (`const weddingDate`)
- **Foto**: Ganti URL gambar di file `index.html` dengan URL foto Anda
- **Lokasi**: Update koordinat Google Maps di file `index.html` section `#location`
- **Warna**: Sesuaikan variabel CSS di file `style.css` bagian `:root`

## Catatan Penting

1. **Google Sheets API**:
   - Setiap deployment akan menghasilkan URL baru
   - Jika mengubah kode `code.gs`, perlu deploy ulang dan update URL di `script.js`
   - Batas Google Apps Script: 1,000 request per hari (cukup untuk undangan pernikahan)

2. **Hosting**:
   - Website dapat dihosting secara gratis di GitHub Pages, Netlify, atau Vercel
   - Pastikan file `index.html`, `style.css`, dan `script.js` berada di folder yang sama

3. **Musik Background**:
   - URL musik di file `index.html` menggunakan placeholder
   - Ganti dengan URL file musik gamelan Anda sendiri
   - Format yang didukung: MP3, OGG

4. **Cross-Origin Issues**:
   - Jika hosting di domain lain, pastikan CORS diaktifkan
   - Google Apps Script memerlukan `no-cors` mode untuk fetch dari domain eksternal

## Troubleshooting

1. **Form tidak mengirim data**:
   - Periksa console browser untuk error
   - Pastikan URL Google Apps Script sudah benar
   - Coba deploy ulang Google Apps Script

2. **Musik tidak otomatis play**:
   - Browser modern memblokir autoplay
   - User perlu mengklik tombol play manual

3. **Tampilan tidak responsif**:
   - Pastikan meta viewport ada di `<head>`
   - Clear cache browser

## Lisensi

Proyek ini dibuat untuk keperluan pribadi. Silakan modifikasi sesuai kebutuhan.