# Product Requirements Document (PRD)
# Manajemen Dapur MBG

**Versi**: 1.0
**Tanggal**: 20 Juni 2026
**Status**: Draft
**Pemilik Dokumen**: Product & Engineering Team

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Objectives & Success Metrics](#2-objectives--success-metrics)
3. [User Personas](#3-user-personas)
4. [Scope & Feature Breakdown](#4-scope--feature-breakdown)
5. [Data Model / Entity Relationship](#5-data-model--entity-relationship)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Technical Architecture](#7-technical-architecture)
8. [Assumptions & Dependencies](#8-assumptions--dependencies)
9. [Out of Scope](#9-out-of-scope)
10. [Phase Implementation Plan](#10-phase-implementation-plan)

---

## 1. Executive Summary

**Manajemen Dapur MBG** adalah aplikasi web internal untuk mengelola operasional dapur bisnis F&B, mencakup siklus lengkap dari pembelian bahan baku, pengelolaan stok gudang, pencatatan produksi harian, hingga analisis biaya per porsi (food cost).

### Masalah yang Diselesaikan

| Masalah | Dampak | Solusi |
|---------|--------|--------|
| Pencatatan pembelian manual (nota kertas/spreadsheet) | Data tidak akurat, sulit dilacak | Modul Pembelian digital dengan approval workflow |
| Tidak ada visibilitas stok real-time | Bahan habis tanpa peringatan, over-stock | Inventory management dengan low-stock alert |
| Food cost dihitung manual | Margin tidak diketahui, pricing tidak optimal | Dashboard biaya per porsi otomatis |
| Tidak ada catatan waste/susut | Kebocoran biaya tidak terdeteksi | Waste tracking terintegrasi produksi |
| Sulit audit perubahan stok | Potensi fraud/kehilangan | Audit trail lengkap |

### Nilai Bisnis

- **Efisiensi operasional**: Mengurangi waktu pencatatan manual 60-70%
- **Kontrol biaya**: Visibilitas food cost real-time untuk setiap menu
- **Pencegahan kerugian**: Deteksi waste, kehilangan stok, dan anomali pembelian
- **Keputusan berbasis data**: Dashboard dan laporan untuk owner/manajemen

---

## 2. Objectives & Success Metrics

### Objectives

| # | Objective | Timeframe |
|---|-----------|-----------|
| O1 | Digitalisasi seluruh proses pembelian dan penerimaan barang | MVP (3 bulan) |
| O2 | Visibilitas stok gudang real-time dengan alert otomatis | MVP (3 bulan) |
| O3 | Otomatisasi perhitungan food cost per menu | Phase 2 (5 bulan) |
| O4 | Dashboard analitik biaya dan profitabilitas | Phase 2 (5 bulan) |
| O5 | Siap multi-cabang | Phase 3 (8 bulan) |

### Success Metrics (KPI)

| Metric | Baseline | Target (6 bulan) | Cara Ukur |
|--------|----------|-------------------|-----------|
| Waktu input pembelian per transaksi | ~15 menit (manual) | < 3 menit | Timestamp log |
| Akurasi stok (selisih opname vs sistem) | Tidak terukur | < 2% deviasi | Laporan opname |
| Waktu generate laporan food cost | ~2 jam (manual Excel) | < 10 detik | Response time |
| Insiden kehabisan stok per bulan | ~8x (estimasi) | < 2x | Alert log |
| Persentase waste terdeteksi | 0% | > 90% tercatat | Waste record vs estimasi |

---

## 3. User Personas

### 3.1 Owner / Pemilik Usaha

| Atribut | Detail |
|---------|--------|
| **Nama Persona** | Pak Budi |
| **Peran** | Pemilik bisnis MBG |
| **Tujuan Utama** | Memantau profitabilitas, kontrol biaya, pengambilan keputusan strategis |
| **Pain Points** | Tidak tahu food cost aktual, laporan telat, sulit bandingkan performa antar periode |
| **Kebutuhan Fitur** | Dashboard ringkasan, laporan biaya per porsi, trend pembelian, export PDF |
| **Frekuensi Akses** | Harian (cek dashboard), mingguan (review laporan) |
| **Device** | Smartphone (utama), laptop (sesekali) |

### 3.2 Admin / Manajer Operasional

| Atribut | Detail |
|---------|--------|
| **Nama Persona** | Mbak Rina |
| **Peran** | Admin operasional, mengelola master data dan user |
| **Tujuan Utama** | Memastikan data master akurat, mengelola akses user, audit trail |
| **Pain Points** | Harus input ulang data di banyak tempat, tidak ada standarisasi |
| **Kebutuhan Fitur** | CRUD master data (supplier, item, resep), manajemen user, laporan audit |
| **Frekuensi Akses** | Harian |
| **Device** | Laptop/Desktop |

### 3.3 Purchaser / Bagian Pembelian

| Atribut | Detail |
|---------|--------|
| **Nama Persona** | Mas Anto |
| **Peran** | Membuat PO, menerima barang, input bukti pembelian |
| **Tujuan Utama** | Proses pembelian cepat dan akurat, tracking status PO |
| **Pain Points** | Nota hilang, lupa follow-up PO, harga supplier berubah tanpa tercatat |
| **Kebutuhan Fitur** | Buat PO, receiving, upload bukti, histori harga supplier |
| **Frekuensi Akses** | Harian, beberapa kali sehari |
| **Device** | Smartphone (di lapangan), laptop (di kantor) |

### 3.4 Kitchen Manager / Kepala Dapur

| Atribut | Detail |
|---------|--------|
| **Nama Persona** | Chef Dani |
| **Peran** | Mengelola produksi harian, request bahan, catat waste |
| **Tujuan Utama** | Produksi lancar, bahan selalu tersedia, minimalisir waste |
| **Pain Points** | Bahan tiba-tiba habis, tidak tahu stok tersedia, waste tidak tercatat |
| **Kebutuhan Fitur** | Lihat stok, input produksi harian, catat waste, request pembelian |
| **Frekuensi Akses** | Harian, pagi dan sore |
| **Device** | Tablet/Smartphone (di dapur) |

---

## 4. Scope & Feature Breakdown

### 4.1 Modul Pembelian (Procurement)

#### 4.1.1 Manajemen Supplier

**Deskripsi**: Mengelola data supplier/vendor bahan baku dan barang habis pakai.

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| PRC-001 | Sebagai Admin, saya ingin menambah data supplier baru (nama, alamat, kontak, kategori) agar tersimpan di sistem | Must |
| PRC-002 | Sebagai Admin, saya ingin mengedit dan menonaktifkan supplier agar data tetap akurat | Must |
| PRC-003 | Sebagai Purchaser, saya ingin melihat daftar supplier beserta histori transaksi agar bisa memilih supplier terbaik | Must |
| PRC-004 | Sebagai Purchaser, saya ingin melihat histori harga per item dari setiap supplier agar bisa negosiasi | Should |

**Acceptance Criteria (PRC-001)**:
- Form input: nama supplier (wajib), alamat, no telepon, email, nama kontak, kategori supplier, catatan
- Validasi: nama supplier unik, format telepon valid
- Setelah simpan, muncul di daftar supplier dengan status "Aktif"
- Data tersimpan dengan audit trail (created_by, created_at)

#### 4.1.2 Purchase Order (PO)

**Deskripsi**: Membuat dan mengelola pesanan pembelian ke supplier.

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| PRC-010 | Sebagai Purchaser, saya ingin membuat PO baru dengan memilih supplier dan item yang ingin dibeli | Must |
| PRC-011 | Sebagai Purchaser, saya ingin menambahkan multiple item ke satu PO dengan jumlah dan harga per item | Must |
| PRC-012 | Sebagai Admin, saya ingin meng-approve atau reject PO sebelum dikirim ke supplier | Must |
| PRC-013 | Sebagai Purchaser, saya ingin melihat daftar PO dengan filter status (Draft, Pending Approval, Approved, Sent, Partially Received, Completed, Cancelled) | Must |
| PRC-014 | Sebagai Purchaser, saya ingin mencetak/download PO dalam format PDF | Should |
| PRC-015 | Sebagai Owner, saya ingin melihat ringkasan total pembelian per periode | Should |

**Acceptance Criteria (PRC-010)**:
- PO memiliki nomor otomatis (format: PO-YYYYMMDD-XXX)
- Pilih supplier dari daftar aktif
- Tanggal PO dan estimasi tanggal pengiriman
- Minimal 1 item dalam PO
- Status awal: "Draft"
- PO Draft bisa diedit, PO yang sudah Approved tidak bisa diedit

**Status Flow PO**:
```
Draft → Pending Approval → Approved → Sent → Partially Received → Completed
                        ↘ Rejected        ↘ Cancelled
```

#### 4.1.3 Penerimaan Barang (Receiving)

**Deskripsi**: Mencatat penerimaan barang berdasarkan PO.

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| PRC-020 | Sebagai Purchaser, saya ingin mencatat penerimaan barang berdasarkan PO yang sudah di-approve | Must |
| PRC-021 | Sebagai Purchaser, saya ingin menginput jumlah aktual yang diterima (bisa berbeda dari PO) | Must |
| PRC-022 | Sebagai Purchaser, saya ingin mencatat catatan penerimaan (kondisi barang, barang rusak, dll) | Must |
| PRC-023 | Sebagai Purchaser, saya ingin menerima sebagian item dari PO (partial receiving) | Must |
| PRC-024 | Sebagai Purchaser, saya ingin upload foto bukti penerimaan | Should |

**Acceptance Criteria (PRC-020)**:
- Pilih PO dengan status "Approved" atau "Sent" atau "Partially Received"
- Tampilkan item PO dengan kolom: item, qty PO, qty sudah diterima, qty kali ini
- Qty diterima tidak boleh melebihi sisa qty PO
- Setelah simpan, stok gudang otomatis bertambah sesuai qty diterima
- Status PO update otomatis: jika semua item diterima penuh → "Completed", jika belum → "Partially Received"

#### 4.1.4 Bukti Pembelian (Invoice/Nota)

**Deskripsi**: Mencatat dan menyimpan bukti pembelian/nota dari supplier.

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| PRC-030 | Sebagai Purchaser, saya ingin menginput bukti pembelian (nota/invoice) dan mengaitkannya dengan PO | Must |
| PRC-031 | Sebagai Purchaser, saya ingin upload foto/scan bukti pembelian (gambar/PDF) | Must |
| PRC-032 | Sebagai Admin, saya ingin memverifikasi bukti pembelian dan mencocokkan dengan PO | Should |
| PRC-033 | Sebagai Owner, saya ingin melihat total pengeluaran pembelian per periode dengan breakdown per supplier/kategori | Should |

---

### 4.2 Modul Stok Gudang (Inventory)

#### 4.2.1 Master Item

**Deskripsi**: Mengelola data master item bahan baku dan barang habis pakai.

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| INV-001 | Sebagai Admin, saya ingin menambah item baru dengan informasi lengkap (nama, SKU, kategori, satuan, harga terakhir, minimum stok) | Must |
| INV-002 | Sebagai Admin, saya ingin mengelompokkan item berdasarkan kategori (Bahan Baku, Bumbu & Rempah, Minyak & Lemak, Kemasan, Bahan Habis Pakai, dll) | Must |
| INV-003 | Sebagai Admin, saya ingin mendefinisikan konversi satuan untuk item (misal: 1 kg = 1000 gram) | Must |
| INV-004 | Sebagai Kitchen Manager, saya ingin mencari item dengan cepat berdasarkan nama atau kategori | Must |

**Acceptance Criteria (INV-001)**:
- Field: nama item (wajib, unik), SKU (auto-generate), kategori (wajib), satuan dasar (wajib), satuan pembelian, faktor konversi, minimum stok, gambar (opsional)
- Kategori: dropdown dari master kategori
- Satuan: dropdown dari master satuan (kg, gram, liter, ml, pcs, pack, dll)
- Validasi: nama item unik dalam sistem

#### 4.2.2 Stok & Mutasi

**Deskripsi**: Tracking stok real-time dan seluruh pergerakan barang.

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| INV-010 | Sebagai Kitchen Manager, saya ingin melihat stok terkini semua item di gudang | Must |
| INV-011 | Sebagai sistem, stok otomatis bertambah saat penerimaan barang (dari receiving) | Must |
| INV-012 | Sebagai sistem, stok otomatis berkurang saat produksi dicatat (berdasarkan resep/BOM) | Must |
| INV-013 | Sebagai Admin, saya ingin melakukan adjustment stok manual dengan alasan (koreksi, rusak, expired, dll) | Must |
| INV-014 | Sebagai Admin, saya ingin melihat riwayat mutasi stok per item (masuk, keluar, adjustment) dengan lengkap | Must |
| INV-015 | Sebagai Purchaser, saya ingin mendapat notifikasi ketika stok item mencapai minimum stok | Must |
| INV-016 | Sebagai Owner, saya ingin melihat nilai inventory (stok × harga) secara keseluruhan | Should |

**Acceptance Criteria (INV-014)**:
- Tabel mutasi: tanggal, jenis (IN/OUT/ADJ), referensi (no PO/no produksi/manual), qty sebelum, qty perubahan, qty sesudah, user, catatan
- Filter: rentang tanggal, jenis mutasi, item
- Setiap mutasi tercatat otomatis, tidak bisa diedit atau dihapus (immutable log)

**Tipe Mutasi Stok**:

| Kode | Tipe | Arah | Trigger |
|------|------|------|---------|
| RCV | Penerimaan | IN (+) | Receiving PO |
| PRD | Produksi | OUT (-) | Pencatatan produksi |
| ADJ_PLUS | Adjustment Tambah | IN (+) | Manual (opname/koreksi) |
| ADJ_MINUS | Adjustment Kurang | OUT (-) | Manual (rusak/expired/hilang) |
| WST | Waste | OUT (-) | Pencatatan waste |
| TRF_IN | Transfer Masuk | IN (+) | Transfer antar cabang (Phase 3) |
| TRF_OUT | Transfer Keluar | OUT (-) | Transfer antar cabang (Phase 3) |

#### 4.2.3 Stok Opname

**Deskripsi**: Proses pencocokan stok fisik dengan stok di sistem.

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| INV-020 | Sebagai Admin, saya ingin membuat sesi stok opname baru untuk memulai penghitungan fisik | Must |
| INV-021 | Sebagai Admin, saya ingin menginput stok fisik per item dan sistem otomatis menghitung selisih | Must |
| INV-022 | Sebagai Admin, saya ingin menyetujui hasil opname dan sistem otomatis membuat adjustment | Must |
| INV-023 | Sebagai Owner, saya ingin melihat laporan opname dengan detail selisih dan nilai kerugian | Should |

**Acceptance Criteria (INV-021)**:
- Daftar item yang akan di-opname (bisa pilih per kategori atau semua)
- Kolom: nama item, stok sistem, stok fisik (input), selisih (auto-hitung), catatan
- Selisih positif → stok fisik lebih banyak, Selisih negatif → stok fisik lebih sedikit
- Status opname: Draft → In Progress → Completed → Approved

---

### 4.3 Modul Produksi

#### 4.3.1 Resep / Bill of Materials (BOM)

**Deskripsi**: Mendefinisikan komposisi bahan baku untuk setiap menu/produk.

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| PRD-001 | Sebagai Admin/Kitchen Manager, saya ingin membuat resep menu baru dengan daftar bahan dan takaran per porsi | Must |
| PRD-002 | Sebagai Admin, saya ingin menduplikasi resep yang ada untuk membuat variasi menu | Should |
| PRD-003 | Sebagai Admin, saya ingin mengedit resep (tambah/hapus bahan, ubah takaran) dengan versioning | Must |
| PRD-004 | Sebagai Owner, saya ingin melihat estimasi biaya bahan per porsi berdasarkan resep dan harga terkini | Must |
| PRD-005 | Sebagai Admin, saya ingin mengkategorikan resep (Makanan Utama, Lauk, Sambal, Minuman, dll) | Should |

**Acceptance Criteria (PRD-001)**:
- Field resep: nama menu (wajib), kategori, deskripsi, porsi hasil (misal: "50 porsi"), gambar (opsional)
- Detail bahan: item (dari master item), jumlah per porsi, satuan
- Minimal 1 bahan dalam resep
- Sistem otomatis hitung estimasi biaya per porsi = Σ(jumlah bahan × harga terakhir item)
- Resep bisa di-set aktif/nonaktif

#### 4.3.2 Produksi Harian

**Deskripsi**: Mencatat kegiatan produksi harian dan otomatis mengurangi stok bahan.

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| PRD-010 | Sebagai Kitchen Manager, saya ingin mencatat produksi harian (menu apa, berapa porsi) | Must |
| PRD-011 | Sebagai sistem, saat produksi dicatat, stok bahan otomatis berkurang sesuai resep × jumlah porsi | Must |
| PRD-012 | Sebagai Kitchen Manager, saya ingin melihat apakah stok bahan mencukupi sebelum memulai produksi | Must |
| PRD-013 | Sebagai Kitchen Manager, saya ingin mengubah jumlah bahan aktual jika berbeda dari resep standar | Should |
| PRD-014 | Sebagai Admin, saya ingin melihat riwayat produksi harian (apa yang diproduksi, oleh siapa, kapan) | Must |

**Acceptance Criteria (PRD-011)**:
- Saat produksi disimpan, untuk setiap bahan di resep: stok item berkurang = (qty bahan per porsi × jumlah porsi diproduksi)
- Jika stok tidak cukup untuk salah satu bahan, tampilkan peringatan dengan detail kekurangan
- User bisa tetap memproses (dengan konfirmasi) atau membatalkan
- Mutasi stok tercatat dengan referensi nomor produksi

#### 4.3.3 Waste Tracking

**Deskripsi**: Mencatat bahan yang terbuang/rusak selama proses produksi atau penyimpanan.

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| PRD-020 | Sebagai Kitchen Manager, saya ingin mencatat waste bahan (item, jumlah, alasan) | Must |
| PRD-021 | Sebagai Kitchen Manager, saya ingin memilih kategori waste (expired, rusak, tumpah, sisa produksi, dll) | Must |
| PRD-022 | Sebagai Owner, saya ingin melihat laporan waste per periode dengan breakdown per kategori dan item | Must |
| PRD-023 | Sebagai Owner, saya ingin melihat persentase waste terhadap total pembelian | Should |

**Acceptance Criteria (PRD-020)**:
- Field: item (dari master), jumlah, satuan, kategori waste, catatan, foto (opsional)
- Stok otomatis berkurang
- Mutasi stok tercatat dengan tipe WST

---

### 4.4 Modul Dashboard & Biaya Per Porsi

#### 4.4.1 Dashboard Utama

**Deskripsi**: Ringkasan visual key metrics operasional dapur.

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| DSH-001 | Sebagai Owner, saya ingin melihat dashboard ringkasan: total pembelian hari ini, stok rendah, produksi hari ini, waste hari ini | Must |
| DSH-002 | Sebagai Owner, saya ingin melihat grafik trend pembelian harian/mingguan/bulanan | Should |
| DSH-003 | Sebagai Owner, saya ingin melihat top 10 item dengan pembelian terbanyak (nilai & qty) | Should |
| DSH-004 | Sebagai Owner, saya ingin melihat alert item yang stoknya di bawah minimum | Must |
| DSH-005 | Sebagai Purchaser, saya ingin melihat PO yang pending approval/penerimaan | Must |

#### 4.4.2 Biaya Per Porsi (Food Costing)

**Deskripsi**: Analisis biaya bahan per menu berdasarkan harga beli aktual.

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| DSH-010 | Sebagai Owner, saya ingin melihat biaya bahan (food cost) per porsi untuk setiap menu | Must |
| DSH-011 | Sebagai Owner, saya ingin menginput harga jual per menu dan melihat profit margin | Must |
| DSH-012 | Sebagai Owner, saya ingin melihat perbandingan food cost standar (dari resep) vs food cost aktual (dari produksi) | Should |
| DSH-013 | Sebagai Owner, saya ingin melihat trend food cost per menu dalam periode tertentu | Should |
| DSH-014 | Sebagai Owner, saya ingin export laporan food cost ke PDF | Must |

**Acceptance Criteria (DSH-010)**:
- Tabel: nama menu, harga jual, biaya bahan per porsi, food cost % (biaya/harga jual × 100), margin
- Biaya bahan dihitung dari: Σ(qty bahan per porsi × harga beli terakhir item)
- Bisa filter per kategori menu
- Bisa sort berdasarkan food cost % (highest first untuk identifikasi menu tidak profitable)
- Warna indikator: Hijau (< 30%), Kuning (30-40%), Merah (> 40%)

#### 4.4.3 Laporan

**Deskripsi**: Berbagai laporan operasional yang bisa di-export.

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| DSH-020 | Sebagai Owner, saya ingin generate laporan pembelian per periode (PDF) | Must |
| DSH-021 | Sebagai Owner, saya ingin generate laporan stok per tanggal (PDF) | Must |
| DSH-022 | Sebagai Owner, saya ingin generate laporan produksi harian (PDF) | Must |
| DSH-023 | Sebagai Owner, saya ingin generate laporan waste per periode (PDF) | Must |
| DSH-024 | Sebagai Owner, saya ingin generate laporan food cost per menu (PDF) | Must |

---

### 4.5 Modul User & Akses

#### 4.5.1 Manajemen User

**User Stories**:

| ID | User Story | Priority |
|----|-----------|----------|
| USR-001 | Sebagai Admin, saya ingin menambah user baru dengan role tertentu | Must |
| USR-002 | Sebagai Admin, saya ingin mengedit dan menonaktifkan user | Must |
| USR-003 | Sebagai User, saya ingin login dengan email dan password | Must |
| USR-004 | Sebagai User, saya ingin mengubah password saya sendiri | Must |
| USR-005 | Sebagai User, saya ingin reset password jika lupa | Should |

#### 4.5.2 Role & Permission Matrix

| Fitur | Owner | Admin | Purchaser | Kitchen Manager |
|-------|-------|-------|-----------|-----------------|
| Dashboard (semua) | ✅ | ✅ | ❌ | ❌ |
| Dashboard (ringkasan) | ✅ | ✅ | ✅ (PO pending) | ✅ (stok & produksi) |
| Master Data (CRUD) | ✅ | ✅ | ❌ | ❌ |
| Supplier (view) | ✅ | ✅ | ✅ | ❌ |
| PO (create/edit) | ✅ | ✅ | ✅ | ❌ |
| PO (approve) | ✅ | ✅ | ❌ | ❌ |
| Receiving | ✅ | ✅ | ✅ | ❌ |
| Bukti Pembelian | ✅ | ✅ | ✅ | ❌ |
| Stok (view) | ✅ | ✅ | ✅ | ✅ |
| Stok Adjustment | ✅ | ✅ | ❌ | ❌ |
| Stok Opname | ✅ | ✅ | ❌ | ❌ |
| Resep (CRUD) | ✅ | ✅ | ❌ | ✅ |
| Produksi (input) | ✅ | ✅ | ❌ | ✅ |
| Waste (input) | ✅ | ✅ | ❌ | ✅ |
| Food Costing | ✅ | ✅ | ❌ | ❌ |
| Laporan (PDF) | ✅ | ✅ | ✅ (pembelian) | ✅ (produksi) |
| User Management | ❌ | ✅ | ❌ | ❌ |
| Audit Trail | ✅ | ✅ | ❌ | ❌ |

---

## 5. Data Model / Entity Relationship

### 5.1 Diagram ER (High-Level)

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Supplier   │────<│  PurchaseOrder   │────<│  PurchaseOrder   │
│              │     │                  │     │     Item         │
└─────────────┘     └────────┬─────────┘     └────────┬─────────┘
                             │                        │
                    ┌────────▼─────────┐     ┌────────▼─────────┐
                    │    Receiving     │────<│  ReceivingItem   │
                    └──────────────────┘     └────────┬─────────┘
                                                     │
                                            ┌────────▼─────────┐
┌─────────────┐     ┌──────────────────┐    │      Item        │
│  Category   │────<│      Item        │<───┤   (Master)       │
└─────────────┘     └────────┬─────────┘    └────────┬─────────┘
                             │                       │
                    ┌────────▼─────────┐    ┌────────▼─────────┐
                    │  StockMovement   │    │   RecipeItem     │
                    │  (Mutasi)        │    │                  │
                    └──────────────────┘    └────────┬─────────┘
                                                    │
┌─────────────┐     ┌──────────────────┐   ┌────────▼─────────┐
│    Menu      │────<│     Recipe      │───<│   RecipeItem     │
│  Category    │     └────────┬────────┘    └──────────────────┘
└─────────────┘              │
                    ┌────────▼─────────┐    ┌──────────────────┐
                    │   Production     │───<│ ProductionItem   │
                    └──────────────────┘    └──────────────────┘

                    ┌──────────────────┐    ┌──────────────────┐
                    │   WasteRecord    │    │   StockOpname    │
                    └──────────────────┘    └──────────────────┘

┌─────────────┐     ┌──────────────────┐
│    Role      │────<│      User       │
└─────────────┘     └──────────────────┘

                    ┌──────────────────┐
                    │   AuditLog       │
                    └──────────────────┘
```

### 5.2 Entitas Utama

#### User & Auth

```
User {
  id              INT PK AUTO_INCREMENT
  email           VARCHAR(255) UNIQUE NOT NULL
  password_hash   VARCHAR(255) NOT NULL
  name            VARCHAR(100) NOT NULL
  role            ENUM('OWNER','ADMIN','PURCHASER','KITCHEN_MANAGER') NOT NULL
  is_active       BOOLEAN DEFAULT true
  last_login_at   DATETIME
  created_at      DATETIME
  updated_at      DATETIME
}
```

#### Master Data

```
Category {
  id              INT PK AUTO_INCREMENT
  name            VARCHAR(100) NOT NULL
  type            ENUM('ITEM','RECIPE') NOT NULL
  description     VARCHAR(255)
  is_active       BOOLEAN DEFAULT true
}

UnitOfMeasure {
  id              INT PK AUTO_INCREMENT
  name            VARCHAR(50) NOT NULL       -- "Kilogram"
  abbreviation    VARCHAR(10) NOT NULL       -- "kg"
}

UnitConversion {
  id              INT PK AUTO_INCREMENT
  from_unit_id    INT FK → UnitOfMeasure
  to_unit_id      INT FK → UnitOfMeasure
  factor          DECIMAL(15,6) NOT NULL     -- 1 kg = 1000 gram → factor = 1000
}

Supplier {
  id              INT PK AUTO_INCREMENT
  name            VARCHAR(200) NOT NULL
  address         TEXT
  phone           VARCHAR(20)
  email           VARCHAR(255)
  contact_person  VARCHAR(100)
  category        VARCHAR(100)
  notes           TEXT
  is_active       BOOLEAN DEFAULT true
  created_at      DATETIME
  updated_at      DATETIME
}

Item {
  id              INT PK AUTO_INCREMENT
  sku             VARCHAR(50) UNIQUE NOT NULL
  name            VARCHAR(200) NOT NULL
  category_id     INT FK → Category
  base_unit_id    INT FK → UnitOfMeasure
  purchase_unit_id INT FK → UnitOfMeasure
  conversion_factor DECIMAL(15,6) DEFAULT 1  -- purchase → base
  min_stock       DECIMAL(15,3) DEFAULT 0
  current_stock   DECIMAL(15,3) DEFAULT 0
  last_price      DECIMAL(15,2) DEFAULT 0
  image_url       VARCHAR(500)
  is_active       BOOLEAN DEFAULT true
  created_at      DATETIME
  updated_at      DATETIME
}
```

#### Pembelian

```
PurchaseOrder {
  id              INT PK AUTO_INCREMENT
  po_number       VARCHAR(20) UNIQUE NOT NULL  -- PO-20260620-001
  supplier_id     INT FK → Supplier
  po_date         DATE NOT NULL
  expected_date   DATE
  status          ENUM('DRAFT','PENDING_APPROVAL','APPROVED','REJECTED',
                       'SENT','PARTIALLY_RECEIVED','COMPLETED','CANCELLED')
  total_amount    DECIMAL(15,2) DEFAULT 0
  notes           TEXT
  approved_by     INT FK → User (nullable)
  approved_at     DATETIME
  created_by      INT FK → User
  created_at      DATETIME
  updated_at      DATETIME
}

PurchaseOrderItem {
  id              INT PK AUTO_INCREMENT
  po_id           INT FK → PurchaseOrder
  item_id         INT FK → Item
  quantity        DECIMAL(15,3) NOT NULL
  unit_id         INT FK → UnitOfMeasure
  unit_price      DECIMAL(15,2) NOT NULL
  total_price     DECIMAL(15,2) NOT NULL
  received_qty    DECIMAL(15,3) DEFAULT 0
  notes           TEXT
}

Receiving {
  id              INT PK AUTO_INCREMENT
  receiving_number VARCHAR(20) UNIQUE NOT NULL  -- RCV-20260620-001
  po_id           INT FK → PurchaseOrder
  received_date   DATE NOT NULL
  notes           TEXT
  created_by      INT FK → User
  created_at      DATETIME
}

ReceivingItem {
  id              INT PK AUTO_INCREMENT
  receiving_id    INT FK → Receiving
  po_item_id      INT FK → PurchaseOrderItem
  item_id         INT FK → Item
  quantity        DECIMAL(15,3) NOT NULL
  unit_id         INT FK → UnitOfMeasure
  notes           TEXT
}

PurchaseInvoice {
  id              INT PK AUTO_INCREMENT
  invoice_number  VARCHAR(50) NOT NULL
  po_id           INT FK → PurchaseOrder (nullable)
  supplier_id     INT FK → Supplier
  invoice_date    DATE NOT NULL
  total_amount    DECIMAL(15,2) NOT NULL
  image_url       VARCHAR(500)
  status          ENUM('PENDING','VERIFIED','REJECTED')
  verified_by     INT FK → User (nullable)
  notes           TEXT
  created_by      INT FK → User
  created_at      DATETIME
}
```

#### Stok

```
StockMovement {
  id              INT PK AUTO_INCREMENT
  item_id         INT FK → Item
  movement_type   ENUM('RCV','PRD','ADJ_PLUS','ADJ_MINUS','WST','TRF_IN','TRF_OUT')
  reference_type  VARCHAR(50)               -- 'RECEIVING','PRODUCTION','OPNAME','MANUAL','WASTE'
  reference_id    INT                       -- ID dari tabel referensi
  qty_before      DECIMAL(15,3) NOT NULL
  qty_change      DECIMAL(15,3) NOT NULL
  qty_after       DECIMAL(15,3) NOT NULL
  notes           TEXT
  created_by      INT FK → User
  created_at      DATETIME
}

StockOpname {
  id              INT PK AUTO_INCREMENT
  opname_number   VARCHAR(20) UNIQUE NOT NULL
  opname_date     DATE NOT NULL
  status          ENUM('DRAFT','IN_PROGRESS','COMPLETED','APPROVED')
  notes           TEXT
  approved_by     INT FK → User (nullable)
  approved_at     DATETIME
  created_by      INT FK → User
  created_at      DATETIME
}

StockOpnameItem {
  id              INT PK AUTO_INCREMENT
  opname_id       INT FK → StockOpname
  item_id         INT FK → Item
  system_qty      DECIMAL(15,3) NOT NULL
  actual_qty      DECIMAL(15,3) NOT NULL
  difference      DECIMAL(15,3) NOT NULL    -- actual - system
  notes           TEXT
}
```

#### Produksi

```
Recipe {
  id              INT PK AUTO_INCREMENT
  name            VARCHAR(200) NOT NULL
  category_id     INT FK → Category
  description     TEXT
  yield_quantity  DECIMAL(15,3) NOT NULL     -- berapa porsi yang dihasilkan
  yield_unit      VARCHAR(50) DEFAULT 'porsi'
  selling_price   DECIMAL(15,2) DEFAULT 0
  estimated_cost  DECIMAL(15,2) DEFAULT 0   -- auto-calculated
  image_url       VARCHAR(500)
  is_active       BOOLEAN DEFAULT true
  version         INT DEFAULT 1
  created_by      INT FK → User
  created_at      DATETIME
  updated_at      DATETIME
}

RecipeItem {
  id              INT PK AUTO_INCREMENT
  recipe_id       INT FK → Recipe
  item_id         INT FK → Item
  quantity        DECIMAL(15,6) NOT NULL     -- qty per yield_quantity
  unit_id         INT FK → UnitOfMeasure
}

Production {
  id              INT PK AUTO_INCREMENT
  production_number VARCHAR(20) UNIQUE NOT NULL  -- PROD-20260620-001
  production_date DATE NOT NULL
  recipe_id       INT FK → Recipe
  planned_qty     DECIMAL(15,3) NOT NULL     -- jumlah porsi
  actual_qty      DECIMAL(15,3)              -- jumlah porsi aktual
  status          ENUM('PLANNED','IN_PROGRESS','COMPLETED','CANCELLED')
  notes           TEXT
  created_by      INT FK → User
  created_at      DATETIME
  updated_at      DATETIME
}

ProductionItem {
  id              INT PK AUTO_INCREMENT
  production_id   INT FK → Production
  item_id         INT FK → Item
  planned_qty     DECIMAL(15,6) NOT NULL     -- dari resep × porsi
  actual_qty      DECIMAL(15,6)              -- qty aktual yang dipakai
  unit_id         INT FK → UnitOfMeasure
}

WasteRecord {
  id              INT PK AUTO_INCREMENT
  waste_date      DATE NOT NULL
  item_id         INT FK → Item
  quantity        DECIMAL(15,3) NOT NULL
  unit_id         INT FK → UnitOfMeasure
  category        ENUM('EXPIRED','DAMAGED','SPILLED','PRODUCTION_LEFTOVER','OTHER')
  notes           TEXT
  image_url       VARCHAR(500)
  created_by      INT FK → User
  created_at      DATETIME
}
```

#### Audit

```
AuditLog {
  id              INT PK AUTO_INCREMENT
  user_id         INT FK → User
  action          ENUM('CREATE','UPDATE','DELETE','APPROVE','REJECT','LOGIN','LOGOUT')
  entity_type     VARCHAR(50) NOT NULL       -- 'PurchaseOrder', 'Item', dll
  entity_id       INT NOT NULL
  old_values      JSON                       -- snapshot sebelum perubahan
  new_values      JSON                       -- snapshot sesudah perubahan
  ip_address      VARCHAR(45)
  user_agent      VARCHAR(500)
  created_at      DATETIME
}
```

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Requirement | Target |
|-------------|--------|
| Response time halaman list (< 100 item) | < 500ms |
| Response time halaman list (> 1000 item) | < 2 detik (dengan pagination) |
| Response time dashboard | < 3 detik |
| PDF generation | < 10 detik |
| Concurrent users | Minimal 20 user simultan |
| Database query | Tidak ada query > 5 detik |
| File upload (bukti pembelian) | Max 5 MB per file |

### 6.2 Security

| Requirement | Implementasi |
|-------------|-------------|
| Autentikasi | JWT (access token + refresh token) |
| Password | Bcrypt hash, minimum 8 karakter |
| API Authorization | Guard berbasis role di setiap endpoint |
| CORS | Whitelist domain frontend saja |
| Input Validation | Zod schema di frontend & backend |
| SQL Injection | Prisma ORM (parameterized queries) |
| XSS | Sanitasi input, CSP headers |
| File Upload | Validasi tipe file (jpg, png, pdf), size limit |
| Rate Limiting | 100 request/menit per user |
| Audit Trail | Immutable log untuk semua operasi CRUD pada data sensitif |
| Session | JWT expiry 24 jam, refresh token 7 hari |

### 6.3 Scalability & Availability

| Requirement | Detail |
|-------------|--------|
| Arsitektur | Stateless backend (horizontal scaling ready) |
| Database | MySQL dengan indexing pada kolom pencarian utama |
| Caching | Redis untuk session, dashboard aggregate (Phase 2) |
| File Storage | Local storage (MVP), migrasi ke object storage (Phase 3) |
| Backup | Database backup harian |
| Uptime target | 99% (kecuali maintenance window) |
| Multi-cabang | Data model sudah include branch_id (nullable, Phase 3) |

### 6.4 Usability

| Requirement | Detail |
|-------------|--------|
| Responsive | Mobile-first, breakpoints: 640px, 768px, 1024px, 1280px |
| Bahasa UI | Bahasa Indonesia |
| Browser Support | Chrome, Safari, Firefox (versi terbaru) |
| Loading State | Skeleton loader untuk data fetch |
| Error Handling | Toast notification, form inline error |
| Keyboard Navigation | Tab order, Enter untuk submit |
| Data Table | Sort, filter, search, pagination (Tanstack Table) |

---

## 7. Technical Architecture

### 7.1 System Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Client Layer                        │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Next.js 15 (App Router)                │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │    │
│  │  │ Shadcn/  │ │ Tanstack │ │  React Hook Form │ │    │
│  │  │ Radix UI │ │ Table +  │ │  + Zod           │ │    │
│  │  │          │ │ Query    │ │                   │ │    │
│  │  └──────────┘ └──────────┘ └──────────────────┘ │    │
│  │  ┌──────────────────────────────────────────────┐│    │
│  │  │         @react-pdf/renderer (PDF)            ││    │
│  │  └──────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS (REST API)
┌──────────────────────▼──────────────────────────────────┐
│                     Server Layer                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │              NestJS (TypeScript)                  │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │    │
│  │  │ Guards   │ │ Pipes    │ │   Interceptors   │ │    │
│  │  │ (Auth +  │ │ (Zod    │ │   (Logging,      │ │    │
│  │  │  RBAC)   │ │ Valid.)  │ │    Transform)    │ │    │
│  │  └──────────┘ └──────────┘ └──────────────────┘ │    │
│  │  ┌──────────────────────────────────────────────┐│    │
│  │  │ Modules: Auth, User, Supplier, Item,        ││    │
│  │  │ PurchaseOrder, Receiving, Invoice,           ││    │
│  │  │ Stock, Recipe, Production, Waste,            ││    │
│  │  │ Dashboard, Report, AuditLog                  ││    │
│  │  └──────────────────────────────────────────────┘│    │
│  │  ┌──────────────────────────────────────────────┐│    │
│  │  │           Prisma ORM                         ││    │
│  │  └──────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                     Data Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    MySQL     │  │    Redis     │  │ File Storage │  │
│  │  (Primary)   │  │  (Cache/     │  │  (Uploads)   │  │
│  │              │  │   Session)   │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Frontend Architecture

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth layout group
│   │   ├── login/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Main layout group (sidebar + header)
│   │   ├── dashboard/
│   │   ├── pembelian/
│   │   │   ├── supplier/
│   │   │   ├── purchase-order/
│   │   │   ├── receiving/
│   │   │   └── invoice/
│   │   ├── stok/
│   │   │   ├── item/
│   │   │   ├── mutasi/
│   │   │   └── opname/
│   │   ├── produksi/
│   │   │   ├── resep/
│   │   │   ├── harian/
│   │   │   └── waste/
│   │   ├── laporan/
│   │   │   ├── biaya-per-porsi/
│   │   │   └── [report-type]/
│   │   └── pengaturan/
│   │       ├── user/
│   │       ├── kategori/
│   │       └── satuan/
│   ├── api/                      # Next.js API routes (jika perlu proxy)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # Shadcn/UI components
│   ├── layout/                   # Sidebar, Header, Breadcrumb
│   ├── forms/                    # Reusable form components
│   ├── tables/                   # Tanstack Table configurations
│   └── pdf/                      # @react-pdf/renderer templates
├── hooks/                        # Custom hooks (useAuth, usePagination, dll)
├── lib/
│   ├── api.ts                    # Axios instance + interceptors
│   ├── auth.ts                   # Auth utilities
│   └── utils.ts                  # Helper functions
├── schemas/                      # Zod schemas (shared validation)
├── types/                        # TypeScript interfaces
└── stores/                       # State management (jika perlu Zustand)
```

### 7.3 Backend Architecture

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── decorators/
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── current-user.decorator.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   ├── user/
│   │   ├── supplier/
│   │   ├── item/
│   │   ├── purchase-order/
│   │   ├── receiving/
│   │   ├── invoice/
│   │   ├── stock/
│   │   ├── recipe/
│   │   ├── production/
│   │   ├── waste/
│   │   ├── dashboard/
│   │   ├── report/
│   │   └── audit-log/
│   ├── common/
│   │   ├── pipes/
│   │   │   └── zod-validation.pipe.ts
│   │   ├── interceptors/
│   │   │   ├── audit-log.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── dto/
│   │       └── pagination.dto.ts
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   ├── prisma.module.ts
│   │   └── schema.prisma
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
└── test/
```

### 7.4 API Design (RESTful)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| **Auth** | | |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/change-password` | Ganti password |
| **Supplier** | | |
| GET | `/api/suppliers` | List supplier (paginated, search, filter) |
| GET | `/api/suppliers/:id` | Detail supplier |
| POST | `/api/suppliers` | Tambah supplier |
| PATCH | `/api/suppliers/:id` | Update supplier |
| **Item** | | |
| GET | `/api/items` | List item (paginated, search, filter kategori) |
| GET | `/api/items/:id` | Detail item + stok terkini |
| POST | `/api/items` | Tambah item |
| PATCH | `/api/items/:id` | Update item |
| GET | `/api/items/:id/movements` | Histori mutasi stok item |
| **Purchase Order** | | |
| GET | `/api/purchase-orders` | List PO (paginated, filter status) |
| GET | `/api/purchase-orders/:id` | Detail PO + items |
| POST | `/api/purchase-orders` | Buat PO baru |
| PATCH | `/api/purchase-orders/:id` | Update PO (draft only) |
| POST | `/api/purchase-orders/:id/approve` | Approve PO |
| POST | `/api/purchase-orders/:id/reject` | Reject PO |
| POST | `/api/purchase-orders/:id/cancel` | Cancel PO |
| **Receiving** | | |
| GET | `/api/receivings` | List receiving |
| POST | `/api/receivings` | Catat penerimaan |
| GET | `/api/receivings/:id` | Detail receiving |
| **Invoice** | | |
| GET | `/api/invoices` | List invoice |
| POST | `/api/invoices` | Tambah invoice |
| POST | `/api/invoices/:id/verify` | Verifikasi invoice |
| **Stock** | | |
| GET | `/api/stock/summary` | Ringkasan stok semua item |
| GET | `/api/stock/low-stock` | Item di bawah minimum stok |
| POST | `/api/stock/adjustment` | Adjustment manual |
| GET | `/api/stock/movements` | Riwayat mutasi (filter) |
| **Stock Opname** | | |
| GET | `/api/stock-opnames` | List opname |
| POST | `/api/stock-opnames` | Buat sesi opname |
| PATCH | `/api/stock-opnames/:id` | Update opname (input qty fisik) |
| POST | `/api/stock-opnames/:id/approve` | Approve & execute adjustment |
| **Recipe** | | |
| GET | `/api/recipes` | List resep |
| GET | `/api/recipes/:id` | Detail resep + items + estimated cost |
| POST | `/api/recipes` | Buat resep |
| PATCH | `/api/recipes/:id` | Update resep |
| POST | `/api/recipes/:id/duplicate` | Duplikasi resep |
| **Production** | | |
| GET | `/api/productions` | List produksi |
| POST | `/api/productions` | Catat produksi |
| GET | `/api/productions/:id` | Detail produksi |
| POST | `/api/productions/:id/complete` | Selesaikan produksi |
| GET | `/api/productions/check-stock` | Cek kecukupan stok untuk resep |
| **Waste** | | |
| GET | `/api/wastes` | List waste |
| POST | `/api/wastes` | Catat waste |
| **Dashboard** | | |
| GET | `/api/dashboard/summary` | Ringkasan hari ini |
| GET | `/api/dashboard/purchase-trend` | Trend pembelian |
| GET | `/api/dashboard/top-items` | Top items by purchase |
| GET | `/api/dashboard/food-cost` | Food cost per menu |
| **Report** | | |
| GET | `/api/reports/purchase` | Laporan pembelian (filter periode) |
| GET | `/api/reports/stock` | Laporan stok per tanggal |
| GET | `/api/reports/production` | Laporan produksi |
| GET | `/api/reports/waste` | Laporan waste |
| GET | `/api/reports/food-cost` | Laporan food cost |
| **User** | | |
| GET | `/api/users` | List user |
| POST | `/api/users` | Tambah user |
| PATCH | `/api/users/:id` | Update user |
| **Audit** | | |
| GET | `/api/audit-logs` | List audit log (filter) |
| **Master Data** | | |
| GET/POST/PATCH | `/api/categories` | CRUD kategori |
| GET/POST/PATCH | `/api/units` | CRUD satuan |

---

## 8. Assumptions & Dependencies

### Assumptions

| # | Assumption |
|---|-----------|
| A1 | Bisnis saat ini beroperasi di **satu lokasi** (single branch) untuk MVP |
| A2 | Jumlah user aktif **< 20 orang** pada fase awal |
| A3 | Jumlah item bahan baku **< 500 SKU** |
| A4 | Jumlah resep/menu **< 100** |
| A5 | Transaksi pembelian **< 50 PO/hari** |
| A6 | Produksi dilakukan **1-2 kali per hari** |
| A7 | User sudah terbiasa menggunakan smartphone/laptop untuk input data |
| A8 | Koneksi internet tersedia dan stabil di lokasi operasional |
| A9 | Harga bahan dari supplier berubah secara berkala (bukan real-time market price) |
| A10 | Owner menentukan harga jual menu secara manual |

### Dependencies

| # | Dependency | Impact |
|---|-----------|--------|
| D1 | MySQL 8.0+ tersedia di server hosting | Blocker untuk deployment |
| D2 | Node.js 20 LTS runtime | Blocker untuk development |
| D3 | Hosting/VPS untuk deploy (rekomendasi: VPS atau cloud provider lokal) | Blocker untuk go-live |
| D4 | Domain dan SSL certificate | Blocker untuk production |
| D5 | SMTP service untuk password reset email | Blocker untuk fitur forgot password |
| D6 | Redis server (Phase 2) | Required untuk caching dashboard |

---

## 9. Out of Scope

Berikut fitur-fitur yang **tidak** termasuk dalam scope proyek ini (dapat dipertimbangkan di masa depan):

| # | Item | Alasan |
|---|------|--------|
| OS-1 | Point of Sale (POS) / Kasir | Fokus pada operasional dapur, bukan penjualan langsung |
| OS-2 | Manajemen keuangan lengkap (GL, AP, AR) | Menggunakan software akuntansi terpisah |
| OS-3 | HR / Manajemen karyawan | Menggunakan sistem terpisah |
| OS-4 | Customer-facing ordering (menu digital, delivery) | Domain berbeda, bisa integrasi nanti |
| OS-5 | Integrasi marketplace (GoFood, GrabFood, Shopee Food) | Kompleksitas tinggi, Phase 4+ |
| OS-6 | Native mobile app (iOS/Android) | Responsive web sudah mencukupi untuk MVP |
| OS-7 | Barcode/QR scanning untuk stok | Bisa ditambahkan di Phase 3 |
| OS-8 | Forecast/prediksi kebutuhan bahan (ML) | Butuh data historis minimal 6 bulan |
| OS-9 | Multi-bahasa (English) | Target user berbahasa Indonesia |
| OS-10 | Integrasi payment gateway | Pembelian menggunakan transfer/cash di luar sistem |

---

## 10. Phase Implementation Plan

### Phase 1 — MVP (8-10 minggu)

**Tujuan**: Digitalisasi pembelian dan manajemen stok dasar.

| Minggu | Deliverable |
|--------|-------------|
| 1-2 | Setup project (Next.js + NestJS + Prisma + MySQL), Auth (login, JWT, RBAC), Layout (sidebar, header) |
| 3-4 | Master Data (kategori, satuan, item, supplier), CRUD dengan Tanstack Table |
| 5-6 | Purchase Order (CRUD, approval flow, status tracking), Receiving (input, stok otomatis bertambah) |
| 7-8 | Stok Gudang (view stok, mutasi log, adjustment manual, low-stock alert), Bukti Pembelian (input + upload) |
| 9-10 | Stok Opname, Audit Trail, Testing & Bug fixing, Deployment |

**Deliverables MVP**:
- Login & role-based access (4 roles)
- Master data: Supplier, Item, Kategori, Satuan
- Purchase Order dengan approval workflow
- Penerimaan barang (auto update stok)
- View stok real-time + mutasi log
- Adjustment stok manual
- Low stock alert (badge di sidebar + halaman dedicated)
- Stok opname
- Bukti pembelian (input + upload gambar)
- Audit trail
- Responsive layout

### Phase 2 — Produksi & Food Costing (6-8 minggu)

**Tujuan**: Modul produksi dan analisis biaya per porsi.

| Minggu | Deliverable |
|--------|-------------|
| 1-2 | Resep/BOM (CRUD, kalkulasi biaya otomatis) |
| 3-4 | Produksi Harian (input, auto deduct stok, cek kecukupan stok) |
| 5-6 | Waste Tracking, Dashboard utama (ringkasan, grafik, alert) |
| 7-8 | Food Cost per Porsi (tabel, margin, indikator warna), Laporan PDF (semua jenis), Redis caching |

**Deliverables Phase 2**:
- Resep menu dengan BOM
- Produksi harian (auto deduct stok)
- Waste tracking
- Dashboard ringkasan operasional
- Dashboard biaya per porsi + profit margin
- Grafik trend pembelian
- Semua laporan PDF (pembelian, stok, produksi, waste, food cost)
- Redis caching untuk dashboard

### Phase 3 — Optimisasi & Multi-Cabang Ready (6-8 minggu)

**Tujuan**: Optimisasi, fitur lanjutan, dan persiapan multi-cabang.

| Minggu | Deliverable |
|--------|-------------|
| 1-2 | Multi-cabang (entity Branch, filter data per cabang, transfer antar cabang) |
| 3-4 | Histori harga supplier, Perbandingan food cost standar vs aktual |
| 5-6 | Notification system (in-app + email untuk alert stok, PO pending), Forgot password |
| 7-8 | File storage migration (object storage), Performance optimization, Security hardening |

**Deliverables Phase 3**:
- Multi-cabang support
- Transfer stok antar cabang
- Histori harga supplier
- Food cost standar vs aktual
- Notifikasi in-app & email
- Forgot password
- Object storage untuk file upload
- Performance & security optimization

---

## Lampiran

### A. Glossary

| Istilah | Definisi |
|---------|---------|
| **BOM (Bill of Materials)** | Daftar bahan dan takaran yang dibutuhkan untuk membuat satu menu/produk |
| **Food Cost** | Persentase biaya bahan baku terhadap harga jual menu |
| **Opname** | Proses pencocokan stok fisik dengan data di sistem |
| **PO (Purchase Order)** | Dokumen pemesanan barang ke supplier |
| **Receiving** | Proses penerimaan dan pencatatan barang yang datang dari supplier |
| **SKU** | Stock Keeping Unit, kode unik untuk setiap item |
| **Waste** | Bahan yang terbuang/tidak terpakai karena expired, rusak, atau sisa produksi |
| **Yield** | Jumlah porsi/output yang dihasilkan dari satu batch produksi |
| **Mutasi Stok** | Pergerakan/perubahan jumlah stok (masuk, keluar, adjustment) |

### B. Nomor Dokumen Auto-Generate Format

| Dokumen | Format | Contoh |
|---------|--------|--------|
| Purchase Order | `PO-YYYYMMDD-XXX` | PO-20260620-001 |
| Receiving | `RCV-YYYYMMDD-XXX` | RCV-20260620-001 |
| Production | `PROD-YYYYMMDD-XXX` | PROD-20260620-001 |
| Stock Opname | `OPN-YYYYMMDD-XXX` | OPN-20260620-001 |
| Item SKU | `ITM-CATXX-XXX` | ITM-BB-001 (Bahan Baku #001) |
