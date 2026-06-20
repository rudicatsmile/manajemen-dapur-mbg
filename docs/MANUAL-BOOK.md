# Manual Book — Manajemen Dapur MBG

**Versi**: 1.1
**Terakhir Diperbarui**: 20 Juni 2026

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

---

*Dokumen ini akan diperbarui seiring dengan penambahan fitur baru.*
