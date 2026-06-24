# Manual Book — Manajemen Dapur MBG

**Versi**: 1.4
**Terakhir Diperbarui**: 21 Juni 2026

---

## Daftar Isi

1. [Menu Engineering](#1-menu-engineering)
   - 1.1 [Apa itu Menu Engineering?](#11-apa-itu-menu-engineering)
   - 1.2 [Memahami 4 Klasifikasi Menu](#12-memahami-4-klasifikasi-menu)
   - 1.3 [Cara Mengakses](#13-cara-mengakses)
   - 1.4 [Mengatur Periode Analisis](#14-mengatur-periode-analisis)
   - 1.5 [Membaca Summary Cards](#15-membaca-summary-cards)
   - 1.6 [Membaca Scatter Chart (Matriks)](#16-membaca-scatter-chart-matriks)
   - 1.7 [Menggunakan Tabel Detail](#17-menggunakan-tabel-detail)
   - 1.8 [Mengambil Keputusan Berdasarkan Data](#18-mengambil-keputusan-berdasarkan-data)
   - 1.9 [Tips & Best Practices](#19-tips--best-practices)
   - 1.10 [FAQ Menu Engineering](#110-faq-menu-engineering)
2. [Notification System](#2-notification-system)
   - 2.1 [Tentang Sistem Notifikasi](#21-tentang-sistem-notifikasi)
   - 2.2 [Jenis-Jenis Notifikasi](#22-jenis-jenis-notifikasi)
   - 2.3 [Notification Bell (Lonceng di Header)](#23-notification-bell-lonceng-di-header)
   - 2.4 [Halaman Notifikasi](#24-halaman-notifikasi)
   - 2.5 [Menandai Notifikasi Dibaca](#25-menandai-notifikasi-dibaca)
   - 2.6 [Trigger Alert Manual (Admin)](#26-trigger-alert-manual-admin)
   - 2.7 [Siapa Menerima Notifikasi Apa?](#27-siapa-menerima-notifikasi-apa)
   - 2.8 [FAQ Notification System](#28-faq-notification-system)
3. [Supplier Rating & Scorecard](#3-supplier-rating--scorecard)
   - 3.1 [Tentang Supplier Rating](#31-tentang-supplier-rating)
   - 3.2 [4 Kriteria Penilaian](#32-4-kriteria-penilaian)
   - 3.3 [Cara Mengakses](#33-cara-mengakses)
   - 3.4 [Halaman Ranking Supplier](#34-halaman-ranking-supplier)
   - 3.5 [Halaman Detail Supplier](#35-halaman-detail-supplier)
   - 3.6 [Mengambil Keputusan Berdasarkan Rating](#36-mengambil-keputusan-berdasarkan-rating)
   - 3.7 [Tips & Best Practices](#37-tips--best-practices)
   - 3.8 [FAQ Supplier Rating](#38-faq-supplier-rating)
4. [Histori & Alert Harga Bahan](#4-histori--alert-harga-bahan)
   - 4.1 [Tentang Histori Harga](#41-tentang-histori-harga)
   - 4.2 [Cara Data Harga Terkumpul](#42-cara-data-harga-terkumpul)
   - 4.3 [Halaman Histori & Alert Harga](#43-halaman-histori--alert-harga)
   - 4.4 [Halaman Detail Harga Item](#44-halaman-detail-harga-item)
   - 4.5 [Alert Harga Otomatis](#45-alert-harga-otomatis)
   - 4.6 [Strategi Berdasarkan Data Harga](#46-strategi-berdasarkan-data-harga)
   - 4.7 [FAQ Histori Harga](#47-faq-histori-harga)
5. [Forecasting Kebutuhan Bahan Baku](#5-forecasting-kebutuhan-bahan-baku)
   - 5.1 [Tentang Forecasting](#51-tentang-forecasting)
   - 5.2 [Cara Kerja Algoritma Prediksi](#52-cara-kerja-algoritma-prediksi)
   - 5.3 [Dashboard Prediksi Kebutuhan](#53-dashboard-prediksi-kebutuhan)
   - 5.4 [Detail Prediksi Per Item](#54-detail-prediksi-per-item)
   - 5.5 [Auto-Generate Draft PO](#55-auto-generate-draft-po)
   - 5.6 [Faktor Musiman (Seasonal Factors)](#56-faktor-musiman-seasonal-factors)
   - 5.7 [Akurasi Prediksi](#57-akurasi-prediksi)
   - 5.8 [Memahami Safety Stock](#58-memahami-safety-stock)
   - 5.9 [Tips & Best Practices](#59-tips--best-practices)
   - 5.10 [FAQ Forecasting](#510-faq-forecasting)
6. [Meal Prep Planner](#6-meal-prep-planner)
   - 6.1 [Tentang Meal Prep Planner](#61-tentang-meal-prep-planner)
   - 6.2 [Cara Mengakses](#62-cara-mengakses)
   - 6.3 [Membuat Jadwal Baru](#63-membuat-jadwal-baru)
   - 6.4 [Weekly Board — Tampilan Mingguan](#64-weekly-board--tampilan-mingguan)
   - 6.5 [Menambah Menu ke Hari](#65-menambah-menu-ke-hari)
   - 6.6 [Mengedit dan Menghapus Menu](#66-mengedit-dan-menghapus-menu)
   - 6.7 [Kapasitas Produksi Harian](#67-kapasitas-produksi-harian)
   - 6.8 [Status Jadwal (DRAFT → ACTIVE → COMPLETED)](#68-status-jadwal)
   - 6.9 [Cek Ketersediaan Stok](#69-cek-ketersediaan-stok)
   - 6.10 [Buat Daftar Belanja (Auto-Generate PO)](#610-buat-daftar-belanja)
   - 6.11 [Template Jadwal](#611-template-jadwal)
   - 6.12 [Saran Jadwal dari Data Historis](#612-saran-jadwal-dari-data-historis)
   - 6.13 [Alur Kerja Lengkap](#613-alur-kerja-lengkap)
   - 6.14 [Tips & Best Practices](#614-tips--best-practices)
   - 6.15 [FAQ Meal Prep Planner](#615-faq-meal-prep-planner)
7. [FIFO & Expiry Date Tracking](#7-fifo--expiry-date-tracking)
   - 7.1 [Tentang FIFO & Batch Tracking](#71-tentang-fifo--batch-tracking)
   - 7.2 [Cara Batch Terbentuk](#72-cara-batch-terbentuk)
   - 7.3 [Dashboard Batch & Expiry](#73-dashboard-batch--expiry)
   - 7.4 [Tabel Item Mendekati Expired](#74-tabel-item-mendekati-expired)
   - 7.5 [Detail Batch Per Item (FIFO Order)](#75-detail-batch-per-item-fifo-order)
   - 7.6 [FIFO Suggestion Tool](#76-fifo-suggestion-tool)
   - 7.7 [Menandai Batch Expired](#77-menandai-batch-expired)
   - 7.8 [Alert Expiry Otomatis](#78-alert-expiry-otomatis)
   - 7.9 [Proses Auto-Expire](#79-proses-auto-expire)
   - 7.10 [Input Batch Saat Receiving](#710-input-batch-saat-receiving)
   - 7.11 [Tips & Best Practices](#711-tips--best-practices)
   - 7.12 [FAQ FIFO & Expiry](#712-faq-fifo--expiry)
8. [Multi-Cabang & Transfer Stok](#8-multi-cabang--transfer-stok)
   - 8.1 [Tentang Multi-Cabang](#81-tentang-multi-cabang)
   - 8.2 [Konsep: Master Shared & Stok Per-Cabang](#82-konsep-master-shared--stok-per-cabang)
   - 8.3 [Branch Switcher — Memilih Cabang Aktif](#83-branch-switcher--memilih-cabang-aktif)
   - 8.4 [Mode "Semua Cabang" (Konsolidasi)](#84-mode-semua-cabang-konsolidasi)
   - 8.5 [Mengelola Cabang](#85-mengelola-cabang)
   - 8.6 [Menempatkan Pengguna ke Cabang](#86-menempatkan-pengguna-ke-cabang)
   - 8.7 [Bagaimana Transaksi Terikat Cabang](#87-bagaimana-transaksi-terikat-cabang)
   - 8.8 [Transfer Stok — Alur Lengkap](#88-transfer-stok--alur-lengkap)
   - 8.9 [Membuat Permintaan Transfer](#89-membuat-permintaan-transfer)
   - 8.10 [Menyetujui, Menolak, Membatalkan](#810-menyetujui-menolak-membatalkan)
   - 8.11 [Mengirim & Menerima Transfer](#811-mengirim--menerima-transfer)
   - 8.12 [Laporan Perbandingan Cabang](#812-laporan-perbandingan-cabang)
   - 8.13 [Tips & Best Practices](#813-tips--best-practices)
   - 8.14 [FAQ Multi-Cabang](#814-faq-multi-cabang)
9. [Vendor Portal](#9-vendor-portal)
   - 9.1 [Tentang Vendor Portal](#91-tentang-vendor-portal)
   - 9.2 [Akun Supplier — Provisioning & Login](#92-akun-supplier--provisioning--login)
   - 9.3 [Portal: Dashboard](#93-portal-dashboard)
   - 9.4 [Portal: Melihat Purchase Order](#94-portal-melihat-purchase-order)
   - 9.5 [Portal: Update Status Pengiriman](#95-portal-update-status-pengiriman)
   - 9.6 [Portal: Upload Invoice / Nota](#96-portal-upload-invoice--nota)
   - 9.7 [Portal: Katalog Harga](#97-portal-katalog-harga)
   - 9.8 [Portal: Chat / Pesan](#98-portal-chat--pesan)
   - 9.9 [Internal: Melihat Data dari Supplier](#99-internal-melihat-data-dari-supplier)
   - 9.10 [Tips & Best Practices](#910-tips--best-practices)
   - 9.11 [FAQ Vendor Portal](#911-faq-vendor-portal)
10. [PWA & Barcode Scanner](#10-pwa--barcode-scanner)
    - 10.1 [Tentang PWA & Barcode](#101-tentang-pwa--barcode)
    - 10.2 [Menginstall Aplikasi ke HP](#102-menginstall-aplikasi-ke-hp)
    - 10.3 [Mode Offline](#103-mode-offline)
    - 10.4 [Input Offline & Sinkronisasi Otomatis](#104-input-offline--sinkronisasi-otomatis)
    - 10.5 [Mengisi Barcode Item](#105-mengisi-barcode-item)
    - 10.6 [Scan Item (Lihat Stok & Histori)](#106-scan-item-lihat-stok--histori)
    - 10.7 [Scan saat Stok Opname](#107-scan-saat-stok-opname)
    - 10.8 [Scan saat Penerimaan Barang](#108-scan-saat-penerimaan-barang)
    - 10.9 [Tips & Best Practices](#109-tips--best-practices)
    - 10.10 [FAQ PWA & Barcode](#1010-faq-pwa--barcode)

---

## 1. Menu Engineering

### 1.1 Apa itu Menu Engineering?

Menu Engineering adalah metode analisis yang digunakan di industri F&B untuk mengevaluasi performa setiap item menu berdasarkan dua faktor:

- **Popularitas** — Seberapa sering menu tersebut diproduksi (volume produksi)
- **Profitabilitas** — Seberapa besar keuntungan per porsi menu tersebut (harga jual dikurangi biaya bahan)

Dengan mengkombinasikan kedua faktor ini, setiap menu diklasifikasikan ke dalam salah satu dari 4 kategori. Tujuannya adalah membantu owner/admin mengambil keputusan strategis tentang menu mana yang harus dipertahankan, dipromosikan, dioptimasi, atau dihapus.

### 1.2 Memahami 4 Klasifikasi Menu

| Klasifikasi | Popularitas | Profitabilitas | Warna | Arti |
|-------------|------------|----------------|-------|------|
| **Star** | Tinggi | Tinggi | Kuning (#eab308) | Menu andalan — laris dan menguntungkan |
| **Puzzle** | Rendah | Tinggi | Biru (#3b82f6) | Menguntungkan tapi kurang laris |
| **Plow Horse** | Tinggi | Rendah | Oranye (#f97316) | Laris tapi margin tipis |
| **Dog** | Rendah | Rendah | Merah (#ef4444) | Tidak laris dan tidak menguntungkan |

**Cara sistem menentukan klasifikasi:**
1. Sistem menghitung **median** (nilai tengah) dari volume produksi seluruh menu → ini menjadi garis batas popularitas
2. Sistem menghitung **median** dari margin per porsi seluruh menu → ini menjadi garis batas profitabilitas
3. Menu dengan volume **di atas atau sama dengan** median popularitas = "Tinggi", di bawah = "Rendah"
4. Menu dengan margin **di atas atau sama dengan** median profitabilitas = "Tinggi", di bawah = "Rendah"

### 1.3 Cara Mengakses

1. Login ke aplikasi
2. Di sidebar kiri, klik **Laporan**
3. Klik **Menu Engineering**
4. Halaman akan menampilkan analisis berdasarkan bulan berjalan secara default

**Hak akses:** Hanya role **Owner** dan **Admin** yang dapat mengakses halaman ini.

### 1.4 Mengatur Periode Analisis

Di bagian atas halaman terdapat filter periode:

```
┌──────────────────────────────────────────────────┐
│  Dari: [2026-06-01]    Sampai: [2026-06-30]      │
│  Filter Klasifikasi: [Semua ▼]                   │
└──────────────────────────────────────────────────┘
```

**Langkah:**
1. Klik field **"Dari"** → pilih tanggal mulai periode analisis
2. Klik field **"Sampai"** → pilih tanggal akhir periode analisis
3. Data akan otomatis ter-update sesuai periode yang dipilih
4. (Opsional) Gunakan **"Filter Klasifikasi"** untuk menampilkan hanya menu dengan klasifikasi tertentu (Star/Puzzle/Plow Horse/Dog)

**Tips pemilihan periode:**
- Gunakan **1 bulan** untuk evaluasi rutin bulanan
- Gunakan **1 minggu** untuk melihat tren mingguan
- Gunakan **3 bulan** untuk pengambilan keputusan strategis (hapus/tambah menu)

### 1.5 Membaca Summary Cards

Di bawah filter, terdapat 4 kartu ringkasan:

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  ⭐ Star    │ │  🧩 Puzzle  │ │  🐴 Plow    │ │  🐕 Dog     │
│     12      │ │      5      │ │  Horse  8   │ │      3      │
│  menu items │ │  menu items │ │  menu items │ │  menu items │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

Setiap kartu menampilkan jumlah menu yang masuk dalam klasifikasi tersebut.

**Distribusi yang sehat:**
- Idealnya, sebagian besar menu berada di kategori **Star** dan **Plow Horse**
- Jika banyak menu di kategori **Dog**, perlu evaluasi menu secara menyeluruh
- Jika banyak di **Puzzle**, strategi promosi perlu ditingkatkan

### 1.6 Membaca Scatter Chart (Matriks)

Scatter chart menampilkan visualisasi matriks 4 kuadran:

```
        Margin/Porsi (Rp)
             ↑
             │  PUZZLE          STAR
             │  (biru)          (kuning)
             │     ●               ●  ●
             │        ●         ●
Median ------│----- - - - - - - - - - - - - -
Profit       │
             │  DOG             PLOW HORSE
             │  (merah)         (oranye)
             │     ●            ●  ●
             │                     ●
             └────────────────────────────→
                   Volume Produksi
                        ↑
                  Median Popularitas
```

**Cara membaca:**
- Sumbu X (horizontal) = **Volume Produksi** (jumlah porsi yang diproduksi dalam periode)
- Sumbu Y (vertikal) = **Margin per Porsi** (harga jual − biaya bahan per porsi dalam Rupiah)
- Garis putus-putus horizontal = Median profit (garis pemisah atas/bawah)
- Garis putus-putus vertikal = Median popularitas (garis pemisah kiri/kanan)
- Setiap titik (●) = Satu menu, warnanya sesuai klasifikasi

**Interaksi:**
- **Hover** pada titik → tampil tooltip berisi: nama menu, kategori, volume produksi, margin/porsi, biaya/porsi, food cost %, dan klasifikasi

### 1.7 Menggunakan Tabel Detail

Di bawah chart terdapat tabel detail dengan kolom:

| Kolom | Penjelasan |
|-------|-----------|
| **Menu** | Nama resep/menu |
| **Kategori** | Kategori resep (Makanan Utama, Lauk, dll) |
| **Harga Jual** | Harga jual per porsi yang sudah diset di data resep |
| **Biaya/Porsi** | Total biaya bahan per porsi (dihitung otomatis dari resep × harga bahan terkini) |
| **Food Cost %** | Persentase biaya terhadap harga jual. Badge warna: Hijau (<30%), Kuning (30-40%), Merah (>40%) |
| **Margin/Porsi** | Harga jual − biaya/porsi = keuntungan kotor per porsi |
| **Volume Produksi** | Total porsi yang diproduksi dalam periode yang dipilih |
| **Klasifikasi** | Badge berwarna: Star (kuning), Puzzle (biru), Plow Horse (oranye), Dog (merah) |
| **Rekomendasi** | Saran aksi yang harus diambil berdasarkan klasifikasi |

**Fitur tabel:**
- **Pencarian** — Ketik nama menu di kolom pencarian untuk filter cepat
- **Sort** — Klik header kolom untuk mengurutkan (misalnya sort by Food Cost % untuk menemukan menu paling boros)
- **Filter klasifikasi** — Gunakan dropdown "Filter Klasifikasi" di atas untuk menampilkan hanya kategori tertentu

### 1.8 Mengambil Keputusan Berdasarkan Data

#### Menu Star — "Pertahankan & Promosikan"
- **Jangan ubah resep** — resep sudah optimal
- Pastikan bahan selalu tersedia (set minimum stok yang cukup)
- Tempatkan di posisi utama di daftar menu/display
- Bisa dijadikan paket bundling untuk meningkatkan volume lebih lanjut

#### Menu Puzzle — "Tingkatkan Promosi"
- Margin bagus tapi kurang dikenal/dipilih pelanggan
- Strategi: buat promo khusus, foto menu yang lebih menarik, rekomendasi oleh staf
- Pertimbangkan turunkan harga sedikit untuk meningkatkan volume (tapi jaga margin tetap di atas rata-rata)
- Jika setelah 2-3 bulan promosi tetap rendah, pertimbangkan reposisi atau ganti

#### Menu Plow Horse — "Optimasi Resep / Naikkan Harga"
- Laris tapi untungnya tipis
- Strategi 1: **Optimasi resep** — cari bahan substitusi yang lebih murah tanpa mengurangi kualitas
- Strategi 2: **Naikkan harga** secara bertahap (Rp 1.000–2.000) — volume biasanya tidak turun drastis
- Strategi 3: **Kurangi porsi** sedikit — sesuaikan dengan standar industri
- Monitor food cost % setiap minggu setelah perubahan

#### Menu Dog — "Pertimbangkan Hapus"
- Tidak laris dan tidak menguntungkan
- Sebelum menghapus, coba: ubah nama/presentasi, masukkan dalam paket combo
- Jika setelah 1-2 bulan tidak ada peningkatan → **hapus dari menu**
- Menghapus Dog bisa menghemat biaya penyimpanan bahan dan menyederhanakan operasional

### 1.9 Tips & Best Practices

1. **Lakukan analisis minimal 1x per bulan** — Jadwalkan evaluasi menu setiap awal bulan dengan data bulan sebelumnya
2. **Gunakan minimal 1 bulan data** — Data 1 minggu kurang representatif karena fluktuasi harian
3. **Pastikan harga jual ter-update** — Jika harga jual menu berubah, update di data Resep agar analisis akurat
4. **Pastikan data produksi lengkap** — Semua produksi harian harus tercatat di sistem agar volume akurat
5. **Bandingkan antar periode** — Lihat apakah menu yang sama berpindah klasifikasi dari bulan ke bulan
6. **Target food cost ideal: 28-35%** — Jika rata-rata food cost di atas 35%, perlu evaluasi menyeluruh
7. **Jangan hapus semua Dog sekaligus** — Lakukan secara bertahap dan monitor dampaknya

### 1.10 FAQ Menu Engineering

**Q: Kenapa semua data kosong (0 menu)?**
A: Pastikan sudah ada data **Resep** (dengan bahan dan harga jual) dan data **Produksi Harian** yang tercatat di sistem. Menu Engineering membutuhkan minimal 1 resep aktif dan 1 catatan produksi dalam periode yang dipilih.

**Q: Bagaimana biaya per porsi dihitung?**
A: Biaya per porsi = Σ (jumlah bahan per porsi × harga beli terakhir bahan). Jika resep menghasilkan 50 porsi dan butuh 5 kg ayam (harga Rp 35.000/kg), kontribusi ayam = (5/50) × 35.000 = Rp 3.500 per porsi.

**Q: Kenapa harga jual menunjukkan Rp 0?**
A: Harga jual belum diisi di data Resep. Buka menu **Produksi → Resep → [nama resep] → Edit**, lalu isi field "Harga Jual".

**Q: Median berubah setiap periode, apakah itu normal?**
A: Ya, itu normal. Median dihitung ulang setiap kali Anda memilih periode baru, berdasarkan data aktual periode tersebut.

**Q: Bisa export laporan Menu Engineering ke PDF?**
A: Saat ini analisis tersedia di halaman web. Fitur export PDF untuk Menu Engineering akan tersedia di update berikutnya.

---

## 2. Notification System

### 2.1 Tentang Sistem Notifikasi

Sistem Notifikasi memberikan peringatan otomatis kepada user yang tepat ketika terjadi event penting dalam operasional dapur. Notifikasi membantu memastikan:

- Stok rendah segera ditindaklanjuti
- Purchase Order tidak menunggu approval terlalu lama
- Pengiriman barang yang terlambat segera di-follow up

Notifikasi muncul dalam bentuk:
1. **Lonceng (Bell)** di header — dengan badge angka menunjukkan jumlah notifikasi yang belum dibaca
2. **Popover panel** — klik lonceng untuk melihat notifikasi terbaru
3. **Halaman Notifikasi** — daftar lengkap semua notifikasi

### 2.2 Jenis-Jenis Notifikasi

| Tipe | Ikon | Warna | Deskripsi | Contoh |
|------|------|-------|-----------|--------|
| **Stok Rendah** | 📦 PackageX | Merah | Stok item di bawah batas minimum | "Stok Rendah: Ayam Fillet — Stok saat ini 2 kg, di bawah minimum 5 kg" |
| **PO Pending** | ⏰ Clock | Kuning | PO menunggu approval > 24 jam | "PO Menunggu Persetujuan: PO-20260620-001 dari PT Sumber Makmur sudah lebih dari 24 jam" |
| **PO Terlambat** | ⚠️ AlertTriangle | Oranye | PO melewati tanggal pengiriman | "PO Terlambat: PO-20260618-003 dari CV Bahan Segar sudah melewati tanggal pengiriman" |
| **Umum** | ℹ️ Info | Biru | Notifikasi umum/informasi | Digunakan untuk notifikasi manual dari admin |

### 2.3 Notification Bell (Lonceng di Header)

Lonceng notifikasi terletak di pojok kanan atas header, di sebelah kiri menu user.

```
┌──────────────────────────────────────────────┐
│  🍳 Manajemen Dapur MBG        🔔(3)  👤    │
└──────────────────────────────────────────────┘
                                   ↑
                            Badge merah "3"
                          menunjukkan 3 notifikasi
                            belum dibaca
```

**Cara menggunakan:**

1. **Lihat jumlah notifikasi** — Angka merah pada lonceng menunjukkan berapa notifikasi yang belum Anda baca. Jika tidak ada badge, berarti semua sudah dibaca.

2. **Klik lonceng** → muncul panel popover berisi 10 notifikasi terbaru:

```
┌──────────────────────────────────┐
│ Notifikasi     Tandai semua dibaca│
├──────────────────────────────────┤
│ 📦 Stok Rendah: Ayam Fillet    ●│
│ Stok saat ini 2 kg, di bawah... │
│ 5 menit lalu                     │
├──────────────────────────────────┤
│ ⏰ PO Menunggu: PO-20260620-001 │
│ Purchase Order dari PT Sumber... │
│ 2 jam lalu                       │
├──────────────────────────────────┤
│        Lihat semua               │
└──────────────────────────────────┘
```

3. **Klik notifikasi** → notifikasi ditandai sebagai "dibaca" dan Anda diarahkan ke halaman terkait (misalnya: halaman stok item untuk alert stok rendah, halaman detail PO untuk alert PO)

4. **"Tandai semua dibaca"** → Klik tombol ini untuk menandai semua notifikasi sebagai sudah dibaca sekaligus

5. **"Lihat semua"** → Klik untuk membuka halaman Notifikasi lengkap

**Catatan:** Lonceng otomatis memeriksa notifikasi baru setiap **30 detik** tanpa perlu refresh halaman.

### 2.4 Halaman Notifikasi

Halaman Notifikasi menampilkan daftar lengkap semua notifikasi Anda.

**Cara mengakses:**
- Klik **"Lihat semua"** di popover lonceng, ATAU
- Klik **"Notifikasi"** di sidebar kiri (di bawah bagian navigasi utama)

**Tampilan halaman:**

```
┌─────────────────────────────────────────────┐
│ Notifikasi                                  │
│ Kelola semua notifikasi Anda                │
│                        [Tandai semua dibaca] │
│                                             │
│ [Semua] [Belum Dibaca]                      │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 📦 Stok Rendah: Ayam Fillet           ● │ │
│ │ Stok Ayam Fillet (ITM-BB-001) saat ini  │ │
│ │ 2, di bawah minimum 5.                  │ │
│ │ 5 menit lalu                            │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ ⏰ PO Menunggu Persetujuan: PO-001      │ │
│ │ Purchase Order PO-20260620-001 dari     │ │
│ │ PT Sumber Makmur sudah lebih dari 24... │ │
│ │ 2 jam lalu                              │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│    [Sebelumnya]  Halaman 1 dari 3  [Selanjutnya]│
└─────────────────────────────────────────────┘
```

**Fitur-fitur:**

| Fitur | Cara Menggunakan |
|-------|-----------------|
| **Filter "Semua"** | Klik tombol "Semua" untuk menampilkan semua notifikasi (sudah dibaca dan belum) |
| **Filter "Belum Dibaca"** | Klik tombol "Belum Dibaca" untuk menampilkan hanya notifikasi yang belum dibaca |
| **Tandai semua dibaca** | Klik tombol di pojok kanan atas untuk menandai seluruh notifikasi sebagai sudah dibaca |
| **Klik notifikasi** | Klik pada kartu notifikasi untuk: (1) menandai sebagai dibaca, (2) navigasi ke halaman terkait |
| **Pagination** | Gunakan tombol "Sebelumnya" / "Selanjutnya" untuk berpindah halaman jika notifikasi banyak |

**Cara membedakan status dibaca/belum:**
- **Belum dibaca** → kartu memiliki background highlight dan titik hijau (●) di sebelah judul
- **Sudah dibaca** → kartu tampil normal tanpa highlight

### 2.5 Menandai Notifikasi Dibaca

Ada 3 cara untuk menandai notifikasi sebagai sudah dibaca:

1. **Klik notifikasi** — Notifikasi individual otomatis ditandai dibaca saat diklik
2. **"Tandai semua dibaca"** di popover — Menandai semua notifikasi yang belum dibaca
3. **"Tandai semua dibaca"** di halaman Notifikasi — Sama seperti di atas, tapi dari halaman penuh

Setelah ditandai dibaca:
- Badge angka pada lonceng berkurang/hilang
- Notifikasi tetap tersimpan dan bisa dilihat di tab "Semua"
- Notifikasi tidak bisa di-"unread" kembali

### 2.6 Trigger Alert Manual (Admin)

Admin dan Owner dapat memicu pengecekan alert secara manual tanpa menunggu jadwal otomatis.

**Cara menggunakan (via API):**

Kirim request POST ke endpoint `/api/notifications/check` dengan token autentikasi.

Alert yang diperiksa:
1. **Stok Rendah** — Memeriksa semua item aktif yang stoknya di bawah minimum
2. **PO Pending** — Memeriksa PO dengan status "Pending Approval" yang sudah lebih dari 24 jam
3. **PO Terlambat** — Memeriksa PO yang sudah melewati tanggal pengiriman yang diharapkan

**Respons:**
```json
{
  "data": {
    "lowStock": { "checked": 3 },
    "pendingPO": { "checked": 1 },
    "overduePO": { "checked": 0 }
  }
}
```

Angka "checked" menunjukkan berapa item/PO yang menghasilkan notifikasi baru.

**Catatan penting:** Sistem tidak akan membuat notifikasi duplikat. Jika alert untuk item/PO yang sama sudah dibuat hari ini, tidak akan dibuat ulang.

### 2.7 Siapa Menerima Notifikasi Apa?

Setiap tipe notifikasi dikirim ke role yang relevan:

| Tipe Notifikasi | Purchaser | Admin | Owner | Kitchen Manager |
|-----------------|-----------|-------|-------|-----------------|
| Stok Rendah | ✅ | ✅ | ❌ | ❌ |
| PO Pending Approval | ❌ | ✅ | ✅ | ❌ |
| PO Terlambat | ✅ | ❌ | ❌ | ❌ |

**Penjelasan:**
- **Stok Rendah** → Purchaser dan Admin yang bertindak untuk restock
- **PO Pending Approval** → Admin dan Owner yang berhak menyetujui PO
- **PO Terlambat** → Purchaser yang bertanggung jawab follow-up supplier

### 2.8 FAQ Notification System

**Q: Seberapa sering lonceng diperbarui?**
A: Setiap **30 detik**, sistem otomatis memeriksa apakah ada notifikasi baru. Anda tidak perlu refresh halaman.

**Q: Kapan alert stok rendah muncul?**
A: Saat pengecekan dijalankan (manual via API), sistem memeriksa setiap item yang memiliki **minimum stok > 0** dan **stok saat ini ≤ minimum stok**. Alert hanya dibuat **1x per hari** per item untuk menghindari spam.

**Q: Saya tidak menerima notifikasi, kenapa?**
A: Periksa beberapa hal:
1. Apakah role Anda sesuai untuk jenis notifikasi tersebut? (lihat tabel di atas)
2. Apakah alert check sudah dijalankan? (minta Admin menjalankan pengecekan manual)
3. Apakah Anda login dengan akun yang benar?

**Q: Bisakah saya menghapus notifikasi?**
A: Saat ini notifikasi hanya bisa ditandai "dibaca", tidak bisa dihapus. Notifikasi yang sudah dibaca akan tetap tersimpan sebagai riwayat.

**Q: Apakah notifikasi hilang setelah ditutup popover?**
A: Tidak. Semua notifikasi tersimpan permanen di database. Anda bisa melihatnya kapan saja di halaman Notifikasi (/notifikasi).

**Q: Bagaimana jika stok sudah diisi ulang, apakah alert stok rendah hilang?**
A: Alert yang sudah terkirim tidak akan hilang (tetap tersimpan sebagai riwayat). Namun, alert baru untuk item yang sama **tidak akan dikirim lagi** selama stok sudah di atas minimum, karena sistem memeriksa kondisi stok terkini saat generate alert.

**Q: Apakah ada limit jumlah notifikasi?**
A: Tidak ada limit. Namun, notifikasi ditampilkan dengan pagination (20 per halaman) untuk menjaga performa.

---

## 3. Supplier Rating & Scorecard

### 3.1 Tentang Supplier Rating

Supplier Rating adalah fitur yang memberikan **skor performa otomatis** kepada setiap supplier berdasarkan data transaksi historis. Bukan berdasarkan perasaan atau preferensi pribadi, tapi berdasarkan fakta: apakah barang datang tepat waktu? Apakah jumlahnya sesuai? Apakah harganya kompetitif?

**Manfaat utama:**
- Memilih supplier terbaik berdasarkan data, bukan feeling
- Mendeteksi supplier yang performanya menurun
- Negosiasi lebih kuat — data performa sebagai bahan diskusi
- Keputusan ganti supplier berbasis bukti

### 3.2 4 Kriteria Penilaian

Setiap supplier dinilai berdasarkan 4 kriteria dengan bobot berbeda:

| # | Kriteria | Bobot | Yang Diukur | Sumber Data |
|---|----------|-------|-------------|-------------|
| 1 | **Ketepatan Waktu** | 30% | Apakah barang dikirim sesuai tanggal yang dijanjikan? | Tanggal terima (Receiving) vs tanggal harapan (PO expectedDate) |
| 2 | **Kelengkapan Pesanan** | 25% | Apakah jumlah barang yang diterima sesuai pesanan? | Qty diterima (receivedQty) vs qty dipesan (quantity) pada PO |
| 3 | **Kualitas Barang** | 25% | Seberapa rendah tingkat waste dari barang supplier ini? | Data waste record yang terkait item dari supplier |
| 4 | **Harga Kompetitif** | 20% | Apakah harga supplier ini lebih murah dari rata-rata pasar? | Perbandingan harga per item vs supplier lain |

**Skala skor: 1 sampai 5**

| Skor | Arti | Warna |
|------|------|-------|
| 4.0 – 5.0 | Sangat Baik | Hijau |
| 3.0 – 3.9 | Cukup | Kuning |
| 1.0 – 2.9 | Perlu Perhatian | Merah |

**Cara konversi persentase ke skor (contoh Ketepatan Waktu):**

| Persentase On-Time | Skor |
|--------------------|------|
| 81% – 100% | 5 |
| 61% – 80% | 4 |
| 41% – 60% | 3 |
| 21% – 40% | 2 |
| 0% – 20% | 1 |

**Skor Keseluruhan** = (Ketepatan Waktu × 0.30) + (Kelengkapan × 0.25) + (Kualitas × 0.25) + (Harga × 0.20)

### 3.3 Cara Mengakses

1. Login ke aplikasi sebagai **Admin** atau **Owner**
2. Di sidebar kiri, klik **Pembelian**
3. Klik **Rating Supplier**

**Hak akses:** Hanya role **Owner** dan **Admin** yang dapat mengakses fitur ini.

### 3.4 Halaman Ranking Supplier

Halaman utama menampilkan ranking semua supplier berdasarkan skor keseluruhan:

```
┌──────────────────────────────────────────────────────────────────┐
│  Rating Supplier                                                │
│  Evaluasi performa supplier berdasarkan data transaksi          │
│                                                                 │
│  Dari: [2026-03-20]    Sampai: [2026-06-20]                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ #  Supplier          Skor    Waktu  Lengkap Kualitas     │   │
│  │                      Total                    Harga  PO  │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ 1  PT Sumber Makmur  ████ 4.2  ████  ████   ████   ████ │↑  │
│  │ 2  CV Bahan Segar    ███░ 3.8  ████  ███░   ████   ███░ │↓  │
│  │ 3  UD Rempah Nusa    ███░ 3.5  ███░  ████   ███░   ███░ │─  │
│  │ 4  Toko Bumbu Jaya   ██░░ 2.7  ██░░  ███░   ██░░   ██░░ │↓  │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

**Kolom-kolom:**

| Kolom | Penjelasan |
|-------|-----------|
| **#** | Peringkat (urutan berdasarkan skor tertinggi) |
| **Supplier** | Nama supplier |
| **Skor Total** | Skor keseluruhan (1-5) dengan progress bar berwarna |
| **Waktu** | Skor Ketepatan Waktu (progress bar) |
| **Lengkap** | Skor Kelengkapan Pesanan (progress bar) |
| **Kualitas** | Skor Kualitas Barang (progress bar) |
| **Harga** | Skor Harga Kompetitif (progress bar) |
| **Total PO** | Jumlah Purchase Order dalam periode |
| **Total Nilai** | Total nilai pembelian (Rp) |
| **Trend** | Perubahan performa: ↑ naik (hijau), ↓ turun (merah), — stabil (abu) |

**Interaksi:**
- **Ubah periode** — Gunakan filter tanggal "Dari" dan "Sampai" untuk menganalisis periode tertentu. Default: 3 bulan terakhir.
- **Klik baris supplier** → masuk ke halaman detail supplier

### 3.5 Halaman Detail Supplier

Klik supplier di ranking table untuk melihat detail lengkap:

**A. Radar Chart**

Visualisasi spider web / radar yang menampilkan skor 4 kriteria sekaligus. Semakin luas area yang terisi, semakin baik performa supplier.

```
         Ketepatan Waktu (4.5)
              ╱╲
             ╱  ╲
            ╱ ╱╲ ╲
  Harga    ╱╱    ╲╲   Kelengkapan
  (3.8)   ╱╱      ╲╲   (4.0)
           ╲╲      ╱╱
            ╲╲  ╱╱
             ╲╲╱╱
              ╲╱
         Kualitas (4.2)
```

**B. Score Breakdown Cards**

4 kartu yang menampilkan skor per kriteria dengan progress bar visual:

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Ketepatan    │ │ Kelengkapan  │ │ Kualitas     │ │ Harga        │
│ Waktu        │ │ Pesanan      │ │ Barang       │ │ Kompetitif   │
│    4.5 / 5   │ │    4.0 / 5   │ │    4.2 / 5   │ │    3.8 / 5   │
│ ████████░░   │ │ ████████░░   │ │ ████████░░   │ │ ███████░░░   │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

**C. Riwayat Purchase Order**

Tabel daftar PO dengan status ketepatan waktu:

| PO Number | Tanggal PO | Status | Total (Rp) | Tepat Waktu? |
|-----------|-----------|--------|------------|--------------|
| PO-20260615-001 | 15 Jun 2026 | Completed | Rp 2.500.000 | ✅ Tepat Waktu |
| PO-20260610-003 | 10 Jun 2026 | Completed | Rp 1.800.000 | ⚠️ Terlambat 2 Hari |
| PO-20260605-002 | 5 Jun 2026 | Completed | Rp 3.200.000 | ✅ Tepat Waktu |

**D. Item yang Disuplai**

Tabel item yang dibeli dari supplier ini, beserta perbandingan harga:

| Item | Harga Supplier | Harga Rata-rata Pasar | Status |
|------|---------------|----------------------|--------|
| Ayam Fillet | Rp 35.000/kg | Rp 37.000/kg | 🟢 Di bawah rata-rata |
| Bawang Merah | Rp 28.000/kg | Rp 25.000/kg | 🔴 Di atas rata-rata |
| Minyak Goreng | Rp 18.000/L | Rp 18.500/L | 🟢 Di bawah rata-rata |

### 3.6 Mengambil Keputusan Berdasarkan Rating

#### Supplier Skor ≥ 4.0 (Hijau) — Supplier Utama
- Prioritaskan sebagai supplier utama untuk item kritis
- Pertimbangkan kontrak jangka panjang untuk mengunci harga
- Beri volume pesanan lebih besar

#### Supplier Skor 3.0 – 3.9 (Kuning) — Supplier Pendukung
- Gunakan sebagai alternatif/backup supplier
- Identifikasi kriteria yang lemah dan komunikasikan ke supplier
- Berikan kesempatan perbaikan 1-2 bulan, monitor trennya
- Cocok untuk item non-kritis atau secondary source

#### Supplier Skor < 3.0 (Merah) — Evaluasi Serius
- Jadwalkan meeting dengan supplier untuk diskusi perbaikan
- Cari supplier alternatif sebagai persiapan
- Jika setelah 2 bulan tidak ada perbaikan → pertimbangkan ganti supplier
- **Jangan langsung putus hubungan** — pastikan ada pengganti yang siap

#### Trend Menurun (↓ Merah)
- Meskipun skor masih hijau/kuning, trend turun perlu diwaspadai
- Investigasi: apa yang berubah? Kualitas turun? Pengiriman mulai telat?
- Komunikasikan concern lebih awal sebelum jadi masalah besar

### 3.7 Tips & Best Practices

1. **Review rating minimal 1x per kuartal** — Jadwalkan evaluasi supplier setiap 3 bulan
2. **Gunakan periode 3 bulan** — Data 1 bulan terlalu fluktuatif, 3 bulan lebih representatif
3. **Isi tanggal harapan (expectedDate) di setiap PO** — Jika tidak diisi, skor ketepatan waktu default ke 3 (netral), sehingga rating kurang akurat
4. **Catat waste dengan benar** — Data waste memengaruhi skor kualitas supplier
5. **Bandingkan trend, bukan hanya skor** — Supplier dengan skor 3.8 tapi trend naik mungkin lebih baik dari supplier skor 4.0 tapi trend turun
6. **Gunakan data ini saat negosiasi** — "Data kami menunjukkan 30% pengiriman Anda terlambat" lebih kuat dari keluhan verbal
7. **Jangan hanya mengandalkan skor** — Faktor lain seperti hubungan, fleksibilitas, dan lokasi juga penting

### 3.8 FAQ Supplier Rating

**Q: Kenapa skor supplier saya semua 3.0?**
A: Kemungkinan besar karena data belum cukup. Jika tidak ada PO di periode yang dipilih, sistem memberikan skor default 3 (netral). Pastikan periode mencakup transaksi yang cukup.

**Q: Kenapa skor Ketepatan Waktu default 3?**
A: Jika PO tidak memiliki tanggal harapan pengiriman (expectedDate tidak diisi), sistem tidak bisa mengukur apakah pengiriman tepat waktu atau tidak, sehingga default ke 3.

**Q: Kenapa skor Kualitas default 4?**
A: Jika tidak ada data waste yang terkait item dari supplier tersebut, sistem mengasumsikan kualitas baik (skor 4). Skor akan menyesuaikan setelah ada data waste.

**Q: Bagaimana cara meningkatkan akurasi rating?**
A: Tiga hal utama: (1) Selalu isi expectedDate di PO, (2) Catat semua penerimaan barang (receiving) dengan jumlah aktual, (3) Catat waste dan kaitkan dengan batch/item dari supplier.

**Q: Trend UP/DOWN/STABLE dihitung bagaimana?**
A: Sistem membandingkan skor keseluruhan di periode yang Anda pilih vs periode sebelumnya yang sama panjangnya. Jika selisih > 0.3 poin → UP/DOWN, jika ≤ 0.3 → STABLE.

**Q: Bisakah saya melihat rating untuk 1 supplier saja?**
A: Ya, klik baris supplier di ranking table untuk masuk ke halaman detail dengan radar chart, riwayat PO, dan perbandingan harga per item.

---

## 4. Histori & Alert Harga Bahan

### 4.1 Tentang Histori Harga

Fitur Histori Harga melacak pergerakan harga setiap bahan baku dari waktu ke waktu. Setiap kali Anda menerima barang (receiving), harga dari PO tersebut otomatis tercatat dalam database histori.

**Manfaat utama:**
- Melihat trend harga bahan (naik/turun/stabil) dalam grafik
- Mendapat **alert otomatis** ketika harga naik lebih dari 10%
- Membandingkan harga dari supplier berbeda untuk item yang sama
- Data untuk negosiasi harga dengan supplier
- Mendeteksi kenaikan harga abnormal sebelum berdampak besar ke food cost

### 4.2 Cara Data Harga Terkumpul

Data harga **otomatis tercatat** setiap kali Anda melakukan penerimaan barang (receiving). Anda **tidak perlu input manual**.

```
Alur otomatis:
                                                  ┌──────────────┐
Buat PO → Terima Barang (Receiving) → Sistem ──→  │ PriceHistory │
   │            │                       catat     │   Database   │
   │            │                       harga     └──────┬───────┘
   │            │                                        │
   │            │                                        ▼
   │            │                              Cek: harga naik >10%?
   │            │                                   │         │
   │            │                                  Ya        Tidak
   │            │                                   │         │
   │            │                                   ▼         ▼
   │            │                             Kirim Alert   (selesai)
   │            │                             ke Purchaser
   │            │                             & Owner
```

**Yang dicatat per receiving:**
- Item apa
- Dari supplier mana
- Harga berapa per satuan
- Jumlah yang diterima
- Tanggal terima
- Referensi PO

### 4.3 Halaman Histori & Alert Harga

**Cara mengakses:**
1. Login ke aplikasi
2. Di sidebar kiri, klik **Stok Gudang**
3. Klik **Histori Harga**

**Hak akses:** Role **Owner**, **Admin**, dan **Purchaser**.

**A. Summary Cards**

4 kartu ringkasan di bagian atas:

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ 📦 Total Item    │ │ 📈 Harga Naik    │ │ 📉 Harga Turun   │ │ 📊 Rata-rata     │
│    Terlacak      │ │    >10%          │ │    >10%          │ │    Perubahan     │
│       45         │ │       3          │ │       2          │ │     +2.5%        │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```

| Card | Penjelasan |
|------|-----------|
| **Total Item Terlacak** | Jumlah item unik yang sudah punya data histori harga |
| **Harga Naik >10%** | Jumlah item yang harganya naik lebih dari 10% dari rata-rata 30 hari (merah, perlu perhatian) |
| **Harga Turun >10%** | Jumlah item yang harganya turun lebih dari 10% (hijau, kabar baik) |
| **Rata-rata Perubahan** | Rata-rata persentase perubahan harga seluruh item |

**B. Tabel Alert Harga**

Di bawah summary cards, terdapat tabel item dengan perubahan harga signifikan:

```
┌──────────────────────────────────────────────────────────────────┐
│  Item            Harga Saat Ini  Rata-rata 30h  Perubahan  Aksi │
├──────────────────────────────────────────────────────────────────┤
│  Ayam Fillet     Rp 38.000      Rp 33.000      ↑ +15.2%   [→]  │  ← Merah
│  Bawang Putih    Rp 42.000      Rp 37.500      ↑ +12.0%   [→]  │  ← Merah
│  Minyak Goreng   Rp 16.000      Rp 18.000      ↓ -11.1%   [→]  │  ← Hijau
└──────────────────────────────────────────────────────────────────┘
```

| Kolom | Penjelasan |
|-------|-----------|
| **Item** | Nama bahan baku |
| **Harga Saat Ini** | Harga beli terakhir (dari receiving terakhir) |
| **Rata-rata 30 Hari** | Rata-rata harga beli dalam 30 hari terakhir |
| **Perubahan** | Persentase perubahan: merah + ↑ untuk kenaikan, hijau + ↓ untuk penurunan |
| **Aksi** | Klik untuk masuk ke halaman detail harga item |

**Interaksi:**
- **Pagination** — Jika item banyak, gunakan tombol halaman di bawah tabel
- **Klik baris / tombol aksi** → masuk ke halaman detail harga item

### 4.4 Halaman Detail Harga Item

Klik item dari tabel alert untuk melihat detail lengkap pergerakan harga:

**A. Statistik Harga (5 Cards)**

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Harga       │ │ Rata-rata   │ │ Harga       │ │ Harga       │ │ Perubahan   │
│ Saat Ini    │ │ 30 Hari     │ │ Terendah    │ │ Tertinggi   │ │ 30 Hari     │
│ Rp 38.000   │ │ Rp 33.000   │ │ Rp 30.000   │ │ Rp 40.000   │ │  +15.2%     │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

| Card | Penjelasan |
|------|-----------|
| **Harga Saat Ini** | Harga beli terakhir dari receiving paling baru |
| **Rata-rata 30 Hari** | Rata-rata harga dalam 30 hari terakhir |
| **Harga Terendah** | Harga paling murah yang pernah tercatat (dalam periode yang ditampilkan) |
| **Harga Tertinggi** | Harga paling mahal yang pernah tercatat |
| **Perubahan 30 Hari** | Persentase kenaikan/penurunan harga saat ini vs rata-rata 30 hari. Merah jika naik, hijau jika turun. |

**B. Grafik Trend Harga (Line Chart)**

Grafik garis menampilkan pergerakan harga selama 6 bulan terakhir:

```
  Harga (Rp)
  40.000 ┤                                          ●
  38.000 ┤                                     ●  ╱
  36.000 ┤                               ●   ╱  ╱
  34.000 ┤              ●───●       ●───●╱  ╱
  32.000 ┤         ●──╱                   ╱
  30.000 ┤    ●──●╱                      ╱  ← Supplier A (biru)
  28.000 ┤                          ●──●    ← Supplier B (hijau)
         └─────────────────────────────────→
          Jan   Feb   Mar   Apr   Mei  Jun
```

**Fitur grafik:**
- **Garis berbeda warna** untuk setiap supplier (jika item dibeli dari lebih dari 1 supplier)
- **Hover pada titik** → tooltip menampilkan tanggal, harga, nama supplier
- **Legend** di bawah grafik menunjukkan supplier mana yang diwakili garis mana
- Default menampilkan 6 bulan terakhir

**C. Tabel Perbandingan Supplier**

Perbandingan harga antar supplier untuk item yang sama:

```
┌────────────────────────────────────────────────────────────────┐
│  Supplier          Harga      Rata-rata  Terendah  Tertinggi  │
│                    Terakhir                                    │
├────────────────────────────────────────────────────────────────┤
│  PT Sumber Makmur  Rp 35.000  Rp 33.500  Rp 30.000 Rp 37.000 │ ← Hijau (termurah)
│  CV Bahan Segar    Rp 38.000  Rp 36.000  Rp 33.000 Rp 40.000 │
│  UD Rempah Nusa    Rp 39.000  Rp 37.500  Rp 35.000 Rp 42.000 │
└────────────────────────────────────────────────────────────────┘
```

- Supplier dengan harga terakhir **paling murah** di-highlight **hijau**
- Tabel diurutkan dari harga termurah ke termahal
- Gunakan data ini untuk memutuskan dari supplier mana sebaiknya membeli

### 4.5 Alert Harga Otomatis

Sistem secara otomatis mengirim notifikasi ketika mendeteksi kenaikan harga abnormal:

**Kapan alert dikirim?**
Setiap kali barang diterima (receiving), sistem otomatis:
1. Mencatat harga ke database histori
2. Menghitung rata-rata harga 30 hari terakhir untuk item tersebut
3. Jika harga saat ini **lebih dari 10% di atas rata-rata** → kirim notifikasi

**Contoh:**
- Rata-rata harga Ayam Fillet 30 hari terakhir: Rp 33.000/kg
- Harga pada receiving hari ini: Rp 38.000/kg
- Kenaikan: (38.000 - 33.000) / 33.000 × 100% = **+15.2%**
- Karena > 10% → **Alert dikirim!**

**Siapa yang menerima alert?**

| Role | Menerima Alert? |
|------|----------------|
| Purchaser | ✅ Ya |
| Owner | ✅ Ya |
| Admin | ❌ Tidak |
| Kitchen Manager | ❌ Tidak |

**Di mana alert muncul?**
- Notification Bell (🔔) di header — dengan ikon 📈 (TrendingUp) berwarna merah
- Halaman Notifikasi (/notifikasi)

**Contoh notifikasi:**
```
📈 Kenaikan Harga: Ayam Fillet
Harga Ayam Fillet naik 15.2% dari rata-rata 30 hari
(Rp 38.000 vs rata-rata Rp 33.000). Supplier: PT Sumber Makmur
```

### 4.6 Strategi Berdasarkan Data Harga

#### Kenaikan Harga > 10%
1. **Cek apakah kenaikan terjadi di semua supplier** — Buka detail item, lihat tabel perbandingan
   - Jika semua supplier naik → kemungkinan harga pasar memang naik
   - Jika hanya 1 supplier → coba beralih ke supplier yang lebih murah
2. **Evaluasi dampak ke food cost** — Cek di Menu Engineering, apakah menu yang menggunakan bahan ini masih profitable
3. **Negosiasi dengan supplier** — Gunakan data histori sebagai bahan: "Harga Anda naik 15% dalam sebulan terakhir, supplier lain masih di harga Rp 35.000"
4. **Pertimbangkan substitusi bahan** — Jika kenaikan permanen, cari bahan pengganti yang lebih murah

#### Menemukan Supplier Termurah
1. Buka halaman detail item
2. Lihat tabel Perbandingan Supplier
3. Supplier yang di-highlight hijau = harga termurah saat ini
4. Pertimbangkan juga skor Supplier Rating — harga murah tapi sering telat/jumlah kurang bisa lebih mahal secara total

#### Trend Harga Musiman
1. Gunakan grafik trend 6 bulan untuk mengidentifikasi pola
2. Contoh: harga cabai biasanya naik saat musim hujan
3. Strategi: **beli lebih banyak** sebelum periode kenaikan harga yang sudah diprediksi
4. Setelah beberapa bulan data terkumpul, pola ini akan lebih jelas terlihat

### 4.7 FAQ Histori Harga

**Q: Apakah saya harus input data harga secara manual?**
A: Tidak. Data harga **otomatis tercatat** setiap kali Anda melakukan penerimaan barang (receiving). Harga diambil dari PO item yang terkait.

**Q: Kenapa halaman histori harga masih kosong?**
A: Data histori harga mulai terisi setelah ada proses receiving yang tercatat di sistem. Jika Anda baru mulai menggunakan aplikasi, data akan terkumpul seiring waktu.

**Q: Alert hanya muncul untuk kenaikan harga, bagaimana dengan penurunan?**
A: Saat ini alert otomatis hanya dikirim untuk **kenaikan** > 10%. Penurunan harga tetap terlihat di tabel alert (warna hijau) tapi tidak memicu notifikasi push, karena penurunan harga biasanya kabar baik yang tidak memerlukan aksi urgent.

**Q: Harga rata-rata 30 hari dihitung dari data apa?**
A: Dari semua data PriceHistory (semua receiving) untuk item tersebut dalam 30 hari terakhir, tanpa memandang supplier. Ini memberikan gambaran "harga pasar" yang komprehensif.

**Q: Bisakah saya melihat histori harga lebih dari 6 bulan?**
A: Default grafik menampilkan 6 bulan. Data histori tersimpan permanen di database — fitur untuk menyesuaikan rentang waktu grafik akan tersedia di update berikutnya.

**Q: Bagaimana hubungan fitur ini dengan Supplier Rating?**
A: Kedua fitur saling melengkapi:
- **Histori Harga** → fokus pada trend harga per item
- **Supplier Rating** → skor kompetitif harga adalah salah satu dari 4 kriteria penilaian supplier
- Data dari PriceHistory digunakan oleh Supplier Rating untuk menghitung skor "Harga Kompetitif"

**Q: Apa yang terjadi jika supplier menaikkan harga tapi saya sudah terlanjur approve PO?**
A: Alert muncul saat **receiving** (terima barang), bukan saat buat PO. Jadi Anda bisa mengetahui kenaikan harga sebelum receiving berikutnya dan negosiasi ulang.

---

## 5. Forecasting Kebutuhan Bahan Baku

### 5.1 Tentang Forecasting

Forecasting adalah fitur yang **memprediksi kebutuhan bahan baku** untuk beberapa hari ke depan berdasarkan pola produksi historis. Sistem menganalisis data produksi 60 hari terakhir, mengenali pola per hari dalam seminggu, dan memperhitungkan event musiman (Ramadhan, liburan, promo) untuk menghasilkan prediksi akurat.

**Manfaat utama:**
- Tahu persis berapa banyak bahan yang dibutuhkan minggu depan
- Tidak kehabisan stok (stockout) — sistem menghitung safety stock
- Tidak over-stock — beli sesuai kebutuhan aktual
- **Auto-generate Draft PO** langsung dari hasil prediksi — hemat waktu purchaser
- Lacak akurasi prediksi vs aktual — sistem makin akurat seiring waktu

**Siapa yang menggunakan:**
- **Owner/Admin** — melihat prediksi, menyetujui PO yang di-generate
- **Purchaser** — menggunakan prediksi untuk perencanaan pembelian, generate draft PO
- **Kitchen Manager** — melihat prediksi untuk perencanaan produksi

### 5.2 Cara Kerja Algoritma Prediksi

Sistem menggunakan pendekatan **statistik terapan** (bukan AI/ML) agar transparan dan mudah dipahami:

```
Langkah 1: Kumpulkan Data
   ↓ Ambil semua data produksi 60 hari terakhir
   ↓ Hitung konsumsi bahan per hari

Langkah 2: Pola Hari (Day-of-Week)
   ↓ Kelompokkan per hari (Senin-Minggu)
   ↓ Hitung rata-rata konsumsi per hari
   ↓ Contoh: Jumat selalu lebih ramai → prediksi Jumat lebih tinggi

Langkah 3: Faktor Musiman
   ↓ Cek apakah ada event aktif di tanggal prediksi
   ↓ Ramadhan: kalikan 1.4× (naik 40%)
   ↓ Libur Lebaran: kalikan 0.3× (turun 70%)

Langkah 4: Safety Stock
   ↓ Hitung variabilitas konsumsi (standar deviasi)
   ↓ Safety stock = 1.65 × σ × √(3 hari lead time)
   ↓ Buffer cadangan untuk antisipasi lonjakan tak terduga

Langkah 5: Hitung Kekurangan
   ↓ Total dibutuhkan = Prediksi demand + Safety stock
   ↓ Kekurangan = max(0, Total dibutuhkan - Stok saat ini)
```

**Contoh perhitungan:**
- Ayam Fillet, prediksi 7 hari ke depan = 15 kg
- Safety stock = 4.5 kg (karena konsumsi cukup fluktuatif)
- Total dibutuhkan = 15 + 4.5 = **19.5 kg**
- Stok saat ini = 8 kg
- **Kekurangan = 19.5 − 8 = 11.5 kg** → perlu beli 11.5 kg

### 5.3 Dashboard Prediksi Kebutuhan

**Cara mengakses:**
1. Login ke aplikasi
2. Di sidebar kiri, klik **Produksi**
3. Klik **Prediksi Bahan**

**Tampilan halaman:**

```
┌──────────────────────────────────────────────────────────────┐
│  Prediksi Kebutuhan Bahan                                    │
│  Prediksi kebutuhan bahan berdasarkan data historis          │
│                                                              │
│  Horizon: [7 Hari ▼]              [🛒 Generate Draft PO]    │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Total    │ │ Perlu    │ │Confidence│ │ Musiman  │       │
│  │ Item     │ │ Restock  │ │          │ │ Aktif    │       │
│  │   18     │ │    6     │ │ T:8 S:7  │ │    2     │       │
│  └──────────┘ └──────────┘ │ R:3     │ └──────────┘       │
│                             └──────────┘                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Item          Stok   Prediksi Safety  Total  Kurang  │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Ayam Fillet    8kg    15kg    4.5kg  19.5kg  11.5kg  │ ← merah
│  │ Bawang Merah   3kg    8kg     2.1kg  10.1kg   7.1kg  │ ← merah
│  │ Cabai Keriting 2kg    5kg     1.8kg   6.8kg   4.8kg  │ ← merah
│  │ Beras Premium 60kg   30kg    5.2kg  35.2kg   Cukup  │ ← normal
│  │ Minyak Goreng 20kg   12kg    3.0kg  15.0kg   Cukup  │ ← normal
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

**Penjelasan kolom tabel:**

| Kolom | Penjelasan |
|-------|-----------|
| **Item** | Nama bahan + SKU |
| **Kategori** | Kategori bahan (Protein, Bumbu, dll) |
| **Stok Saat Ini** | Jumlah stok yang tersedia di gudang |
| **Prediksi N Hari** | Perkiraan total konsumsi dalam N hari ke depan |
| **Safety Stock** | Buffer cadangan untuk antisipasi fluktuasi |
| **Total Dibutuhkan** | Prediksi + Safety Stock |
| **Kekurangan** | Selisih antara total dibutuhkan dan stok saat ini. Merah jika > 0, "Cukup" (hijau) jika stok mencukupi |
| **Confidence** | Tingkat keyakinan prediksi: **Tinggi** (hijau), **Sedang** (kuning), **Rendah** (merah) |
| **Musiman** | Faktor musiman yang aktif (mis. "Promo Steak", "Ramadhan") |

**Pengaturan horizon:**
- **7 Hari** — Untuk pembelian mingguan rutin
- **14 Hari** — Untuk perencanaan 2 minggu ke depan
- **30 Hari** — Untuk perencanaan bulanan / stok besar

### 5.4 Detail Prediksi Per Item

Klik tombol **Detail** (ikon mata) pada baris item di tabel untuk melihat analisis mendalam:

**A. Kartu Statistik (5 kartu)**

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Rata-rata│ │ Std Dev  │ │Variabili-│ │ Safety   │ │Confidence│
│ Harian   │ │          │ │  tas     │ │ Stock    │ │          │
│ 2.14 kg  │ │ 0.85 kg  │ │  39.7%   │ │ 2.43 kg  │ │ SEDANG   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

| Kartu | Penjelasan |
|-------|-----------|
| **Rata-rata Harian** | Konsumsi rata-rata bahan ini per hari (dari 60 hari data) |
| **Standar Deviasi** | Seberapa besar variasi konsumsi dari rata-rata. Semakin kecil = semakin stabil |
| **Variabilitas** | Coefficient of Variation (CV) = σ/μ × 100%. Semakin rendah = semakin predictable |
| **Safety Stock** | Buffer cadangan yang dihitung sistem. Makin fluktuatif → safety stock makin besar |
| **Confidence** | Level keyakinan prediksi berdasarkan jumlah data dan variabilitas |

**B. Grafik Prediksi Harian (Bar Chart)**

```
  Prediksi (kg)
  3.5 ┤      ██
  3.0 ┤  ██  ██     ██
  2.5 ┤  ██  ██  ██ ██  ██
  2.0 ┤  ██  ██  ██ ██  ██  ██
  1.5 ┤  ██  ██  ██ ██  ██  ██  ▓▓  ← oranye = ada faktor musiman
  1.0 ┤  ██  ██  ██ ██  ██  ██  ▓▓
      └──────────────────────────────
       Sen  Sel  Rab  Kam  Jum  Sab  Min
```

- **Biru** (default): prediksi normal
- **Oranye**: ada faktor musiman aktif (multiplier > 1)
- **Biru muda**: ada faktor musiman penurunan (multiplier < 1)
- Hover pada bar → lihat detail: tanggal, hari, prediksi qty, multiplier musiman

**C. Pola Hari dalam Seminggu (Bar Chart)**

Menampilkan rata-rata konsumsi per hari. Berguna untuk memahami pola:
- Hari apa yang paling ramai? (bar tertinggi, di-highlight)
- Hari apa yang paling sepi?
- Apakah ada pola weekend vs weekday?

**D. Histori Konsumsi (Area Chart)**

Grafik area menampilkan konsumsi aktual 30 hari terakhir. Gunakan untuk:
- Melihat apakah ada tren naik/turun
- Mengidentifikasi outlier (hari yang konsumsinya sangat tinggi/rendah)
- Membandingkan visual pola dengan prediksi

### 5.5 Auto-Generate Draft PO

Fitur ini membuat Draft Purchase Order otomatis berdasarkan hasil prediksi kekurangan stok.

**Cara menggunakan:**

1. Di halaman Prediksi Kebutuhan, pastikan horizon sesuai (7/14/30 hari)
2. Review tabel — lihat item mana yang kekurangan stok (kolom "Kekurangan" merah)
3. Klik tombol **"Generate Draft PO"** (ikon keranjang belanja)
4. Muncul dialog konfirmasi:
   ```
   ┌─────────────────────────────────────────────┐
   │  Generate Draft PO                           │
   │                                              │
   │  Ini akan membuat Draft PO untuk semua item  │
   │  yang kekurangan stok berdasarkan prediksi   │
   │  7 hari ke depan. Lanjutkan?                 │
   │                                              │
   │              [Batal]  [Ya, Generate]          │
   └─────────────────────────────────────────────┘
   ```
5. Klik **"Ya, Generate"**
6. Sistem akan:
   - Menghitung qty yang perlu dibeli per item (= kekurangan)
   - Menentukan supplier terbaik per item (dari histori harga — termurah/terbaru)
   - Mengelompokkan item per supplier
   - Membuat 1 Draft PO per supplier
7. Muncul notifikasi sukses: "3 Draft PO berhasil dibuat"
8. Buka menu **Pembelian → Purchase Order** untuk mereview dan approve PO yang dibuat

**Yang terjadi di balik layar:**

```
Prediksi: 6 item kekurangan stok
  ↓
Tentukan supplier per item (dari PriceHistory):
  - Ayam Fillet → PT Sumber Makmur (termurah)
  - Udang Kupas → PT Sumber Makmur
  - Bawang Merah → UD Rempah Nusantara
  - Cabai Merah → UD Rempah Nusantara
  - Kentang → CV Bahan Segar
  - Wortel → CV Bahan Segar
  ↓
Group per supplier → 3 Draft PO:
  - PO-20260621-012: PT Sumber Makmur (Ayam + Udang)
  - PO-20260621-013: UD Rempah Nusantara (Bawang + Cabai)
  - PO-20260621-014: CV Bahan Segar (Kentang + Wortel)
```

**Penting:**
- PO dibuat dengan status **DRAFT** — Anda masih bisa edit qty/harga sebelum submit
- Harga per item menggunakan `lastPrice` dari data terakhir
- Sistem juga menyimpan snapshot prediksi di database untuk tracking akurasi nanti

### 5.6 Faktor Musiman (Seasonal Factors)

Faktor musiman memungkinkan Anda mengonfigurasi event yang memengaruhi volume produksi, sehingga prediksi lebih akurat.

**Cara mengakses:**
1. Di sidebar, klik **Pengaturan**
2. Klik **Faktor Musiman**

**Halaman faktor musiman:**

```
┌──────────────────────────────────────────────────────────────┐
│  Faktor Musiman                         [+ Tambah Faktor]    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Nama                Periode           Multiplier  Scope│  │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Ramadhan 2026      18 Feb - 19 Mar    +40%     Global│  │
│  │ Libur Lebaran      20 Mar - 25 Mar    -70%     Global│  │
│  │ Liburan Sekolah    1 Jul - 15 Jul     +20%     Global│  │
│  │ Promo Steak        16 Jun - 1 Jul     +50%   Kategori│  │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

**Membuat faktor musiman baru:**

1. Klik **"Tambah Faktor"**
2. Isi form:
   - **Nama**: Nama event (mis. "Ramadhan 2026", "Promo Akhir Tahun")
   - **Tanggal Mulai**: Kapan event dimulai
   - **Tanggal Selesai**: Kapan event berakhir
   - **Multiplier**: Angka pengali produksi
     - `1.0` = normal (tidak ada perubahan)
     - `1.5` = naik 50%
     - `0.5` = turun 50%
     - `1.2` = naik 20%
     - `0.3` = turun 70%
   - **Scope**: 
     - **Global** = berlaku untuk semua bahan
     - **Per Kategori** = hanya berlaku untuk kategori resep tertentu
   - **Kategori** (jika scope = Per Kategori): pilih kategori resep
   - **Catatan**: penjelasan opsional

**Contoh faktor musiman yang umum:**

| Event | Multiplier | Penjelasan |
|-------|-----------|-----------|
| Ramadhan | 1.3 – 1.5 | Peningkatan menu buka puasa |
| Libur Lebaran | 0.2 – 0.4 | Tutup/minimal operasi |
| Natal & Tahun Baru | 1.2 – 1.4 | Peningkatan pesanan |
| Liburan Sekolah | 1.1 – 1.2 | Sedikit peningkatan |
| Weekend Promo | 1.3 – 1.5 | Promo khusus weekend |
| Catering Event | 1.5 – 2.0 | Pesanan catering besar |
| Musim Hujan | 0.8 – 0.9 | Pengunjung sedikit berkurang |

### 5.7 Akurasi Prediksi

Halaman akurasi menunjukkan seberapa tepat prediksi sistem dibandingkan konsumsi aktual.

**Cara mengakses:**
1. Di halaman Prediksi Kebutuhan, klik link **"Akurasi"** atau
2. Akses langsung: `/produksi/forecasting/akurasi`

**Metrik yang ditampilkan:**

| Metrik | Penjelasan | Target |
|--------|-----------|--------|
| **Akurasi Keseluruhan** | 100% − MAPE. Semakin tinggi semakin baik | > 85% |
| **MAPE** | Mean Absolute Percentage Error — rata-rata error prediksi | < 15% |
| **Total Prediksi** | Jumlah forecast record yang sudah direkonsiliasi | — |

**Interpretasi akurasi per item:**

| Akurasi | Status | Warna | Arti |
|---------|--------|-------|------|
| > 85% | Akurat | Hijau | Prediksi sangat baik, bisa diandalkan |
| 70-85% | Cukup | Kuning | Prediksi cukup, masih bisa dipakai dengan safety stock |
| < 70% | Perlu Perbaikan | Merah | Prediksi kurang akurat, review pola konsumsi item ini |

**Tombol "Rekonsiliasi":**
- Klik untuk memperbarui data aktual pada prediksi yang sudah lewat
- Sistem membandingkan prediksi yang disimpan saat generate PO dengan konsumsi aktual dari data produksi
- Lakukan rekonsiliasi minimal 1x per minggu untuk data akurasi yang up-to-date

### 5.8 Memahami Safety Stock

Safety stock adalah **buffer cadangan** yang dihitung sistem untuk mengantisipasi variasi konsumsi yang tidak terduga.

**Rumus:**
```
Safety Stock = Z × σ × √(Lead Time)

Dimana:
  Z = 1.65 (target service level 95% — artinya 95% kemungkinan stok mencukupi)
  σ = Standar deviasi konsumsi harian
  Lead Time = 3 hari (waktu dari order ke barang diterima)
```

**Contoh:**
- Ayam Fillet: σ = 1.5 kg/hari
- Safety Stock = 1.65 × 1.5 × √3 = **4.29 kg**
- Artinya: simpan cadangan 4.29 kg di atas prediksi untuk 95% jaminan tidak kehabisan

**Faktor yang memengaruhi safety stock:**
- **Semakin fluktuatif konsumsi** → safety stock semakin besar
- **Semakin lama lead time** → safety stock semakin besar
- Item stabil (seperti beras) → safety stock kecil
- Item fluktuatif (seperti cabai) → safety stock besar

### 5.9 Tips & Best Practices

1. **Mulai dengan horizon 7 hari** — Prediksi jangka pendek lebih akurat. Gunakan 14-30 hari hanya untuk perencanaan makro.

2. **Butuh minimal 2 minggu data produksi** — Prediksi baru bermakna setelah ada cukup data historis. Semakin banyak data (30-60 hari), semakin akurat.

3. **Selalu input produksi harian** — Jika ada hari yang tidak dicatat produksinya, prediksi untuk hari itu akan kurang akurat karena sistem menganggap tidak ada konsumsi.

4. **Setup faktor musiman sebelum event dimulai** — Masukkan Ramadhan, Natal, promo, dll minimal 1 minggu sebelumnya agar prediksi sudah memperhitungkan.

5. **Review Draft PO sebelum approve** — Auto-generate PO adalah rekomendasi, bukan keputusan final. Selalu review qty dan harga sebelum approve.

6. **Lakukan rekonsiliasi mingguan** — Klik "Rekonsiliasi" di halaman akurasi setiap minggu untuk update data aktual. Ini membantu memonitor apakah prediksi masih akurat.

7. **Perhatikan confidence level** — Item dengan confidence "RENDAH" mungkin perlu penyesuaian manual. Cek detailnya untuk memahami kenapa.

8. **Bandingkan beberapa horizon** — Cek 7 hari dan 14 hari. Jika hasilnya sangat berbeda, ada variabilitas tinggi yang perlu dicermati.

9. **Gunakan bersama Menu Engineering** — Jika Menu Engineering menunjukkan menu "Dog" (tidak laku), bahan eksklusif menu tersebut bisa diabaikan dalam forecast untuk mengurangi waste.

10. **Sistem makin pintar seiring waktu** — Semakin banyak data produksi terkumpul, pola day-of-week semakin akurat, dan confidence meningkat.

### 5.10 FAQ Forecasting

**Q: Kenapa halaman prediksi kosong (tidak ada item)?**
A: Belum ada data produksi yang tercatat di sistem. Prediksi membutuhkan minimal beberapa catatan produksi harian agar bisa menghitung pola konsumsi bahan.

**Q: Apa bedanya "Prediksi" dan "Total Dibutuhkan"?**
A: "Prediksi" adalah perkiraan konsumsi murni. "Total Dibutuhkan" = Prediksi + Safety Stock. Selalu gunakan "Total Dibutuhkan" untuk menentukan jumlah pembelian karena sudah termasuk buffer keamanan.

**Q: Kenapa confidence saya "RENDAH"?**
A: Dua kemungkinan:
1. **Data kurang** — Belum ada cukup data produksi (butuh minimal 15 hari). Terus catat produksi harian, confidence akan meningkat.
2. **Konsumsi sangat fluktuatif** — Variasi konsumsi terlalu tinggi (CV > 100%). Item ini mungkin memang tidak predictable (dipakai hanya untuk event tertentu).

**Q: Auto-generate PO memilih supplier berdasarkan apa?**
A: Sistem mencari supplier terakhir yang menyuplai item tersebut dari data histori harga (PriceHistory). Jika ada beberapa supplier, dipilih yang harganya paling murah. Jika tidak ada histori, item dilewati.

**Q: Faktor musiman bertumpuk (ada 2 event di tanggal yang sama), bagaimana?**
A: Multiplier dikalikan berurutan. Jika ada "Ramadhan (1.4×)" dan "Promo Steak (1.5×)" di tanggal yang sama, prediksi = base × 1.4 × 1.5 = base × 2.1 (naik 110%).

**Q: Apakah forecast otomatis jalan setiap hari?**
A: Tidak, forecast dihitung **on-demand** saat Anda membuka halaman atau klik Generate PO. Tidak ada job otomatis yang berjalan di background. Ini membuat Anda selalu melihat prediksi paling up-to-date.

**Q: Bagaimana lead time 3 hari ditentukan?**
A: 3 hari adalah default berdasarkan asumsi umum waktu dari order ke barang diterima. Saat ini belum bisa dikonfigurasi per item — akan tersedia di update berikutnya.

**Q: Kenapa prediksi hari Minggu selalu rendah/nol?**
A: Karena data produksi historis Anda menunjukkan tidak ada atau sedikit produksi di hari Minggu. Sistem belajar dari pola aktual Anda — jika dapur tutup Minggu, prediksi Minggu memang 0.

**Q: Bisakah saya mengedit prediksi secara manual?**
A: Tidak, prediksi dihitung otomatis. Tapi Anda bisa mengedit Draft PO yang dihasilkan — ubah qty, hapus item, atau tambah item secara manual sebelum approve.

**Q: Berapa persen akurasi yang normal?**
A: Untuk industri F&B dengan pola harian yang konsisten, akurasi 80-90% (MAPE 10-20%) dianggap sangat baik. Akurasi 70-80% masih cukup baik. Di bawah 70%, perlu evaluasi — mungkin ada event yang belum dimasukkan sebagai faktor musiman.

---

## 6. Meal Prep Planner

### 6.1 Tentang Meal Prep Planner

Meal Prep Planner adalah fitur **perencanaan produksi mingguan** yang memungkinkan Anda menjadwalkan menu apa akan diproduksi di hari apa, berapa porsi, lalu otomatis menghitung kebutuhan bahan dan membuat daftar belanja.

**Analogi sederhana:**
Bayangkan papan whiteboard di dapur yang berisi jadwal masak minggu ini. Meal Prep Planner adalah versi digitalnya — dengan bonus otomatis menghitung apakah stok bahan cukup dan membuat PO belanja jika kurang.

**Manfaat utama:**
- **Produksi terencana** — tahu apa yang harus dimasak setiap hari, tidak ada kebingungan pagi hari
- **Belanja terkonsolidasi** — total kebutuhan bahan dari seluruh minggu dihitung sekaligus, beli 1x bukan harian
- **Cek stok otomatis** — langsung tahu bahan apa yang kurang sebelum mulai produksi
- **Template reusable** — jadwal minggu ini bisa disimpan dan dipakai lagi minggu depan
- **Saran cerdas** — sistem merekomendasikan jadwal berdasarkan pola produksi historis

### 6.2 Cara Mengakses

1. Login ke aplikasi
2. Di sidebar kiri, klik **Produksi**
3. Klik **Meal Prep**

**Hak akses:** Semua role (Owner, Admin, Purchaser, Kitchen Manager) dapat mengakses fitur ini.

**Halaman terkait:**
- `/produksi/meal-plan` — Halaman utama (planning board)
- `/pengaturan/meal-plan-template` — Manajemen template (di Pengaturan → Template Meal Plan)

### 6.3 Membuat Jadwal Baru

Jika belum ada jadwal untuk minggu yang dipilih:

1. Navigasi ke minggu yang diinginkan menggunakan tombol `<` (sebelumnya) atau `>` (berikutnya)
2. Halaman akan menampilkan pesan "Belum ada jadwal untuk minggu ini"
3. Klik **"Buat Jadwal Baru"**
4. Isi form:
   - **Nama Jadwal**: mis. "Jadwal Minggu 22-28 Jun"
   - **Kapasitas Maksimum per Hari**: batas porsi per hari (default 200)
5. Klik **Simpan**
6. Jadwal baru dibuat dengan status **DRAFT** — siap diisi menu

**Alternatif:** Klik **"Terapkan Template"** untuk membuat jadwal dari template yang sudah tersimpan.

### 6.4 Weekly Board — Tampilan Mingguan

Tampilan utama adalah **papan 7 kolom** mewakili Senin sampai Minggu:

```
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│  SENIN   │  SELASA  │  RABU    │  KAMIS   │  JUMAT   │  SABTU   │  MINGGU  │
│  22 Jun  │  23 Jun  │  24 Jun  │  25 Jun  │  26 Jun  │  27 Jun  │  28 Jun  │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│┌────────┐│┌────────┐│┌────────┐│┌────────┐│┌────────┐│┌────────┐│          │
││🍳 Nasi ││ │🍗 Ayam ││ │🍳 Nasi ││ │🦐 Udang││ │🍳 Nasi ││ │🥩 Steak││          │
││ Goreng  ││ │ Geprek ││ │ Kuning ││ │ Padang ││ │ Goreng ││ │ Sapi  ││          │
││ 50 porsi││ │55 porsi││ │40 porsi││ │20 porsi││ │60 porsi││ │20 porsi││          │
││Rp 9.500 ││ │Rp 8.200││ │Rp 6.100││ │Rp12.750││ │Rp 9.500││ │Rp27.000││          │
│└────────┘│└────────┘│└────────┘│└────────┘│└────────┘│└────────┘│          │
│┌────────┐│┌────────┐│┌────────┐│┌────────┐│┌────────┐│┌────────┐│          │
││🍗 Ayam ││ │🍲 Sop  ││ │🥩 Steak││ │🐟 Dori ││ │🍗 Ayam ││ │🦐 Udang││          │
││ Geprek  ││ │ Ayam   ││ │ Sapi  ││ │Gor.Tpg ││ │ Geprek ││ │ Padang ││          │
││ 60 porsi││ │35 porsi││ │15 porsi││ │25 porsi││ │70 porsi││ │15 porsi││          │
│└────────┘│└────────┘│└────────┘│└────────┘│└────────┘│└────────┘│          │
│          │          │┌────────┐│┌────────┐│┌────────┐│┌────────┐│          │
│          │          ││ 🧊 Es  ││ │🍟 Nasi ││ │🍟 Kntg ││ │🍟 Kntg ││          │
│          │          ││Teh     ││ │ Kuning ││ │ Goreng ││ │ Goreng ││          │
│          │          ││85 porsi││ │40 porsi││ │40 porsi││ │35 porsi││          │
│          │          │└────────┘│└────────┘│└────────┘│└────────┘│          │
│          │          │          │          │          │          │          │
│[+ Tambah]│[+ Tambah]│[+ Tambah]│[+ Tambah]│[+ Tambah]│[+ Tambah]│[+ Tambah]│
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│Total: 110│Total:  90│Total: 140│Total:  85│Total: 170│Total:  70│Total:   0│
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

**Elemen board:**
- **Header kolom**: nama hari + tanggal. Hari ini di-highlight dengan warna latar
- **Kartu resep**: setiap resep yang dijadwalkan ditampilkan sebagai kartu berisi nama menu, jumlah porsi, dan estimasi biaya per porsi
- **Tombol "+ Tambah"**: di bawah setiap kolom untuk menambah menu baru ke hari tersebut
- **Footer kapasitas**: total porsi per hari. Merah jika melebihi kapasitas maksimum

**Navigasi minggu:**
- Klik `<` untuk mundur 1 minggu
- Klik `>` untuk maju 1 minggu
- Label di tengah menunjukkan rentang tanggal minggu yang sedang dilihat

**Responsif:** Di layar kecil (mobile), board bisa di-scroll horizontal.

### 6.5 Menambah Menu ke Hari

1. Klik tombol **"+ Tambah Menu"** di kolom hari yang diinginkan
2. Dialog muncul dengan form:

```
┌─────────────────────────────────────┐
│  Tambah Menu — Senin 22 Jun         │
│                                     │
│  Resep:    [Pilih resep... ▼]       │
│                                     │
│  Porsi:    [50        ]             │
│                                     │
│  Catatan:  [________________]       │
│            (opsional)               │
│                                     │
│          [Batal]  [Tambah]          │
└─────────────────────────────────────┘
```

3. **Pilih resep** dari dropdown (menampilkan semua resep aktif)
4. **Masukkan jumlah porsi** yang akan diproduksi
5. **Catatan** (opsional): instruksi khusus, mis. "Porsi lebih kecil untuk paket anak"
6. Klik **Tambah**
7. Kartu resep muncul di kolom hari yang dipilih

**Validasi kapasitas:** Jika total porsi per hari sudah melebihi kapasitas maksimum, sistem akan menampilkan peringatan tapi tetap mengizinkan penambahan.

### 6.6 Mengedit dan Menghapus Menu

**Mengedit porsi:**
1. Klik kartu resep yang ingin diedit
2. Dialog edit muncul dengan jumlah porsi saat ini
3. Ubah porsi atau catatan
4. Klik **Simpan**

**Menghapus menu:**
1. Klik tombol **✕** (silang) di pojok kanan atas kartu resep
2. Menu langsung dihapus dari jadwal

**Catatan:** Edit dan hapus hanya bisa dilakukan jika jadwal masih berstatus **DRAFT** atau **ACTIVE**. Jadwal yang sudah **COMPLETED** bersifat read-only.

### 6.7 Kapasitas Produksi Harian

Setiap jadwal memiliki batas **kapasitas porsi per hari** (default: 200 porsi). Ini mewakili kemampuan produksi dapur Anda berdasarkan tenaga kerja, peralatan, dan waktu.

**Indikator kapasitas** di footer setiap kolom:

| Total Porsi vs Kapasitas | Warna | Arti |
|--------------------------|-------|------|
| < 80% kapasitas | Normal (default) | Masih banyak ruang |
| 80% – 100% | Kuning + ⚠️ | Mendekati batas |
| > 100% | Merah + ⚠️ | **Melebihi kapasitas!** |

**Contoh:** Jika kapasitas = 200 porsi/hari:
- 150 porsi → normal
- 170 porsi → kuning (85%)
- 220 porsi → merah (110%, melebihi kapasitas)

**Mengubah kapasitas:** Saat membuat jadwal baru, isi field "Kapasitas Maksimum per Hari". Bisa disesuaikan per jadwal — misalnya minggu biasa 200, minggu Ramadhan 250.

### 6.8 Status Jadwal

Setiap jadwal memiliki 3 status dengan alur:

```
DRAFT  ──→  ACTIVE  ──→  COMPLETED
(rencana)   (sedang     (sudah
             dijalankan)  selesai)
```

| Status | Badge | Arti | Bisa Edit? |
|--------|-------|------|-----------|
| **DRAFT** | Abu-abu | Rencana awal, masih bisa diedit bebas | ✅ Ya |
| **ACTIVE** | Hijau | Jadwal resmi untuk minggu ini, sedang dijalankan | ✅ Ya (fleksibel) |
| **COMPLETED** | Biru | Minggu sudah selesai, jadwal diarsipkan | ❌ Read-only |

**Mengaktifkan jadwal:**
1. Pastikan jadwal masih DRAFT
2. Klik tombol **"Aktifkan"**
3. Jadwal berubah menjadi ACTIVE
4. Jika sudah ada jadwal ACTIVE lain untuk minggu yang sama → jadwal lama diubah ke DRAFT

**Menyelesaikan jadwal:**
1. Di akhir minggu, klik **"Selesai"**
2. Jadwal berubah menjadi COMPLETED dan menjadi read-only

**Aturan:** Hanya boleh ada **1 jadwal ACTIVE** per minggu.

### 6.9 Cek Ketersediaan Stok

Fitur ini menghitung apakah stok bahan saat ini cukup untuk menjalankan seluruh jadwal minggu ini.

**Cara menggunakan:**
1. Klik tombol **"Cek Stok"** (ikon clipboard) di header
2. Dialog muncul menampilkan tabel:

```
┌─────────────────────────────────────────────────────────┐
│  Cek Ketersediaan Stok                                   │
│                                                          │
│  Item              Kebutuhan  Stok Saat Ini  Status      │
│  ─────────────────────────────────────────────────────   │
│  Ayam Fillet       22.5 kg    25.0 kg        ✅ Cukup    │
│  Beras Premium     28.0 kg    60.0 kg        ✅ Cukup    │
│  Bawang Merah       4.2 kg     3.0 kg        ❌ -1.2 kg  │
│  Cabai Keriting     3.8 kg     2.0 kg        ❌ -1.8 kg  │
│  Kentang           15.0 kg    12.0 kg        ❌ -3.0 kg  │
│  Minyak Goreng     10.5 L     20.0 L         ✅ Cukup    │
│  ...                                                     │
│                                                          │
│  Ringkasan: 18 item cukup, 5 item kekurangan            │
│                                                          │
│                     [Buat Daftar Belanja]                 │
└─────────────────────────────────────────────────────────┘
```

**Cara perhitungan:**
Untuk setiap resep di jadwal:
- Total bahan = (qty bahan per porsi dari resep) × (jumlah porsi di jadwal)
- Jika resep yang sama dijadwalkan di beberapa hari, kebutuhan bahan dijumlahkan
- Dibandingkan dengan stok saat ini → surplus (cukup) atau deficit (kurang)

**Status per item:**
- ✅ **Cukup** — stok mencukupi untuk seluruh jadwal
- ❌ **Kurang X** — kekurangan (angka merah), perlu beli

### 6.10 Buat Daftar Belanja (Auto-Generate PO)

Fitur ini membuat Draft PO otomatis untuk semua bahan yang kekurangan stok.

**Cara menggunakan:**
1. Klik **"Buat Daftar Belanja"** (ikon keranjang) di header, ATAU klik dari dialog Cek Stok
2. Konfirmasi: "Ini akan membuat Draft PO berdasarkan kekurangan stok. Lanjutkan?"
3. Klik **"Ya, Buat"**
4. Sistem akan:
   - Hitung item yang deficit
   - Cari supplier terbaik per item (dari histori pembelian terakhir, termurah)
   - Group per supplier → 1 Draft PO per supplier
5. Dialog hasil muncul:

```
┌──────────────────────────────────────────┐
│  Daftar Belanja Berhasil Dibuat!          │
│                                          │
│  PO-20260621-015  PT Sumber Makmur       │
│    3 item  •  Rp 850.000                 │
│                                          │
│  PO-20260621-016  UD Rempah Nusantara    │
│    2 item  •  Rp 280.000                 │
│                                          │
│  Total: 5 item  •  Rp 1.130.000         │
│                                          │
│                              [Tutup]     │
└──────────────────────────────────────────┘
```

6. Buka **Pembelian → Purchase Order** untuk mereview dan approve Draft PO yang dibuat

### 6.11 Template Jadwal

Template memungkinkan Anda menyimpan pola jadwal dan menggunakannya kembali di minggu-minggu berikutnya.

**Menyimpan jadwal sebagai template:**
1. Buat dan isi jadwal seperti biasa
2. Klik dropdown **Template** → **"Simpan sebagai Template"**
3. Isi nama (mis. "Jadwal Standar Weekday") dan deskripsi
4. Klik **Simpan**
5. Template tersimpan — bisa dipakai di minggu lain

**Menerapkan template ke minggu baru:**
1. Navigasi ke minggu yang belum ada jadwalnya
2. Klik dropdown **Template** → pilih template yang tersedia
3. Atau dari halaman **Pengaturan → Template Meal Plan** → klik **"Terapkan"** → pilih tanggal mulai minggu
4. Jadwal DRAFT baru dibuat dengan menu dan porsi dari template

**Mengelola template:**
- Buka **Pengaturan → Template Meal Plan** di sidebar
- Lihat daftar semua template (nama, jumlah item, tanggal dibuat)
- **Terapkan** — buat jadwal baru dari template
- **Hapus** — hapus template yang tidak dipakai lagi

**Tips template:**
- Buat template "Standar Weekday" untuk hari kerja biasa
- Buat template "Weekend" untuk akhir pekan
- Buat template "Ramadhan" dengan menu dan porsi khusus bulan puasa
- Setelah terapkan template, Anda masih bisa edit jadwal (tambah/hapus/ubah porsi)

### 6.12 Saran Jadwal dari Data Historis

Sistem bisa merekomendasikan jadwal berdasarkan **pola produksi 4 minggu terakhir**.

**Cara kerja:**
- Sistem menganalisis produksi yang sudah tercatat di sistem
- Untuk setiap hari dalam seminggu, dilihat resep apa yang paling sering diproduksi dan berapa rata-rata porsinya
- Hasilnya menjadi saran jadwal

**Contoh saran:**
```
Senin: Nasi Goreng (50 porsi), Ayam Geprek (60 porsi), Es Teh (80 porsi)
Selasa: Ayam Geprek (55 porsi), Sop Ayam (35 porsi)
...
```

Saran ini bisa diterapkan langsung sebagai jadwal baru atau sebagai referensi saat membuat jadwal manual.

### 6.13 Alur Kerja Lengkap

Berikut alur kerja yang direkomendasikan setiap minggu:

```
┌─ JUMAT / SABTU (Perencanaan minggu depan) ─────────────────┐
│                                                             │
│  1. Buka Meal Prep → navigasi ke minggu depan               │
│  2. Terapkan template ATAU buat jadwal baru                 │
│  3. Sesuaikan menu dan porsi per hari                       │
│  4. Cek Stok → lihat item yang kurang                      │
│  5. Buat Daftar Belanja → Draft PO otomatis terkirim       │
│  6. Review & Approve PO di halaman Purchase Order           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─ SENIN (Mulai produksi) ───────────────────────────────────┐
│                                                             │
│  7. Aktifkan jadwal (DRAFT → ACTIVE)                       │
│  8. Kitchen Manager produksi sesuai jadwal harian           │
│  9. Jika ada perubahan di tengah minggu → edit jadwal       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─ AKHIR MINGGU ─────────────────────────────────────────────┐
│                                                             │
│ 10. Tandai jadwal Selesai (ACTIVE → COMPLETED)              │
│ 11. Simpan sebagai template jika jadwal ini ingin dipakai   │
│     lagi minggu depan                                       │
│ 12. Mulai perencanaan minggu berikutnya                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.14 Tips & Best Practices

1. **Rencanakan 1 minggu sebelumnya** — Buat jadwal minggu depan paling lambat hari Jumat, agar PO bisa diproses dan barang datang sebelum Senin.

2. **Mulai dari template** — Jangan mulai dari nol setiap minggu. Simpan jadwal yang berhasil sebagai template, terapkan, lalu modifikasi sedikit.

3. **Gunakan saran historis** — Saat bingung, lihat saran dari sistem berdasarkan 4 minggu terakhir. Ini mencerminkan pola aktual dapur Anda.

4. **Cek stok sebelum finalisasi** — Selalu klik "Cek Stok" sebelum mengaktifkan jadwal. Lebih baik tahu kekurangan sekarang daripada saat mau masak.

5. **Satu jadwal per minggu** — Hanya buat 1 jadwal yang di-ACTIVE-kan per minggu. Ini menghindari kebingungan di dapur.

6. **Sesuaikan kapasitas per event** — Minggu biasa: 200 porsi/hari. Minggu Ramadhan: 250. Event catering: 300. Atur di saat buat jadwal.

7. **Integrasikan dengan Forecasting** — Gunakan data dari halaman Prediksi Bahan (Forecasting) sebagai input jumlah porsi yang realistis.

8. **Review Draft PO** — Daftar belanja otomatis adalah rekomendasi. Selalu cek harga dan qty sebelum approve PO.

9. **Tandai selesai di akhir minggu** — Ini membantu menjaga riwayat jadwal yang rapi dan membedakan minggu aktif dari arsip.

10. **Libatkan Kitchen Manager** — Jadwal yang baik adalah hasil kolaborasi antara Purchaser (ketersediaan bahan) dan Kitchen Manager (kelayakan produksi).

### 6.15 FAQ Meal Prep Planner

**Q: Apakah jadwal otomatis membuat catatan produksi?**
A: Tidak. Jadwal adalah rencana. Pencatatan produksi aktual tetap dilakukan secara terpisah di menu Produksi → Produksi Harian. Jadwal membantu planning, bukan otomasi eksekusi.

**Q: Bisa buat lebih dari 1 jadwal untuk minggu yang sama?**
A: Bisa, tapi hanya 1 yang boleh ACTIVE. Jadwal lainnya akan berstatus DRAFT. Ini berguna untuk membuat beberapa alternatif jadwal sebelum memilih yang terbaik.

**Q: Apa yang terjadi jika saya menambah menu melebihi kapasitas?**
A: Sistem menampilkan peringatan (warna merah + ikon warning) tapi tidak memblokir penambahan. Keputusan tetap di tangan Anda — mungkin hari itu memang mau lembur atau tambah staff.

**Q: Daftar belanja memilih supplier berdasarkan apa?**
A: Dari data PriceHistory (histori pembelian terakhir), dipilih supplier dengan harga termurah untuk setiap item. Jika tidak ada histori, item akan dilewati dan perlu dibuatkan PO manual.

**Q: Bisakah mengedit jadwal yang sudah ACTIVE?**
A: Ya, jadwal ACTIVE masih bisa diedit (tambah/hapus menu, ubah porsi). Ini memungkinkan fleksibilitas jika ada perubahan mendadak di tengah minggu.

**Q: Bisakah mengedit jadwal yang sudah COMPLETED?**
A: Tidak, jadwal COMPLETED bersifat read-only sebagai arsip. Jika ingin menggunakan jadwal serupa, simpan sebagai template lalu terapkan ke minggu baru.

**Q: Template menyimpan apa saja?**
A: Template menyimpan: resep apa di hari apa dan berapa porsi. Template tidak menyimpan tanggal spesifik — saat diterapkan, menu di-mapping ke hari yang sesuai di minggu tujuan.

**Q: Apa hubungan dengan fitur Forecasting?**
A: Keduanya saling melengkapi:
- **Forecasting** → memprediksi berapa banyak bahan yang dibutuhkan berdasarkan statistik historis
- **Meal Prep** → merencanakan secara spesifik menu apa diproduksi kapan
- Gunakan angka dari Forecasting sebagai panduan saat menentukan porsi di Meal Prep
- Keduanya bisa generate Draft PO, tapi dari sumber data yang berbeda

**Q: Bagaimana jika hari tertentu tidak ada produksi (misal Minggu tutup)?**
A: Cukup jangan tambahkan menu apapun di kolom Minggu. Kolom tetap ditampilkan tapi kosong, dan total porsi = 0.

**Q: Bisa print jadwal mingguan?**
A: Saat ini belum ada fitur print/PDF khusus untuk jadwal. Anda bisa menggunakan fitur print browser (Ctrl+P) sebagai alternatif.

---

## 7. FIFO & Expiry Date Tracking

### 7.1 Tentang FIFO & Batch Tracking

FIFO (First In, First Out) & Expiry Tracking adalah sistem yang memecah stok setiap item bahan baku ke dalam **batch** — setiap penerimaan barang menjadi 1 batch tersendiri dengan nomor batch dan tanggal kadaluarsa (jika ada).

**Apa itu Batch?**
Batch adalah satu kelompok barang yang diterima pada waktu yang sama. Misalnya: "5 kg Ayam Fillet diterima tanggal 15 Juni, expired 25 Juni" = 1 batch.

**Apa itu FIFO?**
First In, First Out = barang yang **pertama masuk, harus pertama keluar**. Barang yang paling lama di gudang (atau paling dekat expired) harus dipakai duluan. Ini prinsip dasar food safety.

**Manfaat:**
- **Zero expired waste** — tahu persis batch mana yang mendekati expired, prioritas pakai duluan
- **Food safety compliance** — bukti bahwa bahan digunakan sesuai prinsip FIFO
- **Alert otomatis** — notifikasi H-7, H-3, H-1 sebelum expired
- **Visibilitas penuh** — tahu setiap kg bahan: dari mana, kapan datang, kapan expired, berapa sisa
- **Keputusan cepat** — batch mendekati expired → segera pakai atau diskon, bukan buang

### 7.2 Cara Batch Terbentuk

Batch **otomatis dibuat** setiap kali Anda menerima barang (receiving):

```
Terima Barang (Receiving)
        │
        ├── Item: Ayam Fillet, 20 kg
        │   Batch#: BTH-AYM-003 (opsional, auto-generate jika kosong)
        │   Expired: 10 Jul 2026 (opsional)
        │           │
        │           ▼
        │   ┌─────────────────────────────┐
        │   │ ItemBatch #15               │
        │   │ Ayam Fillet                 │
        │   │ Batch: BTH-AYM-003         │
        │   │ Qty Awal: 20 kg            │
        │   │ Qty Sisa: 20 kg            │
        │   │ Expired: 10 Jul 2026       │
        │   │ Status: AVAILABLE          │
        │   └─────────────────────────────┘
        │
        ├── Item: Bawang Merah, 8 kg
        │   (tanpa batch# dan expired)
        │           │
        │           ▼
        │   ┌─────────────────────────────┐
        │   │ ItemBatch #16               │
        │   │ Bawang Merah               │
        │   │ Batch: RCV-RCV-20260621-001│ ← auto-generated
        │   │ Qty Awal: 8 kg             │
        │   │ Expired: -                 │ ← tidak ada
        │   │ Status: AVAILABLE          │
        │   └─────────────────────────────┘
```

**Input batch saat receiving bersifat opsional:**
- Jika **isi batch number** → dipakai sebagai ID batch
- Jika **tidak diisi** → sistem auto-generate dari nomor receiving
- Jika **isi tanggal expired** → dipakai untuk FIFO ordering dan alert
- Jika **tidak diisi** → batch dianggap tidak punya expiry (simpan tanpa batas)

### 7.3 Dashboard Batch & Expiry

**Cara mengakses:**
1. Di sidebar, klik **Stok Gudang**
2. Klik **Batch & Expiry**

**6 Summary Cards:**

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 📦 Total     │ │ ❌ Sudah     │ │ 💰 Nilai     │
│ Batch Aktif  │ │ Expired      │ │ At-Risk      │
│     42       │ │      3       │ │ Rp 850.000   │
└──────────────┘ └──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 🔴 Expired   │ │ 🟠 Expired   │ │ 🟡 Expired   │
│ Besok (H-1)  │ │ 3 Hari (H-3) │ │ 7 Hari (H-7) │
│      2       │ │      5       │ │     12       │
└──────────────┘ └──────────────┘ └──────────────┘
```

| Card | Penjelasan |
|------|-----------|
| **Total Batch Aktif** | Jumlah batch dengan status AVAILABLE (masih ada stok) |
| **Sudah Expired** | Batch yang sudah melewati tanggal expired tapi belum diproses |
| **Nilai At-Risk** | Total nilai Rupiah dari batch yang akan expired dalam 7 hari = Σ(sisa qty × harga terakhir) |
| **Expired Besok (H-1)** | Batch yang expired besok — **prioritas tertinggi!** |
| **Expired 3 Hari (H-3)** | Batch yang expired dalam 3 hari — perlu segera dipakai |
| **Expired 7 Hari (H-7)** | Batch yang expired dalam 7 hari — mulai direncanakan |

**Tombol aksi di header:**
- **"Cek Expiry Alert"** (🔔) — kirim notifikasi ke Kitchen Manager dan Admin untuk batch yang mendekati expired
- **"Proses Expired Otomatis"** (⚠️) — tandai semua batch yang sudah melewati tanggal expired sebagai EXPIRED dan buat waste record otomatis

### 7.4 Tabel Item Mendekati Expired

Di bawah summary cards, terdapat tabel batch yang mendekati expired:

```
┌──────────────────────────────────────────────────────────────────┐
│  Filter: [H-1] [H-3] [H-7] [H-30] [Semua]                     │
│                                                                  │
│  Item          Batch#       Terima    Expired   Sisa   Hari  Aksi│
│  ─────────────────────────────────────────────────────────────── │
│  Tomat         BTH-TMT-001  7 Mei    22 Jun    3 kg    1    [!] │ ← merah
│  Daging Sapi   BTH-DGS-001  27 Apr   23 Jun    3 kg    2    [!] │ ← oranye
│  Cabai Merah   BTH-CBM-001  12 Mei   24 Jun    3 kg    3    [!] │ ← oranye
│  Kentang       BTH-KTG-001  7 Mei    26 Jun    6 kg    5    [!] │ ← kuning
│  Udang Kupas   BTH-UDG-001  22 Mei   28 Jun    6 kg    7    [!] │ ← kuning
└──────────────────────────────────────────────────────────────────┘
```

**Kode warna urgency (konsisten di seluruh aplikasi):**

| Hari Tersisa | Warna | Badge | Background Baris |
|--------------|-------|-------|------------------|
| Sudah expired (< 0) | Merah | "EXPIRED" | Merah muda |
| Hari ini (0) | Merah | "HARI INI" | Merah muda |
| 1 hari | Merah | "1 hari" | Merah muda |
| 2-3 hari | Oranye | "2 hari" / "3 hari" | Oranye muda |
| 4-7 hari | Kuning | "X hari" | Normal |
| > 7 hari | Hijau | "X hari" | Normal |
| Tidak ada expiry | Abu-abu | "Tidak ada" | Normal |

**Filter cepat:**
- **H-1**: hanya batch yang expired besok atau sudah expired
- **H-3**: batch expired dalam 3 hari
- **H-7**: batch expired dalam 7 hari (default)
- **H-30**: batch expired dalam 30 hari
- **Semua**: tampilkan semua batch aktif

**Kolom tabel:**

| Kolom | Penjelasan |
|-------|-----------|
| **Item** | Nama bahan + SKU |
| **Batch #** | Nomor batch |
| **Tanggal Terima** | Kapan batch ini diterima |
| **Tanggal Expired** | Kapan batch ini kadaluarsa |
| **Sisa Qty** | Jumlah tersisa di batch (+ satuan) |
| **Nilai** | Sisa qty × harga terakhir (Rp) |
| **Hari Tersisa** | Badge warna sesuai urgency |
| **Status** | AVAILABLE (hijau) / EXPIRED (merah) / DEPLETED (abu) |
| **Aksi** | "Lihat" → detail batch item, "Tandai Expired" → proses sebagai waste |

### 7.5 Detail Batch Per Item (FIFO Order)

Klik **"Lihat"** pada baris item di tabel untuk melihat semua batch item tersebut dalam urutan FIFO:

```
┌──────────────────────────────────────────────────────────────┐
│  ← Kembali                                                   │
│  Ayam Fillet (ITM-PR-001)        Total Stok: 25 kg          │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ Total    │ │ Batch    │ │ Mendekati│                    │
│  │ Stok     │ │ Aktif    │ │ Expired  │                    │
│  │  25 kg   │ │    3     │ │    1     │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
│                                                              │
│  DAFTAR BATCH (FIFO — yang di atas dipakai duluan)          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ #  Batch#       Terima   Expired   Awal  Sisa  Status│   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ 1  BTH-AYM-001  27 Apr  EXPIRED   20kg   0kg   EXP  │   │
│  │ 2  BTH-AYM-002  22 Mei  1 Jul     25kg  15kg  ████░ │ ← FIFO: Pakai duluan!
│  │ 3  BTH-AYM-003  9 Jun   11 Jul    30kg  18kg  ████░ │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─ FIFO Suggestion Tool ────────────────────────────────┐  │
│  │ Berapa qty yang dibutuhkan?  [10     ]  [Lihat Saran] │  │
│  │                                                        │  │
│  │ Hasil: Ambil dari batch berikut:                       │  │
│  │ • BTH-AYM-002: 10 kg (sisa setelah: 5 kg)            │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Urutan FIFO:**
Batch ditampilkan dari atas ke bawah berdasarkan:
1. **Tanggal expired terdekat** (paling dekat expired di atas)
2. Jika tidak ada expiry → berdasarkan **tanggal terima tertua**
3. Batch pertama yang AVAILABLE diberi label **"FIFO: Pakai duluan!"**

**Progress bar per batch:**
Menunjukkan seberapa banyak batch sudah terpakai:
- Hijau (> 50% sisa): masih banyak
- Kuning (20-50% sisa): mulai habis
- Merah (< 20% sisa): hampir habis

**Status batch:**

| Status | Warna | Arti |
|--------|-------|------|
| AVAILABLE | Hijau | Masih ada stok, bisa dipakai |
| DEPLETED | Abu-abu | Sudah habis terpakai (normal) |
| EXPIRED | Merah | Kadaluarsa, sudah diproses sebagai waste |
| WASTED | Merah tua | Dibuang karena rusak/alasan lain |

### 7.6 FIFO Suggestion Tool

Di bagian bawah halaman detail batch, terdapat tool untuk mensimulasikan: "Jika saya butuh X kg, batch mana yang harus saya ambil?"

**Cara menggunakan:**
1. Masukkan jumlah qty yang dibutuhkan (mis. 10 kg)
2. Klik **"Lihat Saran FIFO"**
3. Sistem menghitung dan menampilkan:

```
Butuh: 10 kg Ayam Fillet

Ambil dari:
┌─────────────────────────────────────────────────┐
│ Batch          Ambil    Sisa Setelah Diambil     │
│ BTH-AYM-002   10 kg    5 kg                     │
└─────────────────────────────────────────────────┘
```

Jika 1 batch tidak cukup, sistem memecah ke batch berikutnya:

```
Butuh: 20 kg Ayam Fillet

Ambil dari:
┌─────────────────────────────────────────────────┐
│ Batch          Ambil    Sisa Setelah Diambil     │
│ BTH-AYM-002   15 kg    0 kg (habis)             │
│ BTH-AYM-003    5 kg    13 kg                    │
└─────────────────────────────────────────────────┘
```

**Ini adalah simulasi** — tidak mengurangi stok aktual. Gunakan sebagai panduan saat mengambil bahan dari gudang.

### 7.7 Menandai Batch Expired

Jika batch sudah expired atau barang sudah tidak layak pakai:

1. Klik tombol **"Tandai Expired"** pada baris batch
2. Konfirmasi: "Batch ini akan ditandai expired. Sisa qty akan dicatat sebagai waste. Lanjutkan?"
3. Klik **"Ya, Tandai Expired"**
4. Sistem akan:
   - Mengubah status batch menjadi **EXPIRED**
   - Mengatur `currentQty` menjadi 0
   - Membuat **WasteRecord** otomatis dengan kategori "EXPIRED"
   - Membuat **StockMovement** (pengurangan stok)
   - Mengurangi `Item.currentStock`

**Penting:** Aksi ini **tidak bisa dibatalkan**. Pastikan batch memang sudah expired/tidak layak pakai.

### 7.8 Alert Expiry Otomatis

Sistem dapat mengirim notifikasi ke Kitchen Manager dan Admin untuk batch yang mendekati expired.

**Cara trigger manual:**
Klik tombol **"Cek Expiry Alert"** (🔔) di dashboard.

**Alert yang dikirim:**

| Level | Judul Notifikasi | Contoh |
|-------|-----------------|--------|
| H-7 | "Batch mendekati expired (7 hari)" | "Batch BTH-UDG-001 (Udang Kupas) akan expired dalam 7 hari (28 Jun). Sisa: 6 kg" |
| H-3 | "Batch akan segera expired (3 hari)" | "Batch BTH-CBM-001 (Cabai Merah) akan expired dalam 3 hari (24 Jun). Sisa: 3 kg" |
| H-1 | "URGENT: Batch expired besok!" | "Batch BTH-TMT-001 (Tomat) akan expired BESOK (22 Jun). Sisa: 3 kg. Segera gunakan!" |

**Siapa yang menerima:**

| Role | Menerima Alert? |
|------|----------------|
| Kitchen Manager | ✅ Ya (yang harus action) |
| Admin | ✅ Ya (monitoring) |
| Owner | ❌ Tidak |
| Purchaser | ❌ Tidak |

**Idempotent:** Alert tidak akan duplikat — jika sudah dikirim hari ini untuk batch yang sama, tidak akan dikirim lagi.

**Di mana alert muncul:** Notification bell (🔔) di header dengan ikon ⏱️ (Timer) berwarna oranye.

### 7.9 Proses Auto-Expire

Tombol **"Proses Expired Otomatis"** (⚠️) akan:
1. Scan semua batch dimana `expiryDate < hari ini` DAN `status = AVAILABLE`
2. Untuk setiap batch yang ditemukan:
   - Set status → EXPIRED
   - Set currentQty → 0
   - Buat WasteRecord (kategori EXPIRED)
   - Buat StockMovement
   - Kurangi Item.currentStock
3. Menampilkan: "X batch expired otomatis diproses"

**Kapan menjalankan ini?**
- Idealnya setiap pagi sebelum produksi dimulai
- Atau minimal 1x per hari untuk memastikan batch expired langsung tercatat sebagai waste

### 7.10 Input Batch Saat Receiving

Saat menerima barang di halaman Penerimaan (Receiving), setiap item sekarang memiliki 2 field tambahan:

```
┌───────────────────────────────────────────────────────────────┐
│  Item: Ayam Fillet                                            │
│  Qty Diterima: [20    ]  Unit: [kg]                          │
│  No. Batch:    [BTH-AYM-004    ]  (opsional)                 │
│  Tgl Expired:  [2026-07-10     ]  (opsional)                 │
└───────────────────────────────────────────────────────────────┘
```

**Tips pengisian:**
- **No. Batch**: Gunakan nomor dari label kemasan supplier. Jika tidak ada, biarkan kosong (auto-generate)
- **Tanggal Expired**: Lihat label kemasan. Untuk bahan segar tanpa label (sayur, daging), estimasikan berdasarkan umur simpan standar:
  - Daging ayam/sapi segar: +3-5 hari
  - Sayuran: +5-7 hari
  - Bumbu kering: +30-90 hari
  - Beras/tepung: tidak perlu diisi (long shelf life)

### 7.11 Tips & Best Practices

1. **Jalankan "Cek Expiry Alert" setiap pagi** — Buat ini jadi rutinitas agar Kitchen Manager selalu tahu batch apa yang perlu diprioritaskan hari ini.

2. **Jalankan "Proses Auto-Expire" harian** — Batch expired yang tidak diproses akan tetap menghitung sebagai stok, sehingga data stok tidak akurat.

3. **Selalu input tanggal expired untuk bahan perishable** — Daging, seafood, sayuran, susu — ini bahan yang paling berisiko expired. Bahan kering (beras, garam, gula) tidak wajib.

4. **Gunakan FIFO Suggestion Tool** — Sebelum mengambil bahan dari gudang, cek saran FIFO agar selalu pakai batch tertua dulu.

5. **Review H-7 setiap Senin** — Pada awal minggu, lihat batch apa yang akan expired minggu ini. Prioritaskan dalam jadwal Meal Prep.

6. **Integrasikan dengan Meal Prep** — Jika ada batch yang mendekati expired → jadwalkan resep yang menggunakan bahan tersebut di Meal Prep Planner.

7. **Gunakan nomor batch dari supplier** — Jika supplier sudah memberikan nomor lot/batch di kemasan, gunakan itu agar traceable dari sumber.

8. **Perhatikan "Nilai At-Risk"** — Ini menunjukkan berapa Rupiah yang terancam hilang jika batch-batch tersebut tidak dipakai sebelum expired. Angka ini harus sekecil mungkin.

9. **Batch DEPLETED itu normal** — Batch yang habis terpakai (DEPLETED) bukan masalah. Yang bermasalah adalah batch EXPIRED — ini waste yang seharusnya bisa dicegah.

10. **Bandingkan EXPIRED vs DEPLETED** — Rasio batch expired / total batch adalah indikator efisiensi. Target: < 5% batch expired.

### 7.12 FAQ FIFO & Expiry

**Q: Apakah saya wajib input batch number dan expiry date saat receiving?**
A: Tidak wajib — kedua field bersifat opsional. Tapi **sangat direkomendasikan** untuk bahan perishable (daging, seafood, sayuran, susu). Untuk bahan kering yang tahan lama (beras, garam, minyak), tidak perlu expiry date.

**Q: Apa yang terjadi jika tidak input expiry date?**
A: Batch tetap dibuat tapi tanpa tanggal expired. Batch ini tidak akan muncul di alert expiry dan dianggap bisa disimpan tanpa batas. FIFO ordering akan berdasarkan tanggal terima (yang tertua duluan).

**Q: Apakah produksi otomatis deduct dari batch?**
A: Saat ini, produksi mengurangi `Item.currentStock` secara keseluruhan. Fitur deduct per-batch saat produksi akan tersedia di update berikutnya. Sementara itu, gunakan FIFO Suggestion Tool sebagai panduan manual.

**Q: Bagaimana jika batch number sama untuk 2 receiving berbeda?**
A: Batch number boleh sama — sistem menggunakan ID internal untuk membedakan. Tapi disarankan menggunakan nomor unik per receiving agar tracking lebih jelas.

**Q: "Proses Auto-Expire" apakah aman dijalankan berkali-kali?**
A: Ya, aman. Sistem hanya memproses batch yang status-nya masih AVAILABLE dan expiryDate sudah lewat. Batch yang sudah EXPIRED tidak akan diproses ulang.

**Q: Kenapa "Nilai At-Risk" penting?**
A: Ini menunjukkan potensi kerugian jika batch yang mendekati expired (7 hari) tidak dipakai. Misalnya Rp 850.000 → artinya Anda bisa kehilangan Rp 850.000 jika batch-batch tersebut tidak terpakai. Gunakan angka ini untuk memprioritaskan produksi.

**Q: Bagaimana hubungan dengan fitur Waste Tracking yang sudah ada?**
A: Saling melengkapi. Saat Anda "Tandai Expired" sebuah batch → sistem otomatis membuat WasteRecord dengan kategori EXPIRED. Data ini muncul di laporan waste reguler, sehingga Anda bisa melihat total waste karena expired vs sebab lain.

**Q: Bisakah undo "Tandai Expired"?**
A: Tidak bisa. Sekali ditandai expired, batch berubah menjadi EXPIRED dan waste record sudah tercatat. Pastikan batch memang expired sebelum menandai.

**Q: Bagaimana kalau saya mau membagi 1 batch menjadi 2?**
A: Saat ini tidak bisa split batch. 1 receiving = 1 batch per item. Jika menerima 2 karton dengan expiry berbeda, catat sebagai 2 item receiving terpisah (dengan qty dan expiry berbeda).

**Q: Alert expiry dikirim ke WhatsApp juga?**
A: Alert muncul di notification bell (in-app). Integrasi WhatsApp untuk alert expiry menggunakan fitur notifikasi yang sama — jika WhatsApp notification sudah dikonfigurasi, alert expiry juga akan terkirim ke sana.

---

## 8. Multi-Cabang & Transfer Stok

### 8.1 Tentang Multi-Cabang

Fitur **Multi-Cabang** membuat aplikasi siap dipakai oleh bisnis yang beroperasi di **lebih dari satu lokasi dapur**. Setiap cabang punya stok sendiri, transaksinya sendiri, dan dashboard-nya sendiri — sementara data master (item, resep, supplier, kategori, satuan) tetap **dipakai bersama** seluruh cabang.

**Yang bisa dilakukan:**
- Membuat dan mengelola banyak cabang
- Menempatkan setiap pengguna ke satu atau beberapa cabang
- Memisahkan stok, pembelian, produksi, waste, dan opname per cabang
- Memindahkan stok antar cabang lewat alur **Transfer Stok** yang terkontrol
- Membandingkan performa antar cabang (revenue, food cost, waste, pembelian)

**Siapa yang memakai:**
- **Owner** — akses semua cabang + view konsolidasi "Semua Cabang"
- **Admin** — mengelola cabang, penempatan user, dan persetujuan
- **Purchaser / Kitchen Manager** — bekerja di cabang yang ditugaskan kepadanya

### 8.2 Konsep: Master Shared & Stok Per-Cabang

Penting untuk memahami pemisahan ini:

| Jenis Data | Lingkup | Penjelasan |
|------------|---------|-----------|
| Item, Resep, Supplier, Kategori, Satuan | **Shared (global)** | Satu katalog dipakai semua cabang. Menambah item baru otomatis tersedia di semua cabang. |
| **Stok** (jumlah & minimum) | **Per-cabang** | Setiap cabang punya angka stok sendiri untuk tiap item. Stok Ayam di Pusat tidak sama dengan di Selatan. |
| PO, Penerimaan, Produksi, Waste, Opname, Mutasi, Batch | **Per-cabang** | Setiap transaksi tercatat pada satu cabang. |

> **Catatan:** Karena master item shared, harga terakhir (last price) sebuah item bersifat global. Yang per-cabang adalah **jumlah stok**, bukan identitas item.

### 8.3 Branch Switcher — Memilih Cabang Aktif

Di **header (kanan atas)**, ada dropdown **pemilih cabang** (ikon gedung). Cabang yang dipilih di sini menjadi **cabang aktif** — semua halaman (stok, PO, produksi, dashboard, dst.) otomatis menampilkan data cabang tersebut.

**Cara kerja:**
1. Klik dropdown cabang di header
2. Pilih cabang (mis. "Cabang Selatan")
3. Seluruh data di layar langsung berganti mengikuti cabang itu
4. Pilihan tersimpan — saat login berikutnya, cabang terakhir tetap aktif

> Jika akun Anda hanya ditempatkan di **satu cabang**, switcher otomatis terkunci ke cabang itu.

### 8.4 Mode "Semua Cabang" (Konsolidasi)

Khusus **Owner dan Admin**, dropdown punya opsi tambahan **"Semua Cabang"**. Saat dipilih:
- Dashboard menampilkan **angka gabungan** seluruh cabang
- Stok ditampilkan sebagai **total** lintas cabang (mis. Ayam Pusat 25 + Selatan 10 = 35)
- Daftar transaksi menampilkan data dari semua cabang

Mode ini untuk **pandangan helikopter** pemilik bisnis. Untuk operasional harian (membuat PO, produksi, transfer), pilih **cabang spesifik** — beberapa aksi tidak bisa dijalankan di mode "Semua Cabang" karena harus terikat ke satu cabang.

### 8.5 Mengelola Cabang

Buka **Pengaturan → Cabang** di sidebar (khusus Owner/Admin).

**Menambah cabang:**
1. Klik **"Tambah Cabang"**
2. Isi:
   - **Kode** — singkat & unik, huruf kapital/angka/strip (mis. `CBG-01`, `PST`)
   - **Nama** — nama lengkap cabang (mis. "Cabang Selatan")
   - **Alamat** dan **Telepon** (opsional)
   - **Cabang default** — centang bila ini cabang utama (hanya satu cabang bisa default)
3. Klik **Simpan**

**Mengedit / menonaktifkan:**
- Ikon **pensil** untuk mengubah data cabang
- Ikon **power** untuk menonaktifkan cabang (cabang default tidak bisa dinonaktifkan). Cabang nonaktif hilang dari switcher, tapi data historisnya tetap tersimpan.

Setiap baris menampilkan jumlah **anggota (user)** dan jumlah **item berstok** di cabang tersebut.

### 8.6 Menempatkan Pengguna ke Cabang

Pengguna hanya bisa mengakses cabang tempat ia ditugaskan (kecuali Owner yang bebas akses semua cabang).

**Cara menempatkan:**
1. Di halaman **Pengaturan → Cabang**, klik ikon **anggota** (orang) pada baris cabang
2. Centang pengguna yang ingin ditempatkan di cabang itu
3. Klik **Simpan**

Satu pengguna bisa ditempatkan di **beberapa cabang** sekaligus — ia lalu bisa berpindah-pindah lewat branch switcher.

> Saat login, sistem mengembalikan daftar cabang yang boleh diakses + cabang default user untuk mengisi switcher.

### 8.7 Bagaimana Transaksi Terikat Cabang

Setiap transaksi otomatis tercatat pada **cabang aktif** saat dibuat:

| Transaksi | Cabang yang dipakai |
|-----------|---------------------|
| Purchase Order, Produksi, Waste, Stok Opname, Penyesuaian Stok | Cabang aktif di switcher |
| Penerimaan (Receiving) | Mengikuti cabang **PO**-nya |
| Batch (FIFO) | Mengikuti cabang penerimaannya |
| Mutasi Stok | Cabang tempat stok berubah |

Akibatnya: menerima barang di **Cabang A** hanya menambah stok di A; produksi di A hanya mengurangi stok A. Stok cabang lain tidak terpengaruh.

### 8.8 Transfer Stok — Alur Lengkap

Untuk memindahkan stok dari satu cabang ke cabang lain, gunakan **Stok → Transfer Stok**. Alurnya berjenjang agar terkontrol:

```
DIMINTA ──► DISETUJUI ──► DIKIRIM ──► DITERIMA
(REQUESTED)  (APPROVED)   (SHIPPED)   (RECEIVED)
   │             │
   └─► DITOLAK   └─► DIBATALKAN
     (REJECTED)    (CANCELLED)
```

- **Diminta** — permintaan dibuat (belum mempengaruhi stok)
- **Disetujui** — Owner/Admin menyetujui (stok asal dicek cukup)
- **Dikirim** — stok **berkurang** di cabang asal (mutasi `TRF_OUT`)
- **Diterima** — stok **bertambah** di cabang tujuan (mutasi `TRF_IN`)

Stok baru benar-benar pindah saat **Kirim** dan **Terima**, bukan saat permintaan dibuat.

### 8.9 Membuat Permintaan Transfer

1. Buka **Stok → Transfer Stok** → klik **"Buat Transfer"**
2. Isi **Cabang Asal** (default: cabang aktif) dan **Cabang Tujuan** (harus berbeda)
3. Pilih **Tanggal Permintaan**
4. Tambahkan **item**: pilih item, isi jumlah, satuan otomatis terisi dari item
5. Tambah catatan bila perlu, lalu klik **"Buat Permintaan"**

Transfer dibuat dengan status **Diminta**, dan notifikasi terkirim ke Admin untuk persetujuan.

### 8.10 Menyetujui, Menolak, Membatalkan

Di **halaman detail transfer**, tombol aksi muncul sesuai status dan peran Anda:

- **Setujui / Tolak** (Owner/Admin) — saat status **Diminta**. Saat menyetujui, sistem mengecek stok cabang asal cukup; bila kurang, persetujuan ditolak dengan pesan.
- **Batalkan** — selama status masih **Diminta** atau **Disetujui** (belum dikirim).

Setiap perubahan status mengirim notifikasi ke peran terkait.

### 8.11 Mengirim & Menerima Transfer

- **Kirim** (Owner/Admin/Kitchen Manager) — saat status **Disetujui**. Stok dikurangi dari cabang asal sesuai jumlah, status menjadi **Dikirim**, dan tercatat mutasi `TRF_OUT` di cabang asal.
- **Terima** (Owner/Admin/Kitchen Manager) — saat status **Dikirim**. Stok ditambahkan ke cabang tujuan, status menjadi **Diterima**, dan tercatat mutasi `TRF_IN` di cabang tujuan.

> **Susut perjalanan:** jumlah diterima boleh lebih kecil dari jumlah dikirim (mis. ada yang rusak di jalan). Selisihnya tidak otomatis kembali ke asal — catat terpisah bila perlu penyesuaian.

Halaman detail menampilkan tabel item dengan kolom **Diminta / Dikirim / Diterima** sehingga seluruh riwayat angka transparan.

### 8.12 Laporan Perbandingan Cabang

Buka **Laporan → Perbandingan Cabang** (Owner/Admin). Pilih rentang tanggal, lalu sistem menampilkan tabel performa **per cabang**:

| Kolom | Arti |
|-------|------|
| **Revenue** | Nilai produksi = jumlah porsi diproduksi × harga jual resep |
| **Porsi** | Total porsi diproduksi pada periode |
| **Food Cost %** | (Biaya bahan / Revenue) × 100. Berwarna **hijau** <30%, **kuning** 30–40%, **merah** >40% |
| **Waste** | Total nilai Rupiah waste (+ jumlah kejadian) |
| **Pembelian** | Total nilai PO (non-cancelled) |

Baris **Total / Rata-rata** merangkum seluruh cabang. Klik **"Unduh PDF"** untuk mengekspor laporan (dibuat di sisi browser, format A4).

### 8.13 Tips & Best Practices

- **Tetapkan satu cabang default** sebagai pusat — pengguna baru dan transaksi tanpa konteks akan mengarah ke sana.
- **Tempatkan user seperlunya.** Purchaser/Kitchen cukup di cabang operasionalnya; jangan beri akses semua cabang kecuali memang perlu.
- **Selalu cek cabang aktif** di switcher sebelum membuat PO/produksi, agar transaksi tidak salah cabang.
- **Pakai Transfer Stok**, jangan Penyesuaian manual, untuk memindahkan barang antar cabang — agar kedua sisi tercatat (`TRF_OUT`/`TRF_IN`) dan dapat ditelusuri.
- **Bandingkan cabang berkala** (mingguan/bulanan) lewat laporan Perbandingan Cabang untuk menemukan cabang ber-food-cost tinggi atau waste berlebih.

### 8.14 FAQ Multi-Cabang

**Q: Kalau saya menambah item baru, apakah muncul di semua cabang?**
A: Ya. Item adalah data master shared. Yang per-cabang hanya jumlah stoknya — item baru mulai dari stok 0 di setiap cabang sampai ada penerimaan/penyesuaian.

**Q: Kenapa stok item berbeda saat saya ganti cabang?**
A: Memang seharusnya begitu. Stok bersifat per-cabang. Untuk melihat total semua cabang, pilih "Semua Cabang" (Owner/Admin).

**Q: Kenapa saya tidak bisa membuat PO/transfer saat memilih "Semua Cabang"?**
A: Aksi yang membuat transaksi harus terikat ke satu cabang. Pilih cabang spesifik dulu di switcher.

**Q: Apakah stok langsung pindah begitu permintaan transfer dibuat?**
A: Tidak. Stok asal berkurang saat **Kirim**, dan stok tujuan bertambah saat **Terima**. Saat "Diminta"/"Disetujui" stok belum berubah.

**Q: Bisakah transfer ke cabang yang sama?**
A: Tidak. Cabang asal dan tujuan harus berbeda — sistem menolak permintaan cabang yang sama.

**Q: Pengguna cabang A bisa melihat data cabang B?**
A: Tidak, kecuali ia juga ditempatkan di cabang B (atau berperan Owner). Akses divalidasi setiap permintaan.

**Q: Apa yang terjadi jika jumlah diterima lebih kecil dari yang dikirim?**
A: Hanya jumlah diterima yang masuk ke stok cabang tujuan. Selisihnya dianggap susut — lakukan penyesuaian/waste terpisah bila perlu dibukukan.

**Q: Cabang lama bisa dihapus?**
A: Cabang tidak dihapus permanen, melainkan **dinonaktifkan** agar data historis (transaksi, stok, transfer) tetap utuh. Cabang default tidak bisa dinonaktifkan.

---

## 9. Vendor Portal

### 9.1 Tentang Vendor Portal

**Vendor Portal** adalah portal web terpisah yang bisa diakses oleh supplier Anda. Dengan portal ini, supplier bisa:
- Melihat Purchase Order yang ditujukan kepada mereka
- Mengupdate status pengiriman barang secara real-time
- Mengirim invoice/nota pembelian secara digital
- Memperbarui katalog harga bahan secara berkala
- Berkomunikasi langsung dengan tim purchasing lewat chat

**Manfaat utama**: Semua komunikasi dan dokumen terpusat di satu tempat, tidak lagi perlu WhatsApp/email terpisah. Procurement jadi paperless.

**Konsep penting**:
- **Auth terpisah**: Supplier punya akun login sendiri (`/portal/login`), berbeda dari login staf internal (`/login`). Keduanya bisa aktif bersamaan di browser yang sama.
- **Status pengiriman independen**: Supplier mengupdate status pengiriman (Dikonfirmasi → Disiapkan → Dikirim → Sampai), tapi ini **tidak mengubah status PO internal**. Status PO tetap dikendalikan oleh proses Penerimaan Barang.
- **Chat per-supplier**: Satu thread percakapan per supplier, bisa dipakai untuk semua topik.

### 9.2 Akun Supplier — Provisioning & Login

**Membuat akun supplier (oleh Admin/Owner):**
1. Buka **Pembelian → Supplier → [pilih supplier] → detail**
2. Scroll ke bagian **"Akun Portal Supplier"**
3. Klik **"Buat Akun"** → isi nama, email, dan password awal
4. Berikan kredensial ke supplier agar mereka bisa login di `/portal/login`

**Mengelola akun**:
- **Reset Password**: klik tombol "Reset Password" pada akun, masukkan password baru
- **Nonaktifkan/Aktifkan**: toggle status akun; akun nonaktif tidak bisa login
- Satu supplier bisa punya beberapa akun (misal satu untuk sales, satu untuk admin supplier)

**Login supplier**:
- Buka `http://[domain-anda]/portal/login`
- Masukkan email dan password yang sudah diberikan oleh admin
- Setelah login, supplier masuk ke dashboard portal

### 9.3 Portal: Dashboard

Halaman utama portal menampilkan kartu shortcut ke 4 fitur utama:
- **Purchase Order** — lihat PO & update pengiriman
- **Invoice / Nota** — kirim invoice digital
- **Katalog Harga** — perbarui daftar harga
- **Pesan** — chat dengan tim purchasing

Dashboard juga menampilkan nama supplier dan nama kontak yang login.

### 9.4 Portal: Melihat Purchase Order

**Navigasi**: Portal → Purchase Order

Supplier melihat daftar PO yang ditujukan khusus kepada mereka (status APPROVED, SENT, PARTIALLY_RECEIVED, COMPLETED). PO dari supplier lain tidak terlihat.

**Informasi yang ditampilkan**:
- Nomor PO, tanggal, cabang tujuan, status PO, status pengiriman, total
- Klik detail untuk melihat daftar item (nama, qty, satuan, harga, total)
- Filter berdasarkan status PO

### 9.5 Portal: Update Status Pengiriman

**Navigasi**: Portal → Purchase Order → [detail PO] → bagian "Update Status Pengiriman"

Supplier bisa mengupdate status pengiriman dengan tahapan:
1. **Dikonfirmasi** — PO diterima oleh supplier
2. **Disiapkan** — Barang sedang disiapkan/dipacking
3. **Dikirim** — Barang sudah dikirimkan
4. **Terkirim ke Tujuan** — Barang sudah sampai

Setiap update bisa disertai:
- **Catatan** (opsional): info tambahan untuk purchaser
- **Estimasi tiba / ETA** (opsional): tanggal perkiraan barang sampai

**Yang terjadi saat supplier update**:
- Status pengiriman PO di-update (terlihat di detail PO internal juga)
- **Notifikasi otomatis** dikirim ke purchaser yang membuat PO
- Riwayat semua update tersimpan sebagai timeline

**Penting**: Update pengiriman dari supplier bersifat **informasional**. Status PO internal (Approved, Completed, dll.) tetap dikendalikan proses Penerimaan Barang.

### 9.6 Portal: Upload Invoice / Nota

**Navigasi**: Portal → Invoice / Nota → tombol "Kirim Invoice"

Supplier bisa mengirim invoice/nota secara digital:
1. Klik "Kirim Invoice"
2. Isi nomor invoice, tanggal, jumlah (Rp)
3. Lampirkan file bukti (JPEG, PNG, PDF, maks 5MB) — opsional
4. Tambahkan catatan jika perlu
5. Klik "Kirim Invoice"

**Setelah dikirim**:
- Invoice muncul di daftar invoice internal dengan badge **"Dari Supplier"**
- Status awal: **PENDING** — menunggu verifikasi oleh Admin/Owner
- Supplier bisa melihat status invoice di halaman invoice portal (PENDING, VERIFIED, REJECTED)
- Jika invoice terkait PO, notifikasi dikirim ke purchaser yang membuat PO

### 9.7 Portal: Katalog Harga

**Navigasi**: Portal → Katalog Harga

Supplier bisa memperbarui harga bahan yang mereka suplai:
1. Klik **"Update Harga"**
2. Pilih item dari daftar master item
3. Masukkan harga baru, tanggal berlaku, dan catatan (opsional)
4. Klik "Simpan Harga"

**Mekanisme update**:
- Saat harga baru disimpan, harga lama untuk item yang sama otomatis dinonaktifkan
- Hanya harga aktif terbaru yang ditampilkan
- Tim internal bisa melihat harga dari supplier di halaman detail supplier (bagian "Katalog Harga dari Supplier")

### 9.8 Portal: Chat / Pesan

**Navigasi**: Portal → Pesan

Chat adalah satu thread percakapan per supplier (semua topik digabung):
- Ketik pesan di kotak bawah, tekan Enter atau klik tombol kirim
- Pesan dari supplier tampil di sisi kanan (warna biru), dari internal di sisi kiri
- Chat otomatis di-refresh setiap 15 detik
- Status baca (read-tracking) dua arah: pesan internal ditandai "dibaca" saat supplier membuka halaman pesan, dan sebaliknya

**Dari sisi internal**: Tim purchasing/admin bisa membalas pesan supplier dari halaman detail supplier (bagian "Pesan dengan Supplier").

### 9.9 Internal: Melihat Data dari Supplier

Semua data yang dikirim supplier dari portal muncul di sisi internal:

| Data | Lokasi di Internal |
|------|-------------------|
| Status pengiriman & timeline | Detail PO → bagian "Status Pengiriman Supplier" |
| Invoice dari supplier | Pembelian → Bukti Pembelian (kolom "Sumber" = "Dari Supplier") |
| Katalog harga | Detail Supplier → bagian "Katalog Harga dari Supplier" |
| Chat/pesan | Detail Supplier → bagian "Pesan dengan Supplier" |

### 9.10 Tips & Best Practices

1. **Provisioning akun**: Buat akun supplier segera saat mulai kerjasama. Gunakan email yang benar-benar dipakai supplier.
2. **Status pengiriman**: Minta supplier aktif mengupdate status agar tim purchasing tidak perlu menelepon untuk tracking.
3. **Invoice digital**: Dorong supplier mengirim invoice lewat portal agar semua bukti tersimpan terpusat dan bisa diverifikasi langsung.
4. **Katalog harga**: Minta supplier update harga sebulan sekali agar tim purchasing punya referensi saat membuat PO.
5. **Chat**: Gunakan chat untuk komunikasi cepat. Hindari membahas hal sensitif (harga negosiasi, dll.) — gunakan fitur ini untuk koordinasi operasional.

### 9.11 FAQ Vendor Portal

**Q: Apakah supplier bisa melihat data internal (stok, produksi, dll)?**
A: Tidak. Supplier hanya bisa melihat PO yang ditujukan ke mereka, invoice yang mereka kirim, harga yang mereka set, dan pesan. Tidak ada akses ke data internal lainnya.

**Q: Bagaimana jika supplier lupa password?**
A: Admin/Owner bisa melakukan "Reset Password" dari detail supplier → bagian Akun Portal Supplier.

**Q: Bisakah satu supplier punya banyak akun login?**
A: Ya. Misalnya satu akun untuk sales dan satu untuk admin supplier mereka.

**Q: Apakah update pengiriman dari supplier otomatis mengubah status PO?**
A: Tidak. Status pengiriman dari supplier bersifat informasional. Status PO internal tetap dikendalikan oleh proses Penerimaan Barang (Receiving) di sisi internal.

**Q: Apakah login supplier dan login internal bisa aktif bersamaan?**
A: Ya. Keduanya menggunakan token dan penyimpanan terpisah di browser, sehingga bisa aktif secara bersamaan.

**Q: Format file apa yang bisa di-upload untuk invoice?**
A: JPEG, PNG, WebP, dan PDF dengan ukuran maksimal 5MB.

---

## 10. PWA & Barcode Scanner

### 10.1 Tentang PWA & Barcode

**PWA (Progressive Web App)** memungkinkan aplikasi Manajemen Dapur MBG **diinstall langsung ke HP** seperti aplikasi biasa — tanpa Play Store/App Store. Setelah terinstall, aplikasi:
- Punya ikon di layar utama HP dan berjalan layar penuh (tanpa address bar browser).
- Bisa **dipakai offline** untuk input lapangan (produksi & opname) meski WiFi dapur tidak stabil.
- Punya **scanner kamera barcode/QR** untuk mempercepat pencarian & input item.

**Catatan penting**: Fitur kamera dan offline hanya bekerja di koneksi aman (HTTPS) atau saat akses lewat `localhost`. Di server production, pastikan aplikasi diakses lewat HTTPS.

### 10.2 Menginstall Aplikasi ke HP

**Android (Chrome):**
1. Buka aplikasi di browser Chrome HP.
2. Akan muncul banner **"Install Aplikasi"** di pojok kanan bawah — tap **Install**.
3. (Atau lewat menu Chrome ⋮ → "Tambahkan ke layar utama".)
4. Ikon "Dapur MBG" akan muncul di layar utama.

**iOS (Safari):**
1. Buka aplikasi di Safari.
2. Tap tombol **Share** (kotak dengan panah ke atas).
3. Pilih **"Add to Home Screen"**.

**Desktop (Chrome/Edge):** klik ikon install di address bar, atau tombol "Install Aplikasi".

### 10.3 Mode Offline

Saat koneksi internet putus:
- Muncul badge **"Mode Offline"** di bagian bawah layar.
- Halaman yang **sudah pernah dibuka** tetap bisa diakses (data terakhir yang tersimpan).
- Halaman yang belum pernah dibuka menampilkan halaman "Anda sedang offline".

Begitu koneksi kembali, badge hilang otomatis dan data tersinkron.

### 10.4 Input Offline & Sinkronisasi Otomatis

Dua input lapangan bisa disimpan **meski sedang offline**:
- **Stok Opname** (`Stok → Stok Opname → Buat Opname`)
- **Produksi Harian** (`Produksi → Produksi Harian`)

**Cara kerja**:
1. Saat offline, isi form seperti biasa lalu **Simpan**.
2. Muncul notifikasi **"Disimpan offline — akan dikirim otomatis saat online"**. Data masuk antrian lokal di HP.
3. Di header muncul indikator **"N menunggu sinkron"** (N = jumlah data tertunda).
4. Begitu koneksi kembali, aplikasi **otomatis mengirim** semua data antrian ke server. Muncul notifikasi "N data offline berhasil disinkronkan" dan indikator hilang.

**Penting**:
- Data hanya dihapus dari antrian setelah server menerima dengan sukses.
- Jika sesi login kadaluarsa saat sinkronisasi, data tetap di antrian — login ulang lalu data akan dikirim.
- **Penerimaan Barang (Receiving)** tetap butuh koneksi online karena memerlukan validasi PO real-time.

### 10.5 Mengisi Barcode Item

Agar item bisa di-scan, isi barcode-nya:
1. Buka **Stok → Master Item → [tambah/edit item]**.
2. Pada field **Barcode**, ketik kode barcode pabrik (EAN/UPC) atau tap tombol **scan** untuk memindainya langsung dari kemasan.
3. Simpan.

Jika item tidak punya barcode pabrik, **SKU internal** tetap bisa dipakai untuk pencarian (scan label SKU yang dicetak sendiri).

### 10.6 Scan Item (Lihat Stok & Histori)

**Navigasi**: Stok → **Scan Item**

1. Tap tombol **Scan** → kamera terbuka.
2. Arahkan ke barcode/QR pada barang. (Atau tap **Input Kode Manual** untuk mengetik kode.)
3. Aplikasi menampilkan: nama item, SKU, barcode, **stok cabang aktif**, dan **5 mutasi terakhir**.
4. Tap "Scan Lagi" untuk item berikutnya.

Berguna untuk cek cepat stok & pergerakan barang langsung di gudang.

### 10.7 Scan saat Stok Opname

Saat membuat opname (`Stok → Stok Opname → Buat Opname`):
1. Tap tombol **Scan Item**.
2. Scan barang → baris item **otomatis ditambahkan** dengan item terisi.
3. Tinggal ketik **Qty Aktual** hasil hitung fisik.
4. Scan barang berikutnya — sangat cepat untuk opname banyak item.

Jika item sudah ada di daftar, aplikasi langsung memfokus baris tersebut.

### 10.8 Scan saat Penerimaan Barang

Saat mencatat penerimaan (`Pembelian → Penerimaan → Buat Penerimaan`):
1. Pilih PO terlebih dahulu (item akan terisi dari PO).
2. Tap tombol **Scan untuk Isi**.
3. Scan barang → aplikasi **memfokus & menggulir** ke baris item yang cocok di PO.
4. Ketik **Qty Diterima**.

Jika barang yang di-scan tidak ada di PO tersebut, muncul peringatan "Item tidak ada di PO ini".

### 10.9 Tips & Best Practices

1. **Install ke HP** semua staf gudang/dapur agar input bisa langsung di lapangan.
2. **Isi barcode** untuk item yang sering diterima/diopname agar scan lebih cepat dari ketik manual.
3. **Opname dengan scan**: pegang HP, scan-ketik qty-scan berikutnya. Jauh lebih cepat & minim salah pilih item.
4. **Offline**: jangan ragu input saat sinyal hilang — data aman di antrian dan terkirim otomatis. Pastikan kembali ke area bersinyal agar sinkron.
5. **Pencahayaan**: scan barcode butuh cahaya cukup. Bila kamera gagal, pakai input manual.

### 10.10 FAQ PWA & Barcode

**Q: Apakah perlu download dari Play Store / App Store?**
A: Tidak. Cukup buka di browser HP lalu "Install"/"Add to Home Screen".

**Q: Kamera tidak bisa dibuka, kenapa?**
A: Pastikan (1) izin kamera diberikan, (2) aplikasi diakses lewat HTTPS atau localhost. Bila tetap gagal, gunakan **Input Kode Manual**.

**Q: Data offline saya hilang tidak?**
A: Tidak. Tersimpan aman di HP (IndexedDB) dan terkirim otomatis saat online. Hanya dihapus setelah server menerima.

**Q: Kenapa Penerimaan tidak bisa offline?**
A: Penerimaan butuh validasi PO real-time (sisa qty, status PO) sehingga memerlukan koneksi.

**Q: Format barcode apa yang didukung?**
A: QR Code dan barcode 1D umum (EAN-13, Code 128, dll) lewat kamera.

**Q: Apakah ada push notification ke HP?**
A: Saat ini notifikasi tampil di dalam aplikasi (lonceng). Push notifikasi native ke HP direncanakan menyusul.

---

## Glosarium

| Istilah | Penjelasan |
|---------|-----------|
| **Food Cost %** | Persentase biaya bahan terhadap harga jual. Rumus: (Biaya Bahan / Harga Jual) × 100% |
| **Margin per Porsi** | Keuntungan kotor per porsi. Rumus: Harga Jual − Biaya Bahan per Porsi |
| **Median** | Nilai tengah dari suatu kumpulan data setelah diurutkan. Digunakan sebagai threshold pemisah klasifikasi |
| **Volume Produksi** | Total jumlah porsi yang diproduksi dalam periode tertentu |
| **PO (Purchase Order)** | Dokumen pemesanan barang ke supplier |
| **Minimum Stok** | Batas stok terendah yang diset untuk setiap item. Jika stok di bawah angka ini, sistem akan mengirim alert |
| **Badge** | Lingkaran kecil berisi angka yang muncul pada ikon, menunjukkan jumlah item yang perlu perhatian |
| **Popover** | Panel kecil yang muncul saat mengklik sebuah tombol, tanpa membuka halaman baru |
| **Supplier Rating** | Skor performa supplier (1-5) yang dihitung otomatis berdasarkan 4 kriteria: ketepatan waktu, kelengkapan, kualitas, dan harga |
| **Radar Chart** | Grafik spider web/jaring laba-laba yang menampilkan beberapa metrik sekaligus dalam satu visualisasi |
| **Trend** | Arah perubahan performa (naik/turun/stabil) dibandingkan periode sebelumnya |
| **Price History** | Catatan historis harga beli setiap item dari setiap receiving, digunakan untuk analisis trend |
| **Harga Pasar** | Rata-rata harga item dari semua supplier, digunakan sebagai pembanding harga individual supplier |
| **Forecasting** | Prediksi kebutuhan bahan baku di masa depan berdasarkan pola historis |
| **Safety Stock** | Buffer cadangan stok yang dihitung untuk mengantisipasi variasi konsumsi tak terduga |
| **MAPE** | Mean Absolute Percentage Error — metrik rata-rata error prediksi dalam persen |
| **Standar Deviasi (σ)** | Ukuran seberapa besar variasi data dari rata-rata. Semakin besar = semakin fluktuatif |
| **Coefficient of Variation (CV)** | Rasio standar deviasi terhadap rata-rata (σ/μ). Semakin kecil = semakin stabil dan predictable |
| **Lead Time** | Waktu yang dibutuhkan dari pemesanan hingga barang diterima (default 3 hari) |
| **Seasonal Factor** | Faktor pengali untuk menyesuaikan prediksi pada event tertentu (Ramadhan, promo, dll) |
| **Horizon** | Jangka waktu prediksi ke depan (7/14/30 hari) |
| **Rekonsiliasi** | Proses mencocokkan prediksi yang sudah lewat dengan konsumsi aktual untuk menghitung akurasi |
| **Meal Plan** | Jadwal produksi mingguan yang berisi daftar resep per hari beserta jumlah porsi |
| **Template** | Pola jadwal yang disimpan untuk digunakan kembali di minggu-minggu berikutnya |
| **Kapasitas Harian** | Batas maksimum porsi yang bisa diproduksi per hari berdasarkan kemampuan dapur |
| **Daftar Belanja** | Konsolidasi kebutuhan bahan dari jadwal mingguan yang dikonversi menjadi Draft PO |
| **Stock Check** | Pengecekan ketersediaan stok bahan terhadap kebutuhan jadwal produksi |
| **FIFO** | First In, First Out — prinsip bahwa barang yang pertama masuk harus pertama keluar/dipakai |
| **Batch** | Satu kelompok barang yang diterima pada waktu yang sama, dengan nomor batch dan tanggal expired |
| **Expiry Date** | Tanggal kadaluarsa bahan — setelah tanggal ini, bahan tidak boleh dipakai |
| **At-Risk Value** | Nilai Rupiah dari batch yang mendekati expired, menunjukkan potensi kerugian |
| **Auto-Expire** | Proses otomatis menandai batch yang sudah melewati tanggal expired sebagai waste |
| **Perishable** | Bahan yang cepat rusak/busuk dan perlu tracking expiry (daging, sayur, susu) |
| **Cabang (Branch)** | Lokasi dapur operasional yang punya stok dan transaksi sendiri |
| **Master Shared** | Data yang dipakai bersama semua cabang (item, resep, supplier, kategori, satuan) |
| **Stok Per-Cabang** | Jumlah stok yang dihitung terpisah untuk setiap cabang (tabel BranchStock) |
| **Branch Switcher** | Pemilih cabang aktif di header yang menentukan data cabang mana yang ditampilkan |
| **Cabang Aktif** | Cabang yang sedang dipilih; semua halaman & transaksi mengikuti cabang ini |
| **Mode Konsolidasi** | Pilihan "Semua Cabang" (Owner/Admin) yang menampilkan angka gabungan lintas cabang |
| **Cabang Default** | Cabang utama; tujuan transaksi tanpa konteks dan tidak bisa dinonaktifkan |
| **Transfer Stok** | Pemindahan stok antar cabang lewat alur Diminta → Disetujui → Dikirim → Diterima |
| **TRF_OUT / TRF_IN** | Jenis mutasi stok keluar (cabang asal) / masuk (cabang tujuan) akibat transfer |
| **Vendor Portal** | Portal web terpisah untuk supplier, diakses lewat `/portal/login` |
| **SupplierUser** | Akun login khusus supplier untuk mengakses Vendor Portal |
| **Shipment Status** | Status pengiriman yang diupdate supplier (PENDING → ACKNOWLEDGED → PREPARING → SHIPPED → DELIVERED), independen dari status PO |
| **Katalog Harga** | Daftar harga bahan yang di-maintain oleh supplier lewat portal |
| **Invoice Source** | Penanda asal invoice: INTERNAL (diinput staf) atau SUPPLIER (dari Vendor Portal) |
| **PWA** | Progressive Web App — aplikasi web yang bisa diinstall ke HP tanpa app store dan jalan offline |
| **Service Worker** | Skrip latar belang di browser yang menangani cache & akses offline |
| **Manifest** | Berkas konfigurasi PWA (nama, ikon, warna) yang membuat aplikasi installable |
| **Offline-capable** | Kemampuan input data (opname/produksi) saat tanpa internet, disimpan lokal lalu dikirim saat online |
| **Outbox** | Antrian lokal (IndexedDB) berisi data yang dibuat offline, menunggu dikirim ke server |
| **Background Sync** | Mekanisme browser untuk mengirim ulang data antrian otomatis saat koneksi kembali |
| **Barcode** | Kode batang/QR pada kemasan barang yang bisa di-scan kamera untuk identifikasi item cepat |
| **Item Lookup** | Pencarian item lewat scan barcode/SKU untuk melihat stok & histori |

---

*Dokumen ini akan diperbarui seiring dengan penambahan fitur baru.*
