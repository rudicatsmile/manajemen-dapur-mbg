# Manual Book — Manajemen Dapur MBG

**Versi**: 1.2
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

---

*Dokumen ini akan diperbarui seiring dengan penambahan fitur baru.*
