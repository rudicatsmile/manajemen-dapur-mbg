# Feature Roadmap — Manajemen Dapur MBG

**Tanggal**: 20 Juni 2026
**Status**: Planning
**Prioritas**: Berdasarkan dampak bisnis × effort implementasi

---

## Tier 1 — Quick Wins (2-3 minggu/fitur)

### 1. Menu Engineering
**Status**: 🔜 Next
**Estimasi**: 2 minggu

Klasifikasi otomatis setiap menu berdasarkan matriks **popularitas × profitabilitas**:

| Kategori | Popularitas | Profitabilitas | Aksi |
|----------|------------|----------------|------|
| ⭐ Star | Tinggi | Tinggi | Pertahankan, promosikan |
| 🧩 Puzzle | Rendah | Tinggi | Tingkatkan promosi/visibilitas |
| 🐴 Plow Horse | Tinggi | Rendah | Optimasi resep, naikkan harga |
| 🐕 Dog | Rendah | Rendah | Pertimbangkan hapus dari menu |

**Fitur detail**:
- Dashboard Menu Engineering dengan matriks 4 kuadran (scatter plot)
- Auto-klasifikasi berdasarkan data produksi (volume) dan food cost (margin)
- Threshold konfigurabel oleh owner (default: median sebagai pemisah)
- Rekomendasi aksi per menu
- Trend pergerakan menu antar kuadran (bulanan)
- Export laporan PDF

**Data yang dibutuhkan** (sudah tersedia):
- Volume produksi per resep (dari tabel Production)
- Food cost per porsi (dari Recipe + Item.lastPrice)
- Harga jual per menu (dari Recipe.sellingPrice)

**Impact**: Optimasi margin 15-25% dengan mengarahkan fokus ke menu yang tepat.

---

### 2. Notifikasi & Alert System
**Status**: 🔜 Next
**Estimasi**: 2-3 minggu

Push notification real-time ke WhatsApp/Email untuk event-event kritikal:

| Event | Penerima | Channel | Trigger |
|-------|----------|---------|---------|
| Stok di bawah minimum | Purchaser, Admin | WA + In-App | Real-time saat stok berubah |
| PO pending approval > 24 jam | Admin, Owner | WA + Email | Cron job harian |
| Barang mendekati expired | Kitchen Manager | WA + In-App | Cron job harian (H-3) |
| Waste harian melebihi threshold | Owner | WA | Cron job malam hari |
| Kenaikan harga supplier > 10% | Purchaser, Owner | WA + Email | Saat receiving |
| PO jatuh tempo pengiriman | Purchaser | WA + In-App | Cron job harian |

**Fitur detail**:
- Notification center (in-app) dengan badge count di header
- Integrasi WhatsApp via API lokal (Fonnte/WATool/Wablas)
- Email notification via SMTP
- Konfigurasi per-user: channel mana yang aktif, event mana yang di-subscribe
- Notification log/history
- Quiet hours setting (jangan kirim WA malam hari)

**Impact**: Response time terhadap masalah turun 80%, tidak ada lagi stok habis tanpa peringatan.

---

### 3. Supplier Rating & Scorecard
**Status**: Planned
**Estimasi**: 2 minggu

Scoring otomatis performa supplier berdasarkan data transaksi historis:

**Kriteria penilaian**:
- **Ketepatan waktu** (30%): PO.expectedDate vs Receiving.receivedDate
- **Kelengkapan pesanan** (25%): Qty diterima vs qty PO (fulfillment rate)
- **Kualitas barang** (25%): Jumlah return/reject dari receiving notes
- **Harga kompetitif** (20%): Perbandingan harga antar supplier untuk item yang sama

**Fitur detail**:
- Skor 1-5 per supplier dengan breakdown per kriteria
- Ranking supplier per kategori bahan
- Trend performa supplier (3/6/12 bulan)
- Highlight supplier dengan skor menurun
- Rekomendasi supplier terbaik saat buat PO

**Impact**: Keputusan pemilihan supplier berbasis data, bukan feeling.

---

### 4. Histori & Alert Harga Bahan
**Status**: Planned
**Estimasi**: 2 minggu

Tracking pergerakan harga bahan dari waktu ke waktu per supplier:

**Fitur detail**:
- Grafik trend harga per item (line chart, 3/6/12 bulan)
- Perbandingan harga antar supplier untuk item yang sama (side-by-side)
- Alert otomatis jika harga naik > 10% dari rata-rata 30 hari
- Alert otomatis jika harga naik > 5% dari pembelian terakhir
- Harga tertinggi/terendah/rata-rata per periode
- Dampak kenaikan harga terhadap food cost per menu (simulasi)

**Impact**: Deteksi kenaikan harga lebih awal, hemat biaya pembelian 5-10%.

---

## Tier 2 — Game Changers (4-6 minggu/fitur)

### 5. Forecasting Kebutuhan Bahan Baku
**Status**: Planned (butuh data historis 2-3 bulan)
**Estimasi**: 5-6 minggu

Prediksi kebutuhan bahan berdasarkan pola historis:

**Fitur detail**:
- Prediksi kebutuhan bahan harian/mingguan berdasarkan:
  - Pola produksi historis per hari dalam seminggu
  - Tren musiman (Ramadhan, Natal, liburan sekolah)
  - Event khusus (catering, promo)
- Auto-generate draft PO berdasarkan prediksi + stok saat ini
- Confidence level per prediksi
- Akurasi tracking (prediksi vs aktual)
- Safety stock suggestion per item

**Impact**: Waste berkurang 30%, stockout mendekati 0%.

---

### 6. Meal Prep Planner (Production Planning)
**Status**: Planned
**Estimasi**: 4-5 minggu

Planning board visual untuk jadwal produksi:

**Fitur detail**:
- Kalender mingguan drag-and-drop (resep ke hari)
- Template jadwal mingguan yang bisa di-reuse
- Auto-generate konsolidasi daftar belanja dari jadwal
- Cek ketersediaan stok untuk seluruh rencana minggu depan
- Kapasitas produksi per hari (batasan porsi/jam kerja)
- Integrasi dengan forecasting (suggest jadwal optimal)

**Impact**: Efisiensi produksi naik 40%, pembelian lebih terencana.

---

### 7. FIFO & Expiry Date Tracking
**Status**: Planned
**Estimasi**: 4-5 minggu

Tracking batch dan tanggal kadaluarsa per item:

**Fitur detail**:
- Input batch number + expiry date saat receiving
- Stok per item dipecah per batch (FIFO queue)
- Alert H-7, H-3, H-1 sebelum expired
- Saat produksi, sistem otomatis suggest/enforce batch yang paling lama (FIFO)
- Dashboard: item mendekati expired, nilai inventory at-risk
- Laporan waste karena expired vs total expired items

**Impact**: Zero expired waste, compliance food safety.

---

### 8. Multi-Cabang & Transfer Stok
**Status**: ✅ Selesai (Fase 1–3)
**Estimasi**: 6 minggu

**Fitur detail**:
- ✅ Entity Branch (cabang) — master data **shared**, stok per-cabang via `BranchStock`
- ✅ Setiap transaksi terikat ke satu cabang (PO, Receiving, Production, Waste, Opname, StockMovement, ItemBatch)
- ✅ User di-assign ke satu/lebih cabang (`UserBranch`) + branch switcher global di header (`X-Branch-Id`)
- ✅ Dashboard & semua list/stok ter-scope ke cabang aktif; mode "Semua Cabang" (konsolidasi) untuk Owner/Admin
- ✅ Transfer stok antar cabang (request → approve → kirim → terima) dengan mutasi `TRF_OUT`/`TRF_IN` — **Fase 2**
- ✅ Laporan Perbandingan Cabang (revenue, food cost %, waste, pembelian) + PDF — **Fase 3** (`GET /reports/branch-comparison`, halaman `laporan/perbandingan-cabang`)

**Impact**: Siap scale bisnis ke banyak lokasi.

**Catatan implementasi**:
- Stok riil per-cabang ada di `BranchStock` (sumber kebenaran). `Item.currentStock/minStock` kini hanya default template.
- Mutasi stok terpusat lewat helper `adjustBranchStock` (`common/helpers/stock.helper.ts`).
- Akses cabang divalidasi `BranchAccessGuard` + `@CurrentBranch()`; Owner bebas akses semua, role lain wajib anggota.

---

## Tier 3 — Advanced (6-10 minggu/fitur)

### 9. Integrasi POS (Point of Sale)
**Status**: Future
**Estimasi**: 6-8 minggu

Sinkronisasi data penjualan dari sistem kasir:

**Fitur detail**:
- API integration dengan POS populer (iReap, Moka, Majoo, atau custom)
- Webhook receiver untuk data penjualan real-time
- Mapping menu POS ↔ resep di sistem
- Dashboard: revenue vs food cost per menu per hari
- Actual food cost = bahan terpakai / revenue (bukan dari resep standar)
- P&L dapur harian otomatis

**Impact**: End-to-end visibility dari pembelian hingga penjualan.

---

### 10. AI Cost Optimizer
**Status**: Future
**Estimasi**: 6-8 minggu

Rekomendasi otomatis untuk optimasi biaya:

**Fitur detail**:
- Deteksi kenaikan harga bahan → suggest substitusi bahan alternatif
- Simulasi "what-if": jika ganti bahan X dengan Y, food cost berubah berapa?
- Suggest harga jual optimal berdasarkan target margin
- Suggest resep adjustment untuk mencapai target food cost
- Benchmarking food cost terhadap standar industri F&B (28-35%)
- Weekly digest: "3 cara hemat Rp 2 juta minggu ini"

**Impact**: Margin naik otomatis tanpa micromanagement.

---

### 11. Vendor Portal
**Status**: ✅ Selesai (Fase 1–3)
**Estimasi**: 8-10 minggu

Portal self-service untuk supplier:

**Fitur detail**:
- ✅ Login terpisah untuk supplier (`SupplierUser`, strategy `supplier-jwt` independen)
- ✅ Provisioning akun supplier oleh OWNER/ADMIN dari detail supplier internal
- ✅ Supplier bisa lihat PO yang ditujukan ke mereka (scoped by `supplierId` token, cross-supplier → 403)
- ✅ Supplier konfirmasi/update status pengiriman (ACKNOWLEDGED → PREPARING → SHIPPED → DELIVERED) — informasional, independen dari status PO internal
- ✅ Supplier upload invoice/nota langsung (multer `FileInterceptor`, `source=SUPPLIER`); muncul di daftar invoice internal dengan badge "Dari Supplier"
- ✅ Katalog harga: supplier update harga bahan secara berkala; harga lama otomatis di-nonaktifkan
- ✅ Chat/messaging per-supplier antara purchaser dan supplier (polling 15 detik, read-tracking dua arah)

**Impact**: Procurement fully paperless, komunikasi terpusat.

**Catatan implementasi**:
- Auth supplier sepenuhnya terpisah (`SupplierUser` + `supplier-jwt` strategy); token di localStorage key berbeda sehingga sesi internal & supplier bisa berdampingan.
- Route frontend portal di `(portal)/portal/*`; API portal di `POST/GET /portal/*` (guard `SupplierJwtGuard`).
- Upload file nyata via multer (`common/helpers/upload.helper.ts`); fix juga bug lama di invoice internal yang tidak menyimpan file.
- `PurchaseInvoice.createdBy` dinullable-kan agar invoice dari supplier (tanpa user internal) bisa tersimpan.
- Shipment status independen (`PurchaseOrder.shipmentStatus` + riwayat `PoShipmentUpdate`); tidak mengubah status PO internal.

---

### 12. Progressive Web App (PWA) + Barcode
**Status**: ✅ Selesai (Fase 1–3)
**Estimasi**: 6-8 minggu

Mobile app yang bisa diinstall tanpa app store:

**Fitur detail**:
- ✅ PWA installable (manifest + ikon + service worker, `display: standalone`)
- ✅ Offline-capable untuk input produksi & opname (outbox IndexedDB + background sync)
- ✅ Kamera barcode/QR scanner (html5-qrcode + fallback input manual) untuk:
  - ✅ Receiving: scan barcode → fokus baris item PO untuk isi qty
  - ✅ Opname: scan barcode → otomatis tambah baris item, tinggal isi qty fisik
  - ✅ Item lookup: scan → lihat stok cabang aktif & mutasi terakhir
- ⏸️ Push notification native ke HP — **DITUNDA** (future; tetap pakai notifikasi in-app yang sudah ada). Web Push butuh kunci VAPID + HTTPS.
- ✅ Background sync saat kembali online (replay outbox; fallback listener `online` untuk iOS Safari)

**Impact**: Input data di lapangan tanpa laptop, akurasi naik.

**Catatan implementasi**:
- Field `Item.barcode` (unique) baru; lookup `GET /items/lookup?code=` cocokkan **barcode ATAU SKU**, branch-scoped.
- Service worker vanilla di `public/sw.js` (tanpa build-plugin) → aman untuk Turbopack & Webpack; registrasi production-only agar tidak ganggu HMR.
- Outbox `lib/offline-outbox.ts` menyimpan request POST saat offline; `SyncManager` me-replay saat online / pesan SW; entry dihapus hanya setelah HTTP 2xx.
- Kamera & service worker hanya jalan di secure context (HTTPS / localhost).

---

## Timeline Ringkasan

```
2026 Q3 (Jul-Sep):
  ├── Menu Engineering .............. [Jul minggu 1-2]
  ├── Notifikasi & Alert ........... [Jul minggu 2 - Agu minggu 1]
  ├── Supplier Rating .............. [Agu minggu 1-3]
  └── Histori Harga ................ [Agu minggu 3 - Sep minggu 1]

2026 Q4 (Okt-Des):
  ├── Forecasting Bahan ............ [Okt - Nov minggu 1]
  ├── Meal Prep Planner ............ [Nov minggu 1 - Des minggu 1]
  └── FIFO & Expiry ................ [Des]

2027 Q1 (Jan-Mar):
  ├── Multi-Cabang ................. [Jan - Feb minggu 2]
  ├── Integrasi POS ................ [Feb minggu 2 - Mar]
  └── AI Cost Optimizer ............ [Mar - Apr]

2027 Q2+ :
  ├── Vendor Portal
  └── PWA + Barcode
```

---

## Catatan

- Estimasi waktu berdasarkan 1 developer fullstack
- Fitur Tier 1 bisa dimulai segera karena data yang dibutuhkan sudah tersedia
- Fitur Forecasting (Tier 2) butuh minimal 2-3 bulan data historis sebelum akurat
- Fitur Multi-Cabang sudah disiapkan di data model (branch_id nullable)
- Setiap fitur baru harus include: API endpoint, UI halaman, audit trail, role permission
