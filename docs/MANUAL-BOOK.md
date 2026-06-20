# Manual Book — Manajemen Dapur MBG

**Versi**: 1.0
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

---

*Dokumen ini akan diperbarui seiring dengan penambahan fitur baru.*
