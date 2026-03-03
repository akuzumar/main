# Panduan Update Konten (Tanpa Ribet)

## Prinsip Baru
- Bagian berulang sekarang **data-driven**.
- Kamu **tidak perlu** bikin key seperti `exp1Text`, `exp2Text`, dst lagi.
- Untuk tambah/hapus item, cukup edit array di file bahasa:
  - `bahasaindonesia.js`
  - `bahasainggris.js`
  - `bahasaarab.js`

## Daftar Array Yang Bisa Ditambah Tanpa Batas
- `profileItems`
- `skillItems`
- `projectItems`
- `experienceItems`
- `certificateItems`
- `contactInfoItems`
- `socialLinks`

## Format Dasar Item
- `profileItems`: `{ id, label, value }`
- `skillItems`: `{ id, title, text }`
- `projectItems`: `{ id, image, alt, title, text, detail }`
- `experienceItems`: `{ id, date, title, text, image, imageAlt, proof }`
- `certificateItems`: `{ id, image, alt, caption }`
- `contactInfoItems`: `{ id, label, value, href }`
- `socialLinks`: `{ id, label, url, icon }`

## Contoh Tambah 1 Kegiatan Pengabdian
Tambahkan objek baru ke `experienceItems` di `bahasaindonesia.js`:

```js
{
  id: "pengabdian-baru",
  date: "10 Februari 2026",
  title: "Judul Kegiatan Baru",
  text: "Deskripsi singkat kegiatan.",
  image: "images/namafile-gambar.png",
  imageAlt: "Dokumentasi kegiatan baru",
  proof: "Keterangan dokumentasi."
}
```

## Catatan Penting
- `id` sebaiknya unik dan konsisten antar bahasa (ID/EN/AR).
- Jika item belum diterjemahkan di EN/AR, sistem akan fallback ke data Indonesia.
- HTML section tidak perlu diubah saat nambah item.
