---
title: Sistem Informasi Antrean Puskesmas Gladak Pakem Jember

---

# 📋 Analisa Proyek: Sistem Informasi Antrean Puskesmas Gladak Pakem Jember

> **Versi Dokumen:** 3.0
> **Tanggal:** 26 Februari 2026
> **Status:** Draft Analisa
> **Ruang Lingkup:** Sistem Antrean + Pendaftaran (Loket)
> **Referensi Alur:** Bagan Alur Pendaftaran PKM Gladak Pakem

---

## Daftar Isi

- [1. Profil Puskesmas Gladak Pakem](#1--profil-puskesmas-gladak-pakem)
- [2. Latar Belakang & Tujuan Proyek](#2--latar-belakang--tujuan-proyek)
- [3. Alur Bisnis (Business Flow)](#3--alur-bisnis-business-flow)
- [4. Arsitektur Sistem](#4--arsitektur-sistem)
- [5. Modul-Modul Sistem](#5--modul-modul-sistem)
- [6. Desain Database (Core Schema)](#6--desain-database-core-schema)
- [7. Integrasi BPJS — API Flow](#7--integrasi-bpjs--api-flow)
- [8. Wireframe Halaman Utama](#8--wireframe-halaman-utama)
- [9. Timeline & Milestone Pengembangan](#9--timeline--milestone-pengembangan)
- [10. Keamanan & Compliance](#10--keamanan--compliance)
- [11. Estimasi Resource & Biaya](#11--estimasi-resource--biaya)
- [12. Kesimpulan & Rekomendasi](#12--kesimpulan--rekomendasi)

---

## 1. 🏥 Profil Puskesmas Gladak Pakem

| Item | Detail |
|------|--------|
| **Nama** | Puskesmas Gladak Pakem |
| **Alamat** | Jl. Wolter Monginsidi No. 25, Kranjingan, Kec. Sumbersari, Kab. Jember, Jawa Timur |
| **Telepon** | (0331) 337772 / 082142146939 |
| **Email** | pkmgladakpakem@gmail.com |
| **Instagram** | @puskesmas_gladakpakem |
| **Website** | [Google Sites — Puskesmas Gladak Pakem](https://sites.google.com/view/puskesmas-gladak-pakem/beranda) |
| **Wilayah Kerja** | Kelurahan Kranjingan & Kebonsari |
| **Status BPJS** | Fasilitas Kesehatan Tingkat Pertama (FKTP) |
| **Motto** | *"Melayani Sepenuh Hati"* |
| **Prinsip** | Sinergi, Kolaborasi, dan Akselerasi |

### Layanan yang Tersedia

| No | Layanan | Keterangan |
|----|---------|------------|
| 1 | Rawat Jalan | Pemeriksaan umum, cek tensi, lab |
| 2 | Rawat Inap 24 Jam | Observasi & perawatan |
| 3 | UGD 24 Jam | Kasus darurat medis |
| 4 | Persalinan 24 Jam | Tim bidan & dokter |
| 5 | Poli Umum | Pemeriksaan kesehatan umum |
| 6 | Poli KIA/KB | Kesehatan Ibu Anak & Keluarga Berencana |
| 7 | Poli Gigi & Mulut | Pelayanan kesehatan gigi |
| 8 | Poli Imunisasi | Imunisasi dasar bayi & balita |
| 9 | Farmasi / Apotek | Penyediaan & penyerahan obat |
| 10 | Laboratorium | Pemeriksaan diagnostik sederhana |
| 11 | Gizi & Konsultasi | Konseling nutrisi |
| 12 | Ambulans (Ambudes) | Layanan 24 jam untuk 2 kelurahan |

---

## 2. 🎯 Latar Belakang & Tujuan Proyek

### Latar Belakang

Puskesmas Gladak Pakem sebagai FKTP BPJS Kesehatan melayani masyarakat Kranjingan dan Kebonsari, Kabupaten Jember. Proses pengambilan antrean dan pendaftaran yang masih manual menimbulkan:

- **Waktu tunggu** pasien lama dan tidak terukur
- **Antrian fisik** menumpuk terutama di pagi hari
- **Pendaftaran manual** — petugas loket harus input ulang data setiap kunjungan
- **Verifikasi BPJS manual** — petugas buka PCare terpisah untuk cek kepesertaan
- **Tidak ada pembedaan antrian** — pasien prioritas (lansia, bumil, disabilitas, balita) tidak terlayani duluan secara sistematis
- **Tidak ada estimasi** — pasien tidak tahu kapan gilirannya

### Tujuan Proyek

1. **Digitalisasi pengambilan antrean** — onsite (kiosk) & online (web/mobile) dengan pembedaan **Prioritas** dan **Umum**
2. **Digitalisasi pendaftaran loket** — pasien baru (KTP/KK/BPJS/KIA) & pasien lama (kartu kunjungan)
3. **Integrasi BPJS di loket** — cek peserta aktif + bridging pendaftaran kunjungan PCare
4. **Display antrean real-time** — TV monitor di ruang tunggu
5. **Notifikasi pasien** — WhatsApp/push saat nomor mendekati giliran

### Ruang Lingkup

```
Fokus: Sistem Antrean + Pendaftaran Loket
Alur : Pasien Datang → Ambil Antrean (Prioritas/Umum)
       → Pendaftaran Loket (Baru/Lama)
       → Verifikasi & Bridging BPJS
       → Rekam Medis
       → Pemberian Informasi Wajib
       → Petugas Antar RM
       → Pasien Menuju Poli Tujuan ✅ (SELESAI)

Tidak termasuk: Pelayanan Poli, UGD, Lab, Farmasi, Kasir, Rawat Inap
```

---

## 3. 🔄 Alur Bisnis (Business Flow)

> Disusun berdasarkan **Bagan Alur Pendaftaran** resmi Puskesmas Gladak Pakem.

### 3.1 Bagan Alur Lengkap

```
                         ┌─────────────────┐
                         │  PASIEN DATANG   │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
           ┌────────────────┐          ┌────────────────┐
           │   PRIORITAS    │          │     UMUM       │
           │ (Lansia, Bumil,│          │ (Pasien biasa) │
           │  Disabilitas,  │          │                │
           │  Balita)       │          │                │
           └───────┬────────┘          └───────┬────────┘
                   ▼                           ▼
        ┌─────────────────────┐     ┌─────────────────────┐
        │ Ambil Nomor Antrean │     │ Ambil Nomor Antrean │
        │     KHUSUS          │     │     UMUM            │
        │  Prefix: P          │     │  Prefix: A/B/C/D/E  │
        │ (Kiosk / Web /      │     │ (Kiosk / Web /      │
        │  Mobile)            │     │  Mobile)            │
        └──────────┬──────────┘     └──────────┬──────────┘
                   │                           │
                   └─────────────┬─────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │      PENDAFTARAN        │
                    │      (LOKET)            │
                    │  Petugas panggil nomor  │
                    │  Prioritas didahulukan  │
                    └────────────┬────────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   ▼                           ▼
          ┌─────────────────┐         ┌─────────────────┐
          │  PASIEN BARU    │         │  PASIEN LAMA    │
          └────────┬────────┘         └────────┬────────┘
                   │                           │
                   ▼                           ▼
        ┌─────────────────────┐   ┌──────────────────────────┐
        │ Menyerahkan         │   │ Menyerahkan              │
        │ fotokopi:           │   │ - Kartu Kunjungan        │
        │ - KTP               │   │ - Fotokopi KTP/BPJS      │
        │ - KK                │   │   (bagi pasien BPJS)     │
        │ - BPJS              │   │                          │
        │ - KIA (Kartu        │   │ Sistem: Cari by          │
        │   Identitas Anak)   │   │ No.RM / NIK / No.BPJS   │
        └────────┬────────────┘   └──────────┬───────────────┘
                 │                           │
                 └─────────────┬─────────────┘
                               ▼
               ┌───────────────────────────────┐
               │  VERIFIKASI BPJS              │
               │  (Jika pasien BPJS)           │
               │  - Cek No. BPJS → PCare API   │
               │  - Cek Peserta Aktif           │
               │  - Bridging Pendaftaran PCare  │
               └──────────────┬────────────────┘
                              ▼
               ┌───────────────────────────────┐
               │          RM                    │
               │  (Rekam Medis)                 │
               │  - Buat RM baru (pasien baru)  │
               │  - Ambil RM lama (pasien lama) │
               └──────────────┬────────────────┘
                              ▼
               ┌───────────────────────────────┐
               │  PEMBERIAN INFORMASI WAJIB    │
               │  - Hak & kewajiban pasien     │
               │  - Info pelayanan              │
               │  - Persetujuan umum            │
               └──────────────┬────────────────┘
                              ▼
               ┌───────────────────────────────┐
               │  PETUGAS MENGANTARKAN RM      │
               │  ke Poli Tujuan                │
               └──────────────┬────────────────┘
                              ▼
               ┌───────────────────────────────┐
               │  PASIEN MENUJU POLI TUJUAN    │
               │  → Masuk antrean poli          │
               │  ✅ SELESAI (scope sistem)     │
               └───────────────────────────────┘
```

### 3.2 Detail Per Step

#### Step 1 — Pengambilan Antrean

```
Pasien Datang ke Puskesmas
    │
    ├── Lewat KIOSK (Onsite)
    │   ├── Pilih kategori: PRIORITAS / UMUM
    │   │   └── Jika Prioritas → pilih alasan (lansia/bumil/disabilitas/balita)
    │   ├── Pilih jenis pembayaran: BPJS / UMUM
    │   ├── Pilih poli tujuan: Poli Umum / Gigi / KIA / Imunisasi / UGD
    │   ├── Cetak tiket antrean
    │   │   └── Tiket berisi: Nomor (P-001 / A-001), tanggal, poli, estimasi
    │   └── Masuk antrean loket pendaftaran
    │
    ├── Lewat WEB (Online — sebelum datang)
    │   ├── Buka web → pilih kategori + poli + tanggal
    │   ├── Input NIK / No. BPJS (opsional, untuk pasien lama)
    │   ├── Dapat nomor antrean virtual
    │   └── Datang ke puskesmas → konfirmasi di kiosk / loket
    │
    └── Lewat MOBILE (Konfirmasi)
        ├── Pasien yang sudah booking online → konfirmasi kedatangan
        └── Status antrean berubah: "confirmed" → siap dipanggil

Aturan Pemanggilan:
  ⭐ Antrean PRIORITAS (P-xxx) selalu dipanggil lebih dulu
  👤 Antrean UMUM (A/B/C/D/E-xxx) dipanggil setelahnya
  📊 Rasio bisa diatur: misal 2 prioritas : 1 umum, atau full prioritas dulu
```

#### Step 2 — Pendaftaran di Loket

```
Petugas Loket memanggil nomor antrean
    │
    ├── PASIEN BARU
    │   ├── Belum punya No. Rekam Medis
    │   ├── Menyerahkan fotokopi dokumen:
    │   │   ├── KTP (wajib)
    │   │   ├── KK (wajib)
    │   │   ├── Kartu BPJS (jika peserta BPJS)
    │   │   └── KIA — Kartu Identitas Anak (jika pasien anak)
    │   ├── Petugas input data ke sistem:
    │   │   ├── NIK, Nama, TTL, Jenis Kelamin
    │   │   ├── Alamat (RT/RW, Kel, Kec, Kab)
    │   │   ├── No. Telepon
    │   │   ├── Golongan Darah, Status Pernikahan, Pekerjaan
    │   │   ├── Alergi (jika ada)
    │   │   └── Upload scan dokumen (KTP/KK/BPJS/KIA)
    │   ├── Sistem generate No. Rekam Medis baru
    │   └── Cetak Kartu Kunjungan → diberikan ke pasien
    │
    └── PASIEN LAMA
        ├── Sudah punya No. Rekam Medis
        ├── Menyerahkan:
        │   ├── Kartu Kunjungan
        │   └── Fotokopi KTP/BPJS (bagi pasien BPJS)
        ├── Petugas cari data di sistem by:
        │   ├── No. Rekam Medis, atau
        │   ├── NIK, atau
        │   └── No. BPJS
        └── Verifikasi & update data jika ada perubahan
```

#### Step 3 — Verifikasi & Bridging BPJS

```
Jika pasien BPJS:
    │
    ├── Petugas klik "Cek BPJS"
    │   └── Sistem: GET /peserta/{noBpjs} → PCare API
    │       └── Tampilkan: Nama, Kelas, Jenis Peserta, Status Aktif/Tidak
    │
    ├── ✅ Peserta Aktif
    │   └── Petugas klik "Daftarkan ke BPJS"
    │       └── Sistem: POST /pendaftaran → PCare API
    │           └── Dapat ID Kunjungan → simpan ke database
    │
    └── ❌ Peserta Tidak Aktif
        └── Informasikan ke pasien → arahkan bayar umum / tunda
```

#### Step 4 — Rekam Medis (RM)

```
    ├── Pasien Baru → Sistem buat RM baru (auto-generate nomor)
    └── Pasien Lama → Sistem ambil RM lama dari database
```

#### Step 5 — Pemberian Informasi Wajib

```
Petugas menyampaikan:
    ├── [☑] Hak pasien (mendapat informasi, privasi, dll)
    ├── [☑] Kewajiban pasien (memberikan info lengkap, mematuhi aturan)
    ├── [☑] Info pelayanan yang akan diterima
    └── [☑] Persetujuan umum (general consent) → pasien tanda tangan
    
Sistem: Checklist digital → tercatat siapa yang menyampaikan & kapan
```

#### Step 6 — Antar RM & Pasien Menuju Poli

```
    ├── Petugas mengantarkan berkas RM ke poli tujuan
    ├── Pasien diarahkan menuju ruang tunggu poli
    ├── Sistem: Update status antrean → "registered" / "directed_to_poly"
    │
    └── ✅ SELESAI — Scope sistem antrean & pendaftaran berakhir di sini
```

---

## 4. 🏗️ Arsitektur Sistem

### Tech Stack

| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| **Frontend Web** | Next.js 14 (React) + Tailwind CSS | SSR, performa tinggi, UI modern |
| **Backend API** | Laravel 11 (PHP) | Ecosystem matang, BPJS SDK tersedia |
| **Database** | PostgreSQL | Relational, robust, cocok untuk data medis |
| **Cache & Queue** | Redis + Laravel Queue | Antrean real-time, background jobs |
| **Real-time** | Laravel Reverb / Pusher (WebSocket) | Update antrean live di display |
| **Kiosk** | Electron.js / Web Fullscreen | Touchscreen kiosk |
| **BPJS** | PCare REST API + VClaim API | Bridging resmi BPJS Kesehatan |
| **Deployment** | Docker + VPS | Scalable & maintainable |

### Diagram Arsitektur

```
┌──────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                         │
│                                                            │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌────────────┐  │
│  │ Web App  │ │Kiosk App  │ │ Display  │ │  Mobile    │  │
│  │(Loket /  │ │(Ambil No  │ │(TV       │ │(Konfirmasi │  │
│  │ Admin)   │ │ Antrean)  │ │ Antrean) │ │ Antrean)   │  │
│  │Next.js   │ │Electron   │ │Next.js   │ │React Ntv   │  │
│  └────┬─────┘ └─────┬─────┘ └────┬─────┘ └─────┬──────┘  │
│       └─────────────┴────────────┴──────────────┘          │
│                          │                                  │
│                 ┌────────▼────────┐                         │
│                 │   REST API      │                         │
│                 │   Laravel 11    │                         │
│                 └────────┬────────┘                         │
├──────────────────────────┼─────────────────────────────────┤
│                     SERVER LAYER                            │
│                          │                                  │
│  ┌────────────┐  ┌──────▼──────┐                           │
│  │ WebSocket  │  │  Backend    │                           │
│  │ Server     │◄─┤  Laravel 11 │                           │
│  │ (Reverb)   │  │             │                           │
│  └────────────┘  └──────┬──────┘                           │
│                         │                                   │
│               ┌─────────┼─────────┐                        │
│               ▼         ▼         ▼                        │
│         ┌──────────┐ ┌──────┐ ┌────────────┐              │
│         │PostgreSQL│ │Redis │ │ BPJS API   │              │
│         │(Database)│ │(Queue│ │ - PCare    │              │
│         │          │ │Cache)│ │ - VClaim   │              │
│         └──────────┘ └──────┘ └────────────┘              │
└──────────────────────────────────────────────────────────┘
```

---

## 5. 📦 Modul-Modul Sistem

### Modul 1: Manajemen Antrean 🎫

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Ambil Antrean PRIORITAS (Kiosk) | Pasien prioritas → prefix "P" (P-001, P-002) + pilih alasan (lansia/bumil/disabilitas/balita) | 🔴 High |
| Ambil Antrean UMUM (Kiosk) | Pasien biasa → prefix sesuai poli: A=Poli Umum, B=Gigi, C=KIA, D=Imunisasi, E=UGD | 🔴 High |
| Pilih Jenis Pembayaran | BPJS / Umum — ditampilkan di tiket & data antrean | 🔴 High |
| Cetak Tiket Antrean | Thermal printer: nomor, tanggal, poli, jenis, estimasi waktu | 🔴 High |
| Display Antrean (TV) | Real-time per poli + suara panggilan TTS, prioritas ditandai ⭐ | 🔴 High |
| Panggil Antrean (Loket) | Petugas loket klik panggil → update display + bunyi + notifikasi | 🔴 High |
| Prioritas Pemanggilan | Nomor P-xxx selalu didahulukan, rasio bisa dikonfigurasi | 🔴 High |
| Booking Online (Web) | Pasien daftar antrean dari web sebelum datang | 🟡 Medium |
| Konfirmasi Kedatangan (Mobile) | Pasien booking online → konfirmasi saat sudah di puskesmas | 🟡 Medium |
| Skip / Lewati | Pasien tidak hadir → skip, bisa dipanggil ulang | 🟡 Medium |
| Notifikasi WhatsApp/Push | Alert saat nomor mendekati giliran | 🟡 Medium |
| Estimasi Waktu Tunggu | Hitung berdasarkan rata-rata waktu layanan x sisa antrean | 🟡 Medium |
| Riwayat Antrean | Rekap harian per poli, rata-rata waktu tunggu, jumlah skip | 🟢 Low |

### Modul 2: Pendaftaran / Loket 📋

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Registrasi Pasien Baru | Input: NIK, nama, TTL, gender, alamat, telepon, gol. darah, status nikah, pekerjaan, alergi | 🔴 High |
| Upload Dokumen | Upload fotokopi KTP, KK, Kartu BPJS, KIA (Kartu Identitas Anak) | 🔴 High |
| Generate No. Rekam Medis | Auto-generate nomor RM unik untuk pasien baru | 🔴 High |
| Cetak Kartu Kunjungan | Cetak kartu kunjungan baru untuk pasien baru | 🔴 High |
| Cari Pasien Lama | Search by No. RM / NIK / No. BPJS / Nama | 🔴 High |
| Verifikasi BPJS | Cek peserta aktif via PCare API (`GET /peserta/{noBpjs}`) | 🔴 High |
| Bridging Pendaftaran BPJS | Auto-create kunjungan di PCare (`POST /pendaftaran`) | 🔴 High |
| Pemberian Informasi Wajib | Checklist: hak & kewajiban pasien, info layanan, persetujuan umum | 🔴 High |
| Pilih Poli Tujuan | Dropdown poli + dokter yang praktek hari ini | 🔴 High |
| Antar RM ke Poli | Update status: RM sudah diantar → pasien menuju poli | 🔴 High |
| Update Data Pasien | Edit data pasien lama jika ada perubahan | 🟡 Medium |
| Riwayat Kunjungan | Tampilkan list kunjungan sebelumnya | 🟡 Medium |

### Modul 3: Integrasi BPJS 🏛️

| Fitur | API Endpoint | Deskripsi |
|-------|-------------|-----------|
| Cek Peserta by No. BPJS | `GET /peserta/{noBpjs}` | Lookup data peserta |
| Cek Peserta by NIK | `GET /peserta/nik/{nik}` | Lookup peserta by NIK |
| Cek Status Kepesertaan | Response field `aktif` | Aktif / Tidak Aktif |
| Daftar Kunjungan | `POST /pendaftaran` | Register kunjungan di PCare |
| Hapus Kunjungan | `DELETE /pendaftaran` | Batalkan jika salah daftar |

### Modul 4: Display & Notifikasi 📺

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Display TV Ruang Tunggu | Nomor antrean per poli, nomor sedang dilayani, sisa antrean | 🔴 High |
| Text-to-Speech (TTS) | Panggilan suara otomatis: "Nomor P-003, silakan ke loket 1" | 🔴 High |
| Penanda Prioritas | Nomor prioritas ditandai ⭐ di display | 🔴 High |
| Running Text | Info puskesmas, pengumuman, tips kesehatan | 🟢 Low |
| Notifikasi WA | Kirim WA saat nomor mendekati giliran | 🟡 Medium |
| Push Notification | Untuk pasien yang pakai mobile app | 🟡 Medium |

### Modul 5: Dashboard & Laporan 📊

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Dashboard Realtime | Total pasien hari ini, antrean per poli, yang sedang dilayani, sisa | 🔴 High |
| Statistik Harian | Jumlah pasien per kategori (prioritas/umum), per poli, per jenis bayar (BPJS/umum) | 🟡 Medium |
| Rata-rata Waktu Tunggu | Per poli, per hari | 🟡 Medium |
| Laporan Pendaftaran | Harian/bulanan: pasien baru vs lama, BPJS vs umum | 🟡 Medium |
| Laporan BPJS | Rekap bridging sukses/gagal, jumlah peserta per hari | 🟡 Medium |
| Export | PDF, Excel | 🟡 Medium |

### Modul 6: Master Data & Administrasi ⚙️

| Fitur | Deskripsi |
|-------|-----------|
| Manajemen User & Role | Admin, Petugas Loket |
| Master Poliklinik | CRUD poli + kode BPJS + queue prefix + kuota harian |
| Master Dokter | CRUD dokter + kode BPJS + assign poli |
| Jadwal Praktek | Jadwal dokter per poli per hari |
| Konfigurasi Antrean | Rasio prioritas:umum, reset harian, jam operasional |
| Konfigurasi BPJS | Consumer ID, Consumer Secret, kode provider |
| Konfigurasi Printer | Setting thermal printer untuk kiosk |
| Audit Log | Semua aktivitas tercatat |

---

## 6. 🗃️ Desain Database (Core Schema)

### ERD Overview

```
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│  users   │     │ patients │     │polyclinics│     │ doctors  │
│          │     │          │     │           │     │          │
│ id       │     │ id       │     │ id        │     │ id       │
│ name     │     │ nik      │     │ name      │     │ user_id  │
│ role     │     │ bpjs_no  │     │ bpjs_code │     │ poly_id  │
└────┬─────┘     │ med_rec  │     │ queue_pfx │     └────┬─────┘
     │           └────┬─────┘     └─────┬─────┘          │
     │                │                 │                 │
     │           ┌────▼─────────────────▼─────────────────▼──┐
     │           │               queues                       │
     │           │                                            │
     │           │ queue_number, queue_category (prioritas/   │
     │           │ umum), status, payment_type, source        │
     │           └────────────────┬───────────────────────────┘
     │                            │
     │           ┌────────────────▼───────────────────────────┐
     │           │          registrations                      │
     │           │                                             │
     │           │ patient_type (baru/lama), bpjs_verified,   │
     │           │ bpjs_visit_id, poly_assigned, rm_status,   │
     │           │ info_consent, rm_delivered                  │
     │           └────────────────┬───────────────────────────┘
     │                            │
     │      ┌─────────────────────┼──────────────────────┐
     │      ▼                     ▼                      ▼
     │ ┌──────────┐  ┌────────────────────┐  ┌──────────────┐
     │ │visit_    │  │mandatory_info_     │  │patient_      │
     │ │cards     │  │consents            │  │documents     │
     │ └──────────┘  └────────────────────┘  └──────────────┘
     │
     │ ┌──────────────────┐  ┌────────────────┐
     └►│ bpjs_logs        │  │ audit_logs     │
       └──────────────────┘  └────────────────┘
```

### SQL Schema

```sql
-- =============================================
-- DATABASE SCHEMA v3.0
-- Sistem Antrean + Pendaftaran Loket
-- PKM Gladak Pakem Jember
-- =============================================

-- =============================================
-- 1. USERS & AUTHENTICATION
-- =============================================
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(50) UNIQUE NOT NULL,
    email           VARCHAR(100) UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL,
    -- role: admin, receptionist (petugas loket)
    phone           VARCHAR(20),
    is_active       BOOLEAN DEFAULT TRUE,
    last_login      TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 2. PASIEN
-- =============================================
CREATE TABLE patients (
    id              BIGSERIAL PRIMARY KEY,
    medical_record  VARCHAR(20) UNIQUE NOT NULL,
    nik             VARCHAR(16) UNIQUE,
    bpjs_number     VARCHAR(20),
    name            VARCHAR(255) NOT NULL,
    birth_date      DATE,
    birth_place     VARCHAR(100),
    gender          VARCHAR(1),             -- L / P
    address         TEXT,
    rt_rw           VARCHAR(10),
    kelurahan       VARCHAR(100),
    kecamatan       VARCHAR(100),
    kabupaten       VARCHAR(100),
    phone           VARCHAR(20),
    blood_type      VARCHAR(3),
    marital_status  VARCHAR(20),
    occupation      VARCHAR(100),
    allergy         TEXT,
    is_bpjs_active  BOOLEAN DEFAULT FALSE,
    bpjs_class      VARCHAR(5),
    bpjs_provider   VARCHAR(100),
    bpjs_type       VARCHAR(50),            -- PBI, Non-PBI, dll
    patient_type    VARCHAR(10) DEFAULT 'umum',  -- umum, bpjs
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_patients_bpjs ON patients(bpjs_number);
CREATE INDEX idx_patients_nik ON patients(nik);
CREATE INDEX idx_patients_name ON patients(name);
CREATE INDEX idx_patients_mr ON patients(medical_record);

-- =============================================
-- 3. DOKUMEN PASIEN
-- (KTP, KK, BPJS, KIA sesuai Bagan Alur)
-- =============================================
CREATE TABLE patient_documents (
    id              BIGSERIAL PRIMARY KEY,
    patient_id      BIGINT REFERENCES patients(id) ON DELETE CASCADE,
    document_type   VARCHAR(20) NOT NULL,
    -- document_type: ktp, kk, bpjs_card, kia
    file_path       VARCHAR(255) NOT NULL,
    file_name       VARCHAR(255),
    file_size       INTEGER,
    uploaded_by     BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_patient_docs ON patient_documents(patient_id);

-- =============================================
-- 4. KARTU KUNJUNGAN
-- (Pasien Lama serahkan kartu ini)
-- =============================================
CREATE TABLE visit_cards (
    id              BIGSERIAL PRIMARY KEY,
    patient_id      BIGINT REFERENCES patients(id),
    card_number     VARCHAR(20) UNIQUE NOT NULL,
    issued_date     DATE DEFAULT CURRENT_DATE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 5. POLIKLINIK
-- =============================================
CREATE TABLE polyclinics (
    id              BIGSERIAL PRIMARY KEY,
    code            VARCHAR(10) UNIQUE NOT NULL,
    name            VARCHAR(100) NOT NULL,
    bpjs_poly_code  VARCHAR(10),
    room            VARCHAR(50),
    queue_prefix    VARCHAR(5) NOT NULL,     -- A, B, C, D, E
    quota_per_day   INTEGER DEFAULT 30,
    is_active       BOOLEAN DEFAULT TRUE,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 6. DOKTER
-- =============================================
CREATE TABLE doctors (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT REFERENCES users(id) ON DELETE SET NULL,
    name             VARCHAR(255) NOT NULL,
    nip              VARCHAR(30),
    sip_number       VARCHAR(50),
    specialization   VARCHAR(100),
    poly_id          BIGINT REFERENCES polyclinics(id),
    bpjs_doctor_code VARCHAR(20),
    is_active        BOOLEAN DEFAULT TRUE,
    created_at       TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 7. JADWAL DOKTER
-- =============================================
CREATE TABLE doctor_schedules (
    id              BIGSERIAL PRIMARY KEY,
    doctor_id       BIGINT REFERENCES doctors(id),
    poly_id         BIGINT REFERENCES polyclinics(id),
    day_of_week     INTEGER NOT NULL,        -- 1=Senin … 7=Minggu
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    max_patient     INTEGER DEFAULT 30,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 8. ANTREAN
-- (Inti sistem — Prioritas & Umum)
-- =============================================
CREATE TABLE queues (
    id              BIGSERIAL PRIMARY KEY,
    queue_number    VARCHAR(10) NOT NULL,     -- P-001, A-001, B-001
    queue_prefix    VARCHAR(5) NOT NULL,      -- P, A, B, C, D, E
    queue_category  VARCHAR(20) NOT NULL,     -- prioritas, umum
    priority_reason VARCHAR(50),
    -- priority_reason: lansia, bumil, disabilitas, balita
    patient_id      BIGINT REFERENCES patients(id),
    -- NULL jika belum didaftarkan (baru ambil nomor)
    poly_id         BIGINT REFERENCES polyclinics(id),
    doctor_id       BIGINT REFERENCES doctors(id),
    queue_date      DATE NOT NULL DEFAULT CURRENT_DATE,
    source          VARCHAR(20) NOT NULL,     -- kiosk, web, mobile
    status          VARCHAR(20) DEFAULT 'waiting',
    -- status: waiting, confirmed, called,
    --         serving, registered, directed_to_poly,
    --         done, skipped, cancelled
    payment_type    VARCHAR(10),              -- bpjs, umum
    counter_number  INTEGER,                  -- Nomor loket
    estimated_time  TIMESTAMP,
    called_at       TIMESTAMP,
    served_at       TIMESTAMP,
    completed_at    TIMESTAMP,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_queues_date ON queues(queue_date);
CREATE INDEX idx_queues_status ON queues(status);
CREATE INDEX idx_queues_category ON queues(queue_category, queue_date);
CREATE INDEX idx_queues_poly ON queues(poly_id, queue_date);

-- =============================================
-- 9. PENDAFTARAN (REGISTRASI LOKET)
-- (Proses setelah antrean dipanggil)
-- =============================================
CREATE TABLE registrations (
    id                  BIGSERIAL PRIMARY KEY,
    registration_number VARCHAR(30) UNIQUE NOT NULL,
    -- REG-20260226-0001
    queue_id            BIGINT REFERENCES queues(id),
    patient_id          BIGINT REFERENCES patients(id) NOT NULL,
    registration_date   DATE DEFAULT CURRENT_DATE,
    registration_time   TIME DEFAULT CURRENT_TIME,
    patient_type        VARCHAR(10) NOT NULL,     -- baru, lama
    payment_type        VARCHAR(10) NOT NULL,     -- bpjs, umum

    -- BPJS Verification
    bpjs_verified       BOOLEAN DEFAULT FALSE,
    bpjs_verification_time TIMESTAMP,
    bpjs_status         VARCHAR(20),
    -- bpjs_status: aktif, tidak_aktif, not_checked

    -- BPJS Bridging
    bpjs_bridged        BOOLEAN DEFAULT FALSE,
    bpjs_visit_id       VARCHAR(50),
    -- ID kunjungan dari PCare
    bpjs_bridge_time    TIMESTAMP,

    -- Rekam Medis
    rm_status           VARCHAR(20) DEFAULT 'pending',
    -- rm_status: pending, created, retrieved, delivered
    rm_delivered_at     TIMESTAMP,

    -- Info Wajib
    info_consent_completed BOOLEAN DEFAULT FALSE,

    -- Poli Tujuan
    poly_id             BIGINT REFERENCES polyclinics(id),
    doctor_id           BIGINT REFERENCES doctors(id),

    -- Status
    status              VARCHAR(20) DEFAULT 'processing',
    -- status: processing, completed, cancelled
    registered_by       BIGINT REFERENCES users(id),
    completed_at        TIMESTAMP,
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reg_date ON registrations(registration_date);
CREATE INDEX idx_reg_patient ON registrations(patient_id);
CREATE INDEX idx_reg_queue ON registrations(queue_id);

-- =============================================
-- 10. INFORMASI WAJIB (Checklist)
-- (Pemberian Informasi Wajib sesuai Bagan)
-- =============================================
CREATE TABLE mandatory_info_consents (
    id                    BIGSERIAL PRIMARY KEY,
    registration_id       BIGINT REFERENCES registrations(id) ON DELETE CASCADE,
    patient_id            BIGINT REFERENCES patients(id),
    rights_informed       BOOLEAN DEFAULT FALSE,
    -- Hak pasien disampaikan
    obligations_informed  BOOLEAN DEFAULT FALSE,
    -- Kewajiban pasien disampaikan
    service_info_given    BOOLEAN DEFAULT FALSE,
    -- Info pelayanan diberikan
    general_consent       BOOLEAN DEFAULT FALSE,
    -- Persetujuan umum ditandatangani
    consent_signature_file VARCHAR(255),
    -- File tanda tangan digital (opsional)
    informed_by           BIGINT REFERENCES users(id),
    informed_at           TIMESTAMP DEFAULT NOW(),
    created_at            TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 11. BPJS LOG (Audit Bridging)
-- =============================================
CREATE TABLE bpjs_logs (
    id              BIGSERIAL PRIMARY KEY,
    patient_id      BIGINT REFERENCES patients(id),
    registration_id BIGINT REFERENCES registrations(id),
    action_type     VARCHAR(50) NOT NULL,
    -- action_type: check_peserta, check_peserta_nik,
    --             pendaftaran, delete_pendaftaran
    api_endpoint    VARCHAR(255),
    http_method     VARCHAR(10),
    request_body    JSONB,
    response_body   JSONB,
    status_code     INTEGER,
    is_success      BOOLEAN DEFAULT FALSE,
    error_message   TEXT,
    user_id         BIGINT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bpjs_logs_patient ON bpjs_logs(patient_id);
CREATE INDEX idx_bpjs_logs_date ON bpjs_logs(created_at);

-- =============================================
-- 12. KONFIGURASI ANTREAN
-- =============================================
CREATE TABLE queue_configs (
    id              BIGSERIAL PRIMARY KEY,
    config_key      VARCHAR(50) UNIQUE NOT NULL,
    config_value    VARCHAR(255) NOT NULL,
    description     TEXT,
    updated_by      BIGINT REFERENCES users(id),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Default configs:
-- priority_ratio        = '2:1'   (2 prioritas : 1 umum)
-- reset_time            = '06:00' (reset antrean jam 6 pagi)
-- operating_start       = '07:30'
-- operating_end         = '14:00'
-- avg_service_minutes   = '5'     (estimasi per pasien di loket)
-- tts_enabled           = 'true'
-- wa_notification       = 'true'
-- wa_notify_before      = '3'     (notif saat 3 nomor lagi)

-- =============================================
-- 13. KONFIGURASI BPJS
-- =============================================
CREATE TABLE bpjs_configs (
    id              BIGSERIAL PRIMARY KEY,
    config_key      VARCHAR(50) UNIQUE NOT NULL,
    config_value    TEXT NOT NULL,
    is_encrypted    BOOLEAN DEFAULT FALSE,
    updated_by      BIGINT REFERENCES users(id),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Default configs:
-- consumer_id       = '...'
-- consumer_secret   = '...' (encrypted)
-- provider_code     = '0901R001'
-- provider_name     = 'PUSKESMAS GLADAK PAKEM'
-- base_url          = 'https://apijkn.bpjs-kesehatan.go.id/pcare-rest'
-- user_key          = '...' (encrypted)

-- =============================================
-- 14. AUDIT LOG
-- =============================================
CREATE TABLE audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES users(id),
    action          VARCHAR(50) NOT NULL,
    -- action: create, update, delete, login, logout,
    --         call_queue, skip_queue, register_patient,
    --         verify_bpjs, bridge_bpjs
    table_name      VARCHAR(100),
    record_id       BIGINT,
    old_values      JSONB,
    new_values      JSONB,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);

-- =============================================
-- 15. NOTIFIKASI
-- =============================================
CREATE TABLE notifications (
    id              BIGSERIAL PRIMARY KEY,
    queue_id        BIGINT REFERENCES queues(id),
    patient_id      BIGINT REFERENCES patients(id),
    type            VARCHAR(50) NOT NULL,
    -- type: queue_approaching, queue_called, queue_skipped
    title           VARCHAR(255),
    message         TEXT,
    channel         VARCHAR(20),     -- web, whatsapp, push
    phone_number    VARCHAR(20),
    is_sent         BOOLEAN DEFAULT FALSE,
    is_read         BOOLEAN DEFAULT FALSE,
    sent_at         TIMESTAMP,
    read_at         TIMESTAMP,
    error_message   TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);
```

---

## 7. 🔗 Integrasi BPJS — API Flow

### Arsitektur Bridging

```
┌────────────────────────────────────────────────────────────┐
│                BPJS BRIDGING (Scope: Pendaftaran)           │
│                                                              │
│  ┌─────────────────┐                ┌────────────────────┐  │
│  │  SI Antrean      │  HTTPS + Auth  │   BPJS SERVER      │  │
│  │  PKM Gladak Pakem│◄──────────────►│                    │  │
│  │                  │  Consumer ID + │  ┌──────────────┐  │  │
│  │  ┌────────────┐  │  Secret +      │  │  PCare API   │  │  │
│  │  │BPJS Service│  │  HMAC-SHA256 + │  │  (FKTP)      │  │  │
│  │  │Layer       │  │  Timestamp     │  └──────────────┘  │  │
│  │  └────────────┘  │               │                    │  │
│  │  ┌────────────┐  │               │  Endpoint yg       │  │
│  │  │Encryption  │  │               │  digunakan:        │  │
│  │  │AES-256-CBC │  │               │  - GET /peserta    │  │
│  │  │+ LZ-String │  │               │  - POST /pendaftrn │  │
│  │  └────────────┘  │               │  - DELETE /pendaftrn│ │
│  └─────────────────┘                └────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Flow A — Cek Peserta BPJS

```
[Petugas Loket] Input No. BPJS / NIK
        │
        ▼
[System] GET /peserta/{noBpjs}/tglSEP/{tglSEP}
        │
        ▼
[PCare] Response:
        {
            "noKartu"        : "0001234567890",
            "nama"           : "BUDI SANTOSO",
            "hubunganKeluarga": "Peserta",
            "sex"            : "L",
            "tglLahir"       : "1990-01-15",
            "tglMulaiAktif"  : "2014-01-01",
            "tglAkhirBerlaku": "2099-12-31",
            "kdProviderPst"  : {
                "kdProvider"  : "0901R001",
                "nmProvider"  : "PUSKESMAS GLADAK PAKEM"
            },
            "jnsKelas"       : { "nama": "Kelas III" },
            "jnsPeserta"     : { "nama": "PBI" },
            "aktif"          : true
        }
        │
        ▼
[System] ✅ Aktif → Tampilkan data + enable tombol "Daftarkan ke BPJS"
         ❌ Tidak aktif → Warning + arahkan bayar umum
```

### Flow B — Bridging Pendaftaran

```
[Petugas Loket] Klik "Daftarkan ke BPJS"
        │
        ▼
[System] POST /pendaftaran
        {
            "kdProviderPeserta": "0901R001",
            "tglDaftar"   : "26-02-2026",
            "noKartu"     : "0001234567890",
            "kdPoli"      : "001",
            "keluhan"     : "Demam",
            "kunjSakit"   : true,
            "sistole"     : 0,
            "diastole"    : 0,
            "beratBadan"  : 0,
            "tinggiBadan" : 0,
            "respRate"    : 0,
            "heartRate"   : 0,
            "lingkarPerut": 0,
            "kdTkp"       : "10",
            "kdSadar"     : "01"
        }
        │
        ▼
[PCare] Response: { "noUrut": "001" }
        │
        ▼
[System] Simpan bpjs_visit_id di registrations
         Status: bpjs_bridged = true ✅
```

### Flow C — Batalkan Pendaftaran (Jika Salah)

```
[Petugas Loket] Klik "Batalkan Pendaftaran BPJS"
        │
        ▼
[System] DELETE /pendaftaran/{noKunjungan}
        │
        ▼
[PCare] Response: { "message": "OK" }
```

---

## 8. 🖥️ Wireframe Halaman Utama

### 8.1 Kiosk Touchscreen — Ambil Nomor Antrean

```
┌────────────────────────────────────────┐
│                                        │
│   🏥 SELAMAT DATANG                    │
│   di Puskesmas Gladak Pakem            │
│   "Melayani Sepenuh Hati"              │
│                                        │
│   ═══════════════════════════════      │
│   STEP 1: Pilih Kategori Pasien       │
│                                        │
│   ┌────────────────┐ ┌──────────────┐  │
│   │ ⭐ PRIORITAS   │ │  👤 UMUM     │  │
│   │                │ │              │  │
│   │  Lansia ≥60th  │ │  Pasien      │  │
│   │  Ibu Hamil     │ │  Biasa       │  │
│   │  Disabilitas   │ │              │  │
│   │  Balita        │ │              │  │
│   └────────────────┘ └──────────────┘  │
│                                        │
│   ═══════════════════════════════      │
│   STEP 2: Pilih Jenis Pembayaran      │
│                                        │
│   ┌────────────────┐ ┌──────────────┐  │
│   │   🟢 BPJS     │ │  🔵 UMUM     │  │
│   │   (Peserta    │ │  (Bayar      │  │
│   │    JKN)       │ │   Sendiri)   │  │
│   └────────────────┘ └──────────────┘  │
│                                        │
│   ═══════════════════════════════      │
│   STEP 3: Pilih Poli Tujuan           │
│                                        │
│   ┌──────────┐ ┌──────────┐           │
│   │ 🩺 Poli  │ │ 🦷 Poli  │           │
│   │   Umum   │ │   Gigi   │           │
│   │ Sisa: 15 │ │ Sisa: 8  │           │
│   └──────────┘ └──────────┘           │
│   ┌──────────┐ ┌──────────┐           │
│   │ 🤰 Poli  │ │ 💉 Poli  │           │
│   │  KIA/KB  │ │ Imunisasi│           │
│   │ Sisa: 5  │ │ Sisa: 10 │           │
│   └──────────┘ └──────────┘           │
│                                        │
│   ┌────────────────────────────────┐   │
│   │     🎫 AMBIL NOMOR ANTREAN     │   │
│   └────────────────────────────────┘   │
│                                        │
│   📞 Bantuan: (0331) 337772            │
└────────────────────────────────────────┘


Setelah klik "AMBIL NOMOR ANTREAN":

┌────────────────────────────────────────┐
│                                        │
│   🎫 NOMOR ANTREAN ANDA               │
│                                        │
│   ┌────────────────────────────────┐   │
│   │                                │   │
│   │      ⭐ P - 003               │   │
│   │      PRIORITAS                 │   │
│   │                                │   │
│   │  Poli    : Poli Umum          │   │
│   │  Bayar   : BPJS               │   │
│   │  Tanggal : 26/02/2026         │   │
│   │  Jam     : 07:45              │   │
│   │  Estimasi: ± 15 menit         │   │
│   │                                │   │
│   │  Sisa antrean sebelum Anda: 2 │   │
│   │                                │   │
│   └────────────────────────────────┘   │
│                                        │
│   Silakan tunggu di ruang tunggu       │
│   dan perhatikan display antrean.      │
│                                        │
│   🖨️ Mencetak tiket...                │
│                                        │
│   [🔄 Ambil Nomor Lagi]               │
└────────────────────────────────────────┘
```

### 8.2 Display Antrean — TV/Monitor Ruang Tunggu

```
┌────────────────────────────────────────────────────────────────────┐
│  🏥 PUSKESMAS GLADAK PAKEM              📅 Kamis, 26 Februari 2026│
│  "Melayani Sepenuh Hati"                            ⏰ 08:15 WIB  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│              LOKET PENDAFTARAN                                     │
│                                                                    │
│    ┌────────────────────────────────────────────────────────┐      │
│    │          SEDANG DIPANGGIL                              │      │
│    │                                                        │      │
│    │     Loket 1              Loket 2                       │      │
│    │     ┌──────────┐         ┌──────────┐                  │      │
│    │     │ ⭐P-003  │         │  A-010   │                  │      │
│    │     │ PRIORITAS│         │  UMUM    │                  │      │
│    │     └──────────┘         └──────────┘                  │      │
│    └────────────────────────────────────────────────────────┘      │
│                                                                    │
│    ANTREAN PRIORITAS ⭐         ANTREAN UMUM 👤                    │
│    ┌───────────────────┐        ┌───────────────────┐              │
│    │ Selanjutnya:      │        │ Selanjutnya:      │              │
│    │ P-004  (Bumil)    ��        │ A-011  Poli Umum  │              │
│    │ P-005  (Lansia)   │        │ A-012  Poli Umum  │              │
│    │ P-006  (Disabilit)│        │ B-004  Poli Gigi  │              │
│    │                   │        │ C-003  Poli KIA   │              │
│    │ Sisa: 4           │        │ Sisa: 28          │              │
│    └───────────────────┘        └───────────────────┘              │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│  📢 Nomor P-003 silakan menuju LOKET 1                             │
├────────────────────────────────────────────────────────────────────┤
│  👥 Total Hari Ini: 45  │  ✅ Terdaftar: 12  │  ⏳ Menunggu: 33  │
└────────────────────────────────────────────────────────────────────┘
```

### 8.3 Halaman Loket — Pendaftaran (Web)

```
┌────────────────────────────────────────────────────────────────────┐
│  ☰  Loket Pendaftaran                    👤 Siti (Loket 1)  🔔 ⚙️ │
├────────────┬───────────────────────────────────────────────────────┤
│ ANTREAN    │                                                       │
│ LOKET      │  ┌────────────────────────────────────────────────┐   │
│            │  │  Sedang Melayani: ⭐ P-003 (Prioritas - Bumil) │   │
│ ⭐Prioritas│  │  [📢 Panggil Berikutnya]  [⏭️ Skip]            │   │
│ ┌────────┐ │  └────────────────────────────────────────────────┘   │
│ │▶⭐P-003│ │                                                       │
│ │ serving│ │  ═════════════���═════════════════════════════════      │
│ └────────┘ │  Tab: [ 🆕 Pasien Baru ]  [ 🔄 Pasien Lama ]        │
│ ┌────────┐ │  ═══════════════════════════════════════════════      │
│ │ P-004  │ │                                                       │
│ │ Bumil  │ │  CARI PASIEN                                          │
│ │ waiting│ │  ┌──────────────────────────────────────────────┐     │
│ └────────┘ │  │ No. RM: [         ] NIK: [                ] │     │
│ ┌────────┐ │  │ BPJS : [         ] Nama: [                ] │     │
│ │ P-005  │ │  │                              [🔍 Cari]      │     │
│ │ Lansia │ │  └──────────────────────────────────────────────┘     │
│ │ waiting│ │                                                       │
│ └────────┘ │  VERIFIKASI BPJS                                      │
│            │  ┌──────────────────────────────────────────────┐     │
│ 👤 Umum   │  │ No. BPJS: [0001234567890   ]  [🏛️ Cek BPJS] │     │
│ ┌────────┐ │  │                                              │     │
│ │ A-010  │ │  │ ┌──────────────────────────────────────────┐ │     │
│ │ P.Umum │ │  │ │ ✅ PESERTA AKTIF                        │ │     │
│ │ waiting│ │  │ │ Nama   : Sari Wulandari                 │ │     │
│ └────────┘ │  │ │ Kelas  : III                             │ │     │
│ ┌────────┐ │  │ │ Jenis  : PBI                             │ │     │
│ │ A-011  │ │  │ │ FKTP   : PKM Gladak Pakem               │ │     │
│ │ P.Umum │ │  │ │ Berlaku: s.d. 31/12/2099                │ │     │
│ │ waiting│ │  │ └──────────────────────────────────────────┘ │     │
│ └────────┘ │  └──────────────────────────────────────────────┘     │
│ ┌────────┐ │                                                       │
│ │ B-004  │ │  DATA PASIEN                                          │
│ │ P.Gigi │ │  ┌──────────────────────────────────────────────┐     │
│ │ waiting│ │  │ No. RM    : [auto-generate              ]   │     │
│ └────────┘ │  │ NIK       : [3509xxxxxxxxxxxx           ]   │     │
│ ┌────────┐ │  │ Nama      : [Sari Wulandari             ]   │     │
│ │ C-003  │ │  │ Tmp Lahir : [Jember     ] Tgl: [15/03/95]   │     │
│ │ P.KIA  │ │  │ Gender    : (○) L  (●) P                    │     │
│ │ waiting│ │  │ Alamat    : [Jl. Mastrip No. 10          ]   │     │
│ └────────┘ │  │ RT/RW     : [003/007  ]                     │     │
│            │  │ Kelurahan : [Kranjingan ]                    │     │
│            │  │ Kecamatan : [Sumbersari ]                    │     │
│            │  │ Kabupaten : [Jember     ]                    │     │
│            │  │ Telepon   : [0812xxxxxxxx]                   │     │
│            │  │ Gol.Darah : [O  ] Status: [Menikah      ]   │     │
│            │  │ Pekerjaan : [IRT ]  Alergi: [Tidak ada   ]   │     │
│            │  └──────────────────────────────────────────────┘     │
│            │                                                       │
│            │  UPLOAD DOKUMEN                                       │
│            │  ┌──────────────────────────────────────────────┐     │
│            │  │ [📎 KTP ✅] [📎 KK ✅] [📎 BPJS ✅] [📎 KIA]│     │
│            │  └──────────────────────────────────────────────┘     │
│            │                                                       │
│            │  INFORMASI WAJIB                                      │
│            │  ┌──────────────────────────────────────────────┐     │
│            │  │ [☑] Hak pasien disampaikan                   │     │
│            │  │ [☑] Kewajiban pasien disampaikan              │     │
│            │  │ [☑] Info pelayanan diberikan                  │     │
│            │  │ [☑] Persetujuan umum ditandatangani           │     │
│            │  └──────────────────────────────────────────────┘     │
│            │                                                       │
│            │  POLI TUJUAN                                          │
│            │  Poli  : [▼ Poli Umum        ]                        │
│            │  Dokter: [▼ dr. Ahmad         ]                       │
│            │                                                       │
│            │  ┌──────────────────┐  ┌───────────────────────┐      │
│            │  │ 💾 Simpan &      │  │ 🏛️ Bridge BPJS &     │      │
│            │  │    Daftarkan     │  │    Simpan             │      │
│            │  └──────────────────┘  └───────────────────────┘      │
│            │                                                       │
│            │  ┌─────────────────────────────────────────────┐      │
│            │  │ 📋 Antar RM ke Poli → Selesai ✅             │      │
│            │  └─────────────────────────────────────────────┘      │
└────────────┴───────────────────────────────────────────────────────┘
```

### 8.4 Dashboard Admin

```
┌────────────────────────────────────────────────────────────────────┐
│  ☰  Dashboard SI Antrean                 👤 Admin   │  🔔  │  ⚙️  │
├────────────┬───────────────────────────────────────────────────────┤
│            │                                                       │
│ 📊 Dashboard│  Dashboard — 26 Februari 2026                       │
│ 🎫 Antrean │                                                      │
│ 📋 Loket   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│ 🏛️ BPJS   │  │ 👥  92   │ │ ✅  51   │ │ ⏳  41   │ │ ⭐ 12  │ │
│ 📈 Laporan │  │ Total    │ │ Terdaftar│ │ Menunggu │ │Prioritas│
│ ⚙️ Master  │  │ Pasien   │ │          │ │          │ │        │ │
│ 👥 Users   │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│            │                                                       │
│            │  ┌──────────────────────┐ ┌─────────────────────┐   │
│            │  │ Antrean Per Poli     │ │ Pasien Hari Ini     │   │
│            │  │                      │ │                     │   │
│            │  │ Poli Umum    ████ 40 │ │ Baru  : 15 (16%)   │   │
│            │  │ Poli Gigi    ██   18 │ │ Lama  : 77 (84%)   │   │
│            │  │ Poli KIA     ██   14 │ │                     │   │
│            │  │ Poli Imunisasi █  10 │ │ BPJS  : 68 (74%)   │   │
│            │  │ UGD          █    5  │ │ Umum  : 24 (26%)   │   │
│            │  │ Prioritas    ██   12 │ │                     │   │
│            │  └──────────────────────┘ └─────────────────────┘   │
│            │                                                       │
│            │  ┌──────────────────────┐ ┌─────────────────────┐   │
│            │  │ Waktu Tunggu Rata²   │ │ Status BPJS Bridge  │   │
│            │  │                      │ │                     │   │
│            │  │ Poli Umum   : 12 mnt │ │ ✅ Sukses   : 65   │   │
│            │  │ Poli Gigi   : 18 mnt │ │ ❌ Gagal    :  3   │   │
│            │  │ Poli KIA    :  8 mnt │ │ ⏳ Pending  :  0   │   │
│            │  │ Rata-rata   : 13 mnt │ │                     │   │
│            │  └──────────────────────┘ └─────────────────────┘   │
└────────────┴───────────────────────────────────────────────────────┘
```

---

## 9. 📅 Timeline & Milestone Pengembangan

### Gantt Chart

```
Minggu →    1    2    3    4    5    6    7    8
            │    │    │    │    │    │    │    │
Fase 1:     ██████████
Setup &     │ Setup project (Next.js + Laravel + PostgreSQL)
Core        │ Auth (login, role), DB migration (15 tabel)
            │ Master data (poli, dokter, jadwal), seeding

Fase 2:               ██████████
Antrean               │ Kiosk UI (prioritas/umum, pilih poli, cetak tiket)
                      │ Display TV (realtime WebSocket, TTS panggilan)
                      │ Panggil/skip, estimasi waktu, konfigurasi

Fase 3:                         ██████████
Loket +                         │ Form pendaftaran (baru/lama)
BPJS                            │ Upload dokumen (KTP/KK/BPJS/KIA)
                                │ Cek BPJS + bridging pendaftaran PCare
                                │ Info wajib, RM, antar ke poli

Fase 4:                                   ██████████
Dashboard                                 │ Dashboard realtime
+ Testing                                 │ Laporan, export PDF/Excel
                                          │ Notifikasi WA, booking web
                                          │ UAT, bug fix, deploy, training
```

### Detail Per Fase

| Fase | Minggu | Durasi | Deliverable |
|------|--------|--------|-------------|
| **Fase 1: Setup & Core** | 1–2 | 2 minggu | Project setup (Next.js + Laravel + Docker), authentication (JWT, RBAC), DB migration 15 tabel, CRUD master data (poli, dokter, jadwal), seeding, konfigurasi BPJS |
| **Fase 2: Antrean** | 3–4 | 2 minggu | Kiosk UI (kategori prioritas/umum, pilih poli, cetak tiket), display TV antrean (WebSocket realtime, TTS panggilan), panggil/skip antrean, konfigurasi rasio prioritas, estimasi waktu tunggu |
| **Fase 3: Loket + BPJS** | 5–6 | 2 minggu | Form pendaftaran pasien baru & lama, upload dokumen (KTP/KK/BPJS/KIA), pencarian pasien (RM/NIK/BPJS/nama), verifikasi BPJS (PCare API), bridging pendaftaran, checklist info wajib, status RM, antar ke poli |
| **Fase 4: Dashboard + Deploy** | 7–8 | 2 minggu | Dashboard realtime, laporan (harian/bulanan, BPJS, waktu tunggu), export PDF/Excel, notifikasi WA/push, booking web, UAT, bug fix, deploy production, training petugas |

**Total Estimasi: ± 8 minggu (2 bulan)**

---

## 10. 🔒 Keamanan & Compliance

### Standar Keamanan

| Aspek | Implementasi |
|-------|-------------|
| **Enkripsi Data** | AES-256 at-rest, TLS 1.3 in-transit |
| **Authentication** | JWT Token + Refresh Token, session timeout 30 menit |
| **Authorization** | RBAC: Admin & Petugas Loket |
| **Password Policy** | Min 8 karakter, huruf + angka + simbol |
| **Audit Trail** | Semua aktivitas tercatat (user, timestamp, IP, action) |
| **BPJS API Security** | Consumer ID + Secret + HMAC-SHA256 + Timestamp |
| **BPJS Encryption** | Response decrypt AES-256-CBC + decompress LZ-String |
| **Backup** | Automated daily backup |
| **Input Validation** | Server-side validation + sanitization |

### Compliance

| Regulasi | Keterangan |
|----------|------------|
| **PMK No. 24/2022** | Standar Rekam Medis Elektronik |
| **UU No. 27/2022** | Perlindungan Data Pribadi |
| **Standar BPJS** | API resmi BPJS Kesehatan |

### Role-Based Access

| Modul | Admin | Petugas Loket |
|-------|:-----:|:------------:|
| Dashboard | ✅ Full | ✅ View |
| Manajemen Antrean | ✅ Full | ✅ Panggil/Skip |
| Pendaftaran Pasien | ✅ Full | ✅ Full |
| Verifikasi BPJS | ✅ Full | ✅ Full |
| Bridging BPJS | ✅ Full | ✅ Full |
| Laporan | ✅ Full | ✅ View |
| Master Data | ✅ Full | ❌ |
| User Management | ✅ Full | ❌ |
| Konfigurasi Sistem | ✅ Full | ❌ |
| Audit Log | ✅ Full | ❌ |

---

## 11. 💰 Estimasi Resource & Biaya

### Tim Pengembangan

| Role | Jumlah | Durasi |
|------|--------|--------|
| Full-stack Developer | 1–2 orang | 2 bulan |
| UI/UX Designer | 1 orang | 2 minggu |
| QA Tester | 1 orang | 2 minggu |

### Infrastruktur (Bulanan)

| Item | Estimasi |
|------|----------|
| VPS / Cloud (2 vCPU, 4 GB RAM) | Rp 300.000 – 800.000/bulan |
| Domain | Rp 100.000 – 200.000/tahun |
| SSL | Rp 0 (Let's Encrypt) |
| WhatsApp API (notifikasi) | Rp 200.000 – 500.000/bulan |

### Hardware (One-time)

| Item | Estimasi |
|------|----------|
| Kiosk Touchscreen + mini PC + thermal printer | Rp 5.000.000 – 15.000.000/unit |
| TV Display Antrean (43–55") | Rp 3.000.000 – 5.000.000/unit |
| Thermal Printer tiket 80mm (cadangan) | Rp 500.000 – 1.500.000/unit |

### Ringkasan Total

| Kategori | Estimasi |
|----------|----------|
| Pengembangan Software | Rp 15.000.000 – 50.000.000 |
| Infrastruktur (tahun pertama) | Rp 8.000.000 – 20.000.000 |
| Hardware | Rp 9.000.000 – 22.000.000 |
| **TOTAL** | **Rp 32.000.000 – 92.000.000** |

---

## 12. ✅ Kesimpulan & Rekomendasi

### Kesimpulan

Proyek Sistem Informasi Antrean + Pendaftaran Loket untuk PKM Gladak Pakem **layak dan fokus** karena:

1. ✅ Scope jelas dan terukur — hanya **antrean + pendaftaran loket**
2. ✅ Sesuai **Bagan Alur Pendaftaran** resmi PKM Gladak Pakem
3. ✅ Pembedaan **Prioritas** (lansia, bumil, disabilitas, balita) & **Umum**
4. ✅ Integrasi **BPJS** (cek peserta + bridging pendaftaran) langsung di loket
5. ✅ Timeline pendek: **8 minggu (2 bulan)**
6. ✅ Biaya efisien: **Rp 32–92 juta** (tergantung skala)

### Rekomendasi Prioritas

```
🔴 PRIORITAS 1 — Core (Minggu 1–4)
├── Setup project + database
├── Kiosk antrean (Prioritas + Umum)
├── Display TV real-time + TTS
└── → Antrean digital berjalan

🟡 PRIORITAS 2 — Loket + BPJS (Minggu 5–6)
├── Pendaftaran pasien baru & lama
├── Upload dokumen (KTP/KK/BPJS/KIA)
├── Verifikasi & bridging BPJS PCare
├── Info wajib + antar RM ke poli
└── → Pendaftaran loket fully digital

🟢 PRIORITAS 3 — Dashboard + Go-Live (Minggu 7–8)
├── Dashboard & laporan
├── Notifikasi WA, booking web
├── UAT, deploy, training
└── → Sistem siap produksi
```

### Langkah Selanjutnya

- [ ] Review & approval dokumen analisa
- [ ] Setup repository GitHub
- [ ] Setup development environment (Docker)
- [ ] Mulai Fase 1 — Setup & Core
- [ ] Pengajuan akses API BPJS (Consumer ID & Secret ke BPJS Cabang Jember)
- [ ] Procurement hardware (kiosk + TV display + printer)

### Potensi Pengembangan Lanjutan (Fase Berikutnya)

Setelah sistem antrean + pendaftaran stabil, bisa dilanjutkan ke:

| Fase | Modul | Estimasi |
|------|-------|----------|
| Fase 2 | Pelayanan Poli + UGD (SOAP, ICD-10, E-Resep, Tindakan) | +4 minggu |
| Fase 3 | Laboratorium (Request + Hasil Lab) | +2 minggu |
| Fase 4 | Farmasi / Apotek (Proses Obat + Stok) | +2 minggu |
| Fase 5 | Kasir / Billing (Pembayaran + Klaim BPJS) | +2 minggu |
| Fase 6 | Rawat Inap + Rujukan | +2 minggu |

---

> 📌 **Dokumen ini bersifat living document dan akan di-update seiring perkembangan proyek.**
>
>
> 🏥 Untuk: Puskesmas Gladak Pakem — Jl. Wolter Monginsidi No. 25, Kranjingan, Sumbersari, Jember