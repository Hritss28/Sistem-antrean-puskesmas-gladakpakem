# 🏥 Sistem Antrean Digital — Puskesmas Gladak Pakem

Sistem informasi manajemen antrean pasien berbasis web untuk **Puskesmas Gladak Pakem**. Dibangun menggunakan Laravel 12, Inertia.js, React, dan Tailwind CSS.

---

## 📋 Gambaran Umum

Sistem ini mendigitalisasi proses antrean pasien di puskesmas, mulai dari pengambilan nomor antrean hingga pemanggilan pasien oleh petugas loket. Terdiri dari beberapa modul utama:

### 🖥️ Modul Kiosk (`/kiosk`)
Halaman self-service untuk pasien mengambil nomor antrean secara mandiri.
- Pilih kategori pasien: **Prioritas** (lansia, ibu hamil, disabilitas, balita) atau **Umum**
- Pilih jenis pembayaran: **BPJS** atau **Umum**
- Pilih poli tujuan
- Cetak/tampilkan tiket antrean digital

### 📺 Modul Display (`/display`)
Layar tampilan antrean untuk dipasang di ruang tunggu.
- Menampilkan nomor antrean yang sedang dipanggil
- Informasi poli dan loket yang aktif
- Update secara real-time

### 🪟 Modul Loket (`/loket`)
Dashboard untuk petugas loket memanggil dan mengelola antrean.
- Panggil pasien berikutnya
- Lewati (skip) atau panggil ulang pasien
- Tandai pasien selesai dilayani

### ⚙️ Modul Admin (`/admin`)
Panel administrasi untuk mengelola konfigurasi sistem.
- **Dashboard** — Ringkasan statistik harian
- **Poliklinik** — Kelola data poli (nama, kuota harian, prefix antrean)
- **Dokter** — Kelola data dokter dan jadwal
- **Pengguna** — Manajemen akun petugas
- **Konfigurasi Antrean** — Pengaturan jam operasional & kuota
- **Audit Log** — Riwayat aktivitas sistem

### 🔐 Autentikasi
- Login untuk petugas dan admin
- Two-Factor Authentication (2FA)
- Manajemen profil dan password

---

## 🛠️ Tech Stack

| Layer       | Teknologi                          |
|-------------|-------------------------------------|
| Backend     | Laravel 12 (PHP 8.2+)             |
| Frontend    | React 19 + TypeScript              |
| Bridge      | Inertia.js v2                      |
| Styling     | Tailwind CSS v4                    |
| UI Library  | Radix UI, Lucide Icons             |
| Auth        | Laravel Fortify                    |
| Database    | SQLite (default) / MySQL           |
| Build Tool  | Vite 7                             |

---

## 🚀 Cara Setup / Instalasi

### Prasyarat

Pastikan sudah terinstall:
- **PHP** ≥ 8.2
- **Composer** ≥ 2.x
- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- **Git**

### Langkah Instalasi

#### 1. Clone Repository

```bash
git clone https://github.com/Hritss28/Sistem-antrean-puskesmas-gladakpakem.git
cd Sistem-antrean-puskesmas-gladakpakem
```

#### 2. Install Dependensi PHP

```bash
composer install
```

#### 3. Konfigurasi Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit file `.env` sesuai kebutuhan, terutama konfigurasi database:

```dotenv
# Menggunakan SQLite (default, tanpa konfigurasi tambahan)
DB_CONNECTION=sqlite

> **Catatan:** Jika menggunakan SQLite, pastikan file `database/database.sqlite` sudah ada. Buat dengan perintah:
> ```bash
> # Windows
> type nul > database/database.sqlite
>
> # Linux/Mac
> touch database/database.sqlite
> ```

#### 4. Migrasi dan Seed Database

```bash
php artisan migrate
php artisan db:seed
```

#### 5. Install Dependensi Frontend

```bash
npm install
```

#### 6. Jalankan Aplikasi (Development)

Buka **2 terminal** secara bersamaan:

**Terminal 1 — Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 — Vite Development Server:**
```bash
npm run dev
```

Atau jalankan semuanya sekaligus:
```bash
composer dev
```

Akses aplikasi di: **http://localhost:8000**

---

## 📁 Struktur Direktori Utama

```
├── app/
│   ├── Http/Controllers/
│   │   ├── AdminController.php        # Panel admin
│   │   ├── KioskController.php        # Kiosk antrean
│   │   ├── DisplayController.php      # Display antrean
│   │   ├── LoketController.php        # Loket petugas
│   │   └── QueueController.php        # Manajemen antrean
│   └── Models/
├── database/
│   └── migrations/                    # Skema database
├── resources/
│   └── js/
│       ├── layouts/                   # Layout (admin-layout)
│       └── pages/
│           ├── admin/                 # Halaman admin
│           ├── auth/                  # Halaman login/register
│           ├── display/               # Halaman display antrean
│           ├── kiosk/                 # Halaman kiosk
│           └── loket/                 # Halaman loket
└── public/
    └── images/                        # Aset gambar
```

---
