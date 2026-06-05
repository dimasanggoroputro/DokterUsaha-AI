# DokterUsaha AI

## Overview

DokterUsaha AI adalah aplikasi berbasis AI yang membantu pelaku UMKM mendiagnosis masalah bisnis mereka dan memberikan rekomendasi solusi yang dapat diterapkan.

Banyak pelaku UMKM mengalami masalah seperti penjualan menurun, pelanggan sepi, keuntungan tidak jelas, atau kesulitan mengembangkan usaha. Namun mereka sering tidak memiliki akses ke konsultan bisnis profesional karena biaya yang mahal.

DokterUsaha AI hadir sebagai "dokter bisnis digital" yang membantu pemilik usaha memahami kondisi usahanya melalui konsultasi berbasis AI.

---

## Problem Statement

Pelaku UMKM sering mengalami:

- Penjualan menurun
- Pelanggan sepi
- Keuangan tidak teratur
- Sulit menentukan strategi promosi
- Tidak mengetahui akar masalah bisnis
- Tidak memiliki akses ke konsultan bisnis

Akibatnya keputusan bisnis sering dibuat berdasarkan tebakan, bukan data dan analisis.

---

## Solution

DokterUsaha AI membantu pengguna:

1. Mengisi informasi kondisi usaha.
2. Menjelaskan masalah yang sedang dialami.
3. AI menganalisis kondisi usaha.
4. AI memberikan diagnosis bisnis.
5. AI memberikan rekomendasi tindakan.
6. Riwayat konsultasi tersimpan untuk evaluasi di masa depan.

---

## Target Users

### Primary Users

- Pemilik warung
- Pemilik toko kecil
- Pedagang makanan
- UMKM rumahan
- Penjual online skala kecil

### Secondary Users

- Mahasiswa bisnis
- Pendamping UMKM
- Konsultan UMKM

---

## MVP Features

### 1. AI Business Diagnosis

Pengguna menjelaskan kondisi usahanya.

Contoh:

"Saya jualan bakso. Dua bulan terakhir penjualan turun 40%. Banyak pelanggan lama tidak datang lagi."

AI memberikan:

- Ringkasan masalah
- Tingkat urgensi
- Penyebab potensial
- Rekomendasi tindakan

---

### 2. Structured Consultation Form

Field:

- Nama usaha
- Jenis usaha
- Lama usaha
- Jumlah karyawan
- Omzet bulanan
- Masalah utama
- Target bisnis

---

### 3. Consultation History

Menyimpan:

- Tanggal konsultasi
- Masalah yang diajukan
- Hasil diagnosis
- Rekomendasi

---

### 4. Dashboard

Menampilkan:

- Jumlah konsultasi
- Riwayat terbaru
- Ringkasan kondisi bisnis

---

## Future Features

### Image Analysis

User dapat mengunggah:

- Foto warung
- Foto produk
- Screenshot toko online
- Screenshot laporan penjualan

AI akan memberikan analisis tambahan.

### Voice Consultation

User dapat berbicara langsung menggunakan suara.

### Business Score

AI memberikan skor kesehatan bisnis.

### Financial Analysis

Analisis pemasukan dan pengeluaran usaha.

### Action Plan Generator

AI membuat langkah-langkah perbaikan bisnis selama 7-30 hari.

---

## User Flow

Home Page

↓

Mulai Diagnosa

↓

Isi Form Konsultasi

↓

AI Analysis

↓

Diagnosis Result

↓

Simpan Riwayat

↓

Dashboard

---

## Tech Stack

### Frontend

- Next.js 16
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide React
- Sonner

### AI

- Google Gemini

### Database

- Supabase

### Hosting

- Vercel

---

## Design Principles

- Mobile First
- Clean Interface
- Easy for non-technical users
- Fast interaction
- Minimal typing when possible

---

## Success Metrics

- User dapat memperoleh diagnosis dalam kurang dari 1 menit.
- Hasil diagnosis mudah dipahami pelaku UMKM.
- UI sederhana dan tidak membingungkan.
- Riwayat konsultasi dapat diakses kembali dengan mudah.
