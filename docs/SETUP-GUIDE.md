# Panduan Setup & Menjalankan Aplikasi

**Manajemen Dapur MBG**
**Terakhir Diperbarui**: 20 Juni 2026

---

## Daftar Isi

1. [Prasyarat (Prerequisites)](#1-prasyarat-prerequisites)
2. [Clone & Install](#2-clone--install)
3. [Setup Database MySQL](#3-setup-database-mysql)
4. [Konfigurasi Environment](#4-konfigurasi-environment)
5. [Migrasi & Seed Database](#5-migrasi--seed-database)
6. [Menjalankan Aplikasi (Development)](#6-menjalankan-aplikasi-development)
7. [Menjalankan Aplikasi (Production)](#7-menjalankan-aplikasi-production)
8. [Perintah-Perintah Penting](#8-perintah-perintah-penting)
9. [Struktur Port & URL](#9-struktur-port--url)
10. [Akun Default](#10-akun-default)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Prasyarat (Prerequisites)

Pastikan software berikut sudah terinstall di komputer Anda:

| Software | Versi Minimum | Cara Cek | Download |
|----------|---------------|----------|----------|
| **Node.js** | 22.x LTS | `node -v` | https://nodejs.org |
| **pnpm** | 10.x | `pnpm -v` | `npm install -g pnpm` |
| **MySQL** | 8.0+ | `mysql --version` | https://dev.mysql.com/downloads |
| **Git** | 2.x | `git --version` | https://git-scm.com |

### Instalasi Cepat pnpm

Jika pnpm belum terinstall:

```bash
npm install -g pnpm
```

Verifikasi:
```bash
pnpm -v
# Output: 10.x.x atau lebih tinggi
```

---

## 2. Clone & Install

### 2.1 Clone Repository

```bash
git clone https://github.com/rudicatsmile/manajemen-dapur-mbg.git
cd manajemen-dapur-mbg
```

### 2.2 Install Dependencies

```bash
pnpm install
```

Perintah ini akan menginstall semua dependencies untuk ketiga package:
- `packages/shared` — Zod schemas & types
- `packages/backend` — NestJS API server
- `packages/frontend` — Next.js web app

> **Catatan**: Proses pertama kali membutuhkan waktu beberapa menit untuk mengunduh semua packages dan compile native modules (Prisma, bcryptjs, esbuild).

---

## 3. Setup Database MySQL

### 3.1 Buat Database

Buka MySQL client (terminal, MySQL Workbench, atau phpMyAdmin), lalu jalankan:

```sql
CREATE DATABASE mbg_dapur CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3.2 Verifikasi

```sql
SHOW DATABASES LIKE 'mbg_dapur';
```

> **Catatan**: Jika menggunakan XAMPP, pastikan service MySQL sudah berjalan melalui XAMPP Control Panel.

---

## 4. Konfigurasi Environment

### 4.1 Buat File .env untuk Backend

```bash
# Dari root project
cp .env.example packages/backend/.env
```

### 4.2 Edit File .env

Buka `packages/backend/.env` dan sesuaikan:

```env
# === DATABASE ===
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
# Jika MySQL tanpa password:
DATABASE_URL="mysql://root@localhost:3306/mbg_dapur"

# Jika MySQL dengan password:
# DATABASE_URL="mysql://root:password_anda@localhost:3306/mbg_dapur"

# Jika MySQL di port lain (misal XAMPP di 3307):
# DATABASE_URL="mysql://root@localhost:3307/mbg_dapur"

# === JWT (Authentication) ===
# WAJIB GANTI untuk production! Gunakan string random minimal 32 karakter
JWT_SECRET="your-secret-key-min-32-chars-change-in-production"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"

# === SERVER ===
PORT=3001
CORS_ORIGIN="http://localhost:3000"

# === FILE UPLOAD ===
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880
```

### 4.3 Buat File .env.local untuk Frontend (Opsional)

Jika ingin mengubah URL API atau nama aplikasi, buat `packages/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_APP_NAME="Manajemen Dapur MBG"
```

> Default sudah ter-set di kode, jadi file ini opsional kecuali Anda mengubah port atau domain.

---

## 5. Migrasi & Seed Database

### 5.1 Build Shared Package

Shared package harus di-build terlebih dahulu karena backend bergantung padanya:

```bash
pnpm --filter shared build
```

### 5.2 Generate Prisma Client

```bash
pnpm --filter backend prisma:generate
```

### 5.3 Jalankan Migrasi Database

```bash
pnpm --filter backend exec prisma migrate dev --name init
```

Ini akan membuat semua tabel di database `mbg_dapur`:
- `users`, `categories`, `units_of_measure`, `suppliers`, `items`
- `purchase_orders`, `purchase_order_items`, `receivings`, `receiving_items`
- `stock_movements`, `stock_opnames`, `stock_opname_items`
- `recipes`, `recipe_items`, `productions`, `production_items`
- `waste_records`, `purchase_invoices`, `audit_logs`
- `notifications`, `price_history`

### 5.4 Seed Data Awal

```bash
pnpm --filter backend prisma:seed
```

Data yang di-seed:
- **10 satuan**: Kilogram, Gram, Liter, Mililiter, Pcs, Pack, Karton, Botol, Kaleng, Bungkus
- **2 konversi satuan**: kg↔g (1:1000), L↔ml (1:1000)
- **12 kategori**: 7 kategori item (Bahan Baku, Bumbu & Rempah, dll) + 5 kategori resep (Makanan Utama, Lauk, dll)
- **2 user default**: Admin dan Owner (lihat [Akun Default](#10-akun-default))

---

## 6. Menjalankan Aplikasi (Development)

### Opsi A: Jalankan Backend & Frontend Bersamaan

```bash
pnpm dev
```

Ini menjalankan kedua server secara paralel:
- Backend (NestJS): http://localhost:3001
- Frontend (Next.js): http://localhost:3000

### Opsi B: Jalankan Terpisah (di 2 terminal berbeda)

**Terminal 1 — Backend:**
```bash
pnpm --filter backend dev
```

**Terminal 2 — Frontend:**
```bash
pnpm --filter frontend dev
```

> **Rekomendasi**: Gunakan Opsi B saat development agar log backend dan frontend tidak tercampur.

### Verifikasi Backend Berjalan

Buka browser atau jalankan:
```bash
curl http://localhost:3001/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"email\":\"admin@mbg.com\",\"password\":\"password123\"}"
```

Jika berhasil, akan mengembalikan JSON berisi `accessToken`.

### Verifikasi Frontend Berjalan

Buka browser di **http://localhost:3000**. Anda akan melihat halaman login.

---

## 7. Menjalankan Aplikasi (Production)

### 7.1 Build Semua Package

```bash
pnpm build
```

Perintah ini akan:
1. Build `packages/shared` (TypeScript → JavaScript)
2. Build `packages/backend` (NestJS → dist/)
3. Build `packages/frontend` (Next.js → .next/)

### 7.2 Jalankan Backend (Production)

```bash
pnpm --filter backend start:prod
```

Atau langsung:
```bash
cd packages/backend
node dist/main.js
```

### 7.3 Jalankan Frontend (Production)

```bash
pnpm --filter frontend start
```

Atau langsung:
```bash
cd packages/frontend
npx next start
```

### 7.4 Menggunakan Process Manager (Rekomendasi)

Untuk production, gunakan PM2 agar aplikasi tetap berjalan:

```bash
# Install PM2
npm install -g pm2

# Jalankan backend
pm2 start packages/backend/dist/main.js --name "mbg-backend"

# Jalankan frontend
pm2 start node_modules/.bin/next --name "mbg-frontend" -- start --port 3000
# (jalankan dari folder packages/frontend)

# Lihat status
pm2 status

# Lihat log
pm2 logs mbg-backend
pm2 logs mbg-frontend

# Auto-start saat server reboot
pm2 startup
pm2 save
```

---

## 8. Perintah-Perintah Penting

### Development

| Perintah | Fungsi |
|----------|--------|
| `pnpm dev` | Jalankan backend + frontend (development mode) |
| `pnpm --filter backend dev` | Jalankan backend saja (hot-reload) |
| `pnpm --filter frontend dev` | Jalankan frontend saja (hot-reload) |
| `pnpm build` | Build semua package untuk production |

### Database

| Perintah | Fungsi |
|----------|--------|
| `pnpm --filter backend prisma:generate` | Generate Prisma Client setelah ubah schema |
| `pnpm --filter backend prisma:migrate` | Jalankan migrasi (interaktif, minta nama migrasi) |
| `pnpm --filter backend exec prisma migrate dev --name nama_migrasi` | Jalankan migrasi dengan nama langsung |
| `pnpm --filter backend prisma:seed` | Seed data awal |
| `pnpm --filter backend prisma:studio` | Buka Prisma Studio (GUI database) di browser |
| `pnpm --filter backend exec prisma migrate reset` | **HATI-HATI**: Reset database (hapus semua data + re-migrate + re-seed) |

### Prisma Studio

```bash
pnpm --filter backend prisma:studio
```

Membuka GUI database di http://localhost:5555. Berguna untuk:
- Melihat dan mengedit data langsung
- Debug tanpa query SQL
- Verifikasi data setelah migrasi/seed

### Linting & Format

| Perintah | Fungsi |
|----------|--------|
| `pnpm lint` | Jalankan linter di semua package |
| `pnpm format` | Format kode dengan Prettier |

### Clean

```bash
pnpm clean
```

Menghapus semua `node_modules`, `dist`, dan `.next`. Jalankan `pnpm install` setelahnya.

---

## 9. Struktur Port & URL

| Service | Port | URL | Keterangan |
|---------|------|-----|------------|
| **Frontend** | 3000 | http://localhost:3000 | Halaman web yang diakses user |
| **Backend API** | 3001 | http://localhost:3001/api | REST API endpoint |
| **Prisma Studio** | 5555 | http://localhost:5555 | GUI database (development only) |
| **MySQL** | 3306 | localhost:3306 | Database server |

### API Base URL

Semua API endpoint memiliki prefix `/api`:
```
http://localhost:3001/api/auth/login
http://localhost:3001/api/suppliers
http://localhost:3001/api/items
http://localhost:3001/api/purchase-orders
... dll
```

---

## 10. Akun Default

Setelah seed, tersedia 2 akun:

| Role | Email | Password | Hak Akses |
|------|-------|----------|-----------|
| **Admin** | admin@mbg.com | password123 | Semua fitur kecuali user management |
| **Owner** | owner@mbg.com | password123 | Semua fitur termasuk dashboard, laporan, dan analitik |

> **PENTING**: Segera ganti password default setelah pertama kali login melalui menu Pengaturan. Untuk production, ganti juga `JWT_SECRET` di file `.env`.

---

## 11. Troubleshooting

### Error: "Authentication failed against database server"

```
Error: P1000: Authentication failed against database server
```

**Solusi**: Password MySQL di `DATABASE_URL` tidak sesuai.
- Jika MySQL tanpa password: `mysql://root@localhost:3306/mbg_dapur`
- Jika ada password: `mysql://root:password@localhost:3306/mbg_dapur`
- Cek juga port MySQL (default 3306, XAMPP kadang 3307)

### Error: "Can't reach database server"

```
Error: P1001: Can't reach database server at localhost:3306
```

**Solusi**: MySQL belum berjalan.
- Windows: Buka Services → cari MySQL → Start
- XAMPP: Buka XAMPP Control Panel → Start MySQL
- Verifikasi: `mysql -u root -p -e "SELECT 1"`

### Error: "pnpm: command not found"

```
pnpm: The term 'pnpm' is not recognized
```

**Solusi**: Install pnpm global:
```bash
npm install -g pnpm
```

### Error: "Cannot find module bcrypt_lib.node"

```
Error: Cannot find module '...\bcrypt\lib\binding\napi-v3\bcrypt_lib.node'
```

**Solusi**: Ini terjadi jika menggunakan `bcrypt` (native). Project ini sudah menggunakan `bcryptjs` (pure JS). Jika error ini muncul:
```bash
pnpm --filter backend remove bcrypt @types/bcrypt
pnpm --filter backend add bcryptjs
pnpm --filter backend add -D @types/bcryptjs
```

### Error: "EADDRINUSE: address already in use :::3001"

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solusi**: Port 3001 sudah digunakan oleh proses lain.

Windows:
```powershell
# Cari proses yang menggunakan port 3001
netstat -ano | findstr :3001

# Kill proses (ganti PID dengan angka dari output di atas)
taskkill /PID <PID> /F
```

Linux/Mac:
```bash
lsof -i :3001
kill -9 <PID>
```

### Error saat Prisma Migrate: "Enter a name for the new migration"

Jika diminta input nama migrasi secara interaktif, gunakan flag `--name`:

```bash
pnpm --filter backend exec prisma migrate dev --name nama_migrasi
```

### Frontend Error: "Module not found: @mbg/shared"

**Solusi**: Shared package belum di-build:
```bash
pnpm --filter shared build
```

### Database Perlu Reset Total

Jika database korup atau ingin mulai dari awal:

```bash
# HATI-HATI: Ini menghapus SEMUA data!
pnpm --filter backend exec prisma migrate reset

# Seed ulang data awal
pnpm --filter backend prisma:seed
```

---

## Urutan Langkah Lengkap (Quick Start)

Untuk yang baru pertama kali setup, jalankan semua perintah ini secara berurutan:

```bash
# 1. Clone
git clone https://github.com/rudicatsmile/manajemen-dapur-mbg.git
cd manajemen-dapur-mbg

# 2. Install dependencies
pnpm install

# 3. Buat database MySQL
mysql -u root -e "CREATE DATABASE mbg_dapur CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. Setup environment
cp .env.example packages/backend/.env
# Edit packages/backend/.env → sesuaikan DATABASE_URL

# 5. Build shared package
pnpm --filter shared build

# 6. Generate Prisma + Migrasi + Seed
pnpm --filter backend prisma:generate
pnpm --filter backend exec prisma migrate dev --name init
pnpm --filter backend prisma:seed

# 7. Jalankan aplikasi
pnpm dev

# 8. Buka browser
# → http://localhost:3000
# → Login: admin@mbg.com / password123
```

---

*Jika menemukan masalah yang tidak tercantum di sini, buat issue di GitHub repository.*
