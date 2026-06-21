import { PrismaClient, Decimal } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function d(n: number): Decimal {
  return new Decimal(n);
}

function daysAgo(n: number): Date {
  const dt = new Date();
  dt.setDate(dt.getDate() - n);
  dt.setHours(8, 0, 0, 0);
  return dt;
}

function formatDocNum(prefix: string, date: Date, seq: number): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${prefix}-${y}${m}${dd}-${String(seq).padStart(3, '0')}`;
}

async function main() {
  console.log('🌱 Seeding demo data...\n');

  // ─── 1. USERS ─────────────────────────────────────────────
  const pw = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mbg.com' },
    update: {},
    create: { email: 'admin@mbg.com', passwordHash: pw, name: 'Rina Wulandari', role: 'ADMIN' },
  });
  const owner = await prisma.user.upsert({
    where: { email: 'owner@mbg.com' },
    update: {},
    create: { email: 'owner@mbg.com', passwordHash: pw, name: 'Budi Santoso', role: 'OWNER' },
  });
  const purchaser = await prisma.user.upsert({
    where: { email: 'purchaser@mbg.com' },
    update: {},
    create: { email: 'purchaser@mbg.com', passwordHash: pw, name: 'Anto Prasetyo', role: 'PURCHASER' },
  });
  const kitchen = await prisma.user.upsert({
    where: { email: 'kitchen@mbg.com' },
    update: {},
    create: { email: 'kitchen@mbg.com', passwordHash: pw, name: 'Chef Dani', role: 'KITCHEN_MANAGER' },
  });

  console.log('✓ 4 users created');

  // ─── 2. UNITS ─────────────────────────────────────────────
  const unitData = [
    { name: 'Kilogram', abbreviation: 'kg' },
    { name: 'Gram', abbreviation: 'g' },
    { name: 'Liter', abbreviation: 'L' },
    { name: 'Mililiter', abbreviation: 'ml' },
    { name: 'Pcs', abbreviation: 'pcs' },
    { name: 'Pack', abbreviation: 'pack' },
    { name: 'Karton', abbreviation: 'ktn' },
    { name: 'Botol', abbreviation: 'btl' },
    { name: 'Kaleng', abbreviation: 'klg' },
    { name: 'Bungkus', abbreviation: 'bks' },
  ];

  const units: Record<string, number> = {};
  for (const u of unitData) {
    const r = await prisma.unitOfMeasure.upsert({
      where: { id: unitData.indexOf(u) + 1 },
      update: u,
      create: u,
    });
    units[u.abbreviation] = r.id;
  }

  await prisma.unitConversion.upsert({
    where: { fromUnitId_toUnitId: { fromUnitId: units['kg']!, toUnitId: units['g']! } },
    update: { factor: 1000 },
    create: { fromUnitId: units['kg']!, toUnitId: units['g']!, factor: 1000 },
  });
  await prisma.unitConversion.upsert({
    where: { fromUnitId_toUnitId: { fromUnitId: units['L']!, toUnitId: units['ml']! } },
    update: { factor: 1000 },
    create: { fromUnitId: units['L']!, toUnitId: units['ml']!, factor: 1000 },
  });

  console.log('✓ 10 units + 2 conversions');

  // ─── 3. CATEGORIES ────────────────────────────────────────
  const itemCats = ['Bahan Baku', 'Bumbu & Rempah', 'Minyak & Lemak', 'Sayuran', 'Protein', 'Kemasan', 'Bahan Habis Pakai'];
  const recipeCats = ['Makanan Utama', 'Lauk', 'Sambal & Saus', 'Minuman', 'Snack'];
  const cats: Record<string, number> = {};

  for (const name of itemCats) {
    const r = await prisma.category.upsert({
      where: { id: itemCats.indexOf(name) + 1 },
      update: { name, type: 'ITEM' },
      create: { name, type: 'ITEM' },
    });
    cats[name] = r.id;
  }
  for (const name of recipeCats) {
    const r = await prisma.category.upsert({
      where: { id: itemCats.length + recipeCats.indexOf(name) + 1 },
      update: { name, type: 'RECIPE' },
      create: { name, type: 'RECIPE' },
    });
    cats[name] = r.id;
  }

  console.log('✓ 12 categories');

  // ─── 4. SUPPLIERS ─────────────────────────────────────────
  const supplierData = [
    { name: 'PT Sumber Makmur', phone: '081234567890', category: 'Protein & Bahan Baku', contactPerson: 'Pak Hendra', address: 'Jl. Pasar Besar No. 45, Surabaya' },
    { name: 'CV Bahan Segar', phone: '082345678901', category: 'Sayuran & Buah', contactPerson: 'Bu Sari', address: 'Jl. Raya Pasar Minggu No. 12, Jakarta' },
    { name: 'UD Rempah Nusantara', phone: '083456789012', category: 'Bumbu & Rempah', contactPerson: 'Pak Joko', address: 'Jl. Rempah No. 8, Yogyakarta' },
    { name: 'Toko Minyak Jaya', phone: '084567890123', category: 'Minyak & Bahan Cair', contactPerson: 'Pak Agus', address: 'Jl. Industri No. 22, Semarang' },
    { name: 'CV Kemasan Pratama', phone: '085678901234', category: 'Kemasan & Disposable', contactPerson: 'Bu Dewi', address: 'Jl. Kemasan No. 5, Bandung' },
  ];

  const suppliers: Record<string, number> = {};
  for (const s of supplierData) {
    const r = await prisma.supplier.create({ data: s });
    suppliers[s.name] = r.id;
  }

  console.log('✓ 5 suppliers');

  // ─── 5. ITEMS (25 bahan baku) ─────────────────────────────
  const itemsData: Array<{ sku: string; name: string; cat: string; unit: string; minStock: number; currentStock: number; lastPrice: number }> = [
    // Protein
    { sku: 'ITM-PR-001', name: 'Ayam Fillet', cat: 'Protein', unit: 'kg', minStock: 10, currentStock: 25, lastPrice: 38000 },
    { sku: 'ITM-PR-002', name: 'Daging Sapi Has Dalam', cat: 'Protein', unit: 'kg', minStock: 5, currentStock: 12, lastPrice: 135000 },
    { sku: 'ITM-PR-003', name: 'Udang Kupas', cat: 'Protein', unit: 'kg', minStock: 5, currentStock: 8, lastPrice: 85000 },
    { sku: 'ITM-PR-004', name: 'Telur Ayam', cat: 'Protein', unit: 'pcs', minStock: 100, currentStock: 250, lastPrice: 2500 },
    { sku: 'ITM-PR-005', name: 'Ikan Dori Fillet', cat: 'Protein', unit: 'kg', minStock: 5, currentStock: 7, lastPrice: 55000 },
    // Bahan Baku
    { sku: 'ITM-BB-001', name: 'Beras Premium', cat: 'Bahan Baku', unit: 'kg', minStock: 25, currentStock: 60, lastPrice: 14000 },
    { sku: 'ITM-BB-002', name: 'Tepung Terigu', cat: 'Bahan Baku', unit: 'kg', minStock: 10, currentStock: 30, lastPrice: 12000 },
    { sku: 'ITM-BB-003', name: 'Gula Pasir', cat: 'Bahan Baku', unit: 'kg', minStock: 10, currentStock: 20, lastPrice: 16000 },
    { sku: 'ITM-BB-004', name: 'Santan Kelapa', cat: 'Bahan Baku', unit: 'L', minStock: 5, currentStock: 15, lastPrice: 25000 },
    // Bumbu & Rempah
    { sku: 'ITM-BR-001', name: 'Bawang Merah', cat: 'Bumbu & Rempah', unit: 'kg', minStock: 5, currentStock: 3, lastPrice: 35000 },
    { sku: 'ITM-BR-002', name: 'Bawang Putih', cat: 'Bumbu & Rempah', unit: 'kg', minStock: 5, currentStock: 8, lastPrice: 42000 },
    { sku: 'ITM-BR-003', name: 'Cabai Merah Keriting', cat: 'Bumbu & Rempah', unit: 'kg', minStock: 3, currentStock: 2, lastPrice: 45000 },
    { sku: 'ITM-BR-004', name: 'Jahe', cat: 'Bumbu & Rempah', unit: 'kg', minStock: 2, currentStock: 5, lastPrice: 28000 },
    { sku: 'ITM-BR-005', name: 'Kunyit', cat: 'Bumbu & Rempah', unit: 'kg', minStock: 2, currentStock: 4, lastPrice: 25000 },
    { sku: 'ITM-BR-006', name: 'Garam', cat: 'Bumbu & Rempah', unit: 'kg', minStock: 5, currentStock: 15, lastPrice: 8000 },
    { sku: 'ITM-BR-007', name: 'Merica Bubuk', cat: 'Bumbu & Rempah', unit: 'pack', minStock: 10, currentStock: 20, lastPrice: 5000 },
    // Sayuran
    { sku: 'ITM-SY-001', name: 'Wortel', cat: 'Sayuran', unit: 'kg', minStock: 5, currentStock: 10, lastPrice: 15000 },
    { sku: 'ITM-SY-002', name: 'Kentang', cat: 'Sayuran', unit: 'kg', minStock: 5, currentStock: 12, lastPrice: 18000 },
    { sku: 'ITM-SY-003', name: 'Buncis', cat: 'Sayuran', unit: 'kg', minStock: 3, currentStock: 6, lastPrice: 12000 },
    { sku: 'ITM-SY-004', name: 'Tomat', cat: 'Sayuran', unit: 'kg', minStock: 3, currentStock: 8, lastPrice: 10000 },
    // Minyak & Lemak
    { sku: 'ITM-ML-001', name: 'Minyak Goreng', cat: 'Minyak & Lemak', unit: 'L', minStock: 10, currentStock: 20, lastPrice: 18000 },
    { sku: 'ITM-ML-002', name: 'Mentega', cat: 'Minyak & Lemak', unit: 'kg', minStock: 3, currentStock: 5, lastPrice: 28000 },
    // Kemasan
    { sku: 'ITM-KM-001', name: 'Box Makan Kertas', cat: 'Kemasan', unit: 'pcs', minStock: 200, currentStock: 500, lastPrice: 1500 },
    { sku: 'ITM-KM-002', name: 'Plastik Wrap', cat: 'Kemasan', unit: 'pack', minStock: 10, currentStock: 25, lastPrice: 15000 },
    // Bahan Habis Pakai
    { sku: 'ITM-HP-001', name: 'Gas LPG 12kg', cat: 'Bahan Habis Pakai', unit: 'pcs', minStock: 3, currentStock: 5, lastPrice: 185000 },
  ];

  const items: Record<string, number> = {};
  for (const it of itemsData) {
    const r = await prisma.item.create({
      data: {
        sku: it.sku,
        name: it.name,
        categoryId: cats[it.cat]!,
        baseUnitId: units[it.unit]!,
        purchaseUnitId: units[it.unit]!,
        conversionFactor: 1,
        minStock: it.minStock,
        currentStock: it.currentStock,
        lastPrice: it.lastPrice,
      },
    });
    items[it.name] = r.id;
  }

  console.log('✓ 25 items');

  // ─── 6. PURCHASE ORDERS (berbagai status) ─────────────────

  // Helper: create full PO with items
  async function createPO(
    supplier: string,
    daysBack: number,
    status: string,
    poItems: Array<{ item: string; qty: number; price: number }>,
    expectedDaysBack?: number,
    approved?: boolean,
  ) {
    const date = daysAgo(daysBack);
    const poCount = await prisma.purchaseOrder.count();
    const poNum = formatDocNum('PO', date, poCount + 1);
    let totalAmount = 0;
    for (const pi of poItems) totalAmount += pi.qty * pi.price;

    const po = await prisma.purchaseOrder.create({
      data: {
        poNumber: poNum,
        supplierId: suppliers[supplier]!,
        poDate: date,
        expectedDate: expectedDaysBack !== undefined ? daysAgo(expectedDaysBack) : null,
        status,
        totalAmount: d(totalAmount),
        createdBy: purchaser.id,
        approvedBy: approved ? admin.id : null,
        approvedAt: approved ? daysAgo(daysBack - 1) : null,
      },
    });

    for (const pi of poItems) {
      await prisma.purchaseOrderItem.create({
        data: {
          poId: po.id,
          itemId: items[pi.item]!,
          quantity: d(pi.qty),
          unitId: units['kg']!,
          unitPrice: d(pi.price),
          totalPrice: d(pi.qty * pi.price),
          receivedQty: status === 'COMPLETED' ? d(pi.qty) : d(0),
        },
      });
    }

    return po;
  }

  // Completed POs (30-60 days ago) — untuk histori supplier rating
  const po1 = await createPO('PT Sumber Makmur', 55, 'COMPLETED',
    [{ item: 'Ayam Fillet', qty: 20, price: 36000 }, { item: 'Daging Sapi Has Dalam', qty: 5, price: 130000 }], 50, true);
  const po2 = await createPO('CV Bahan Segar', 50, 'COMPLETED',
    [{ item: 'Wortel', qty: 10, price: 14000 }, { item: 'Kentang', qty: 10, price: 17000 }, { item: 'Tomat', qty: 5, price: 9500 }], 45, true);
  const po3 = await createPO('UD Rempah Nusantara', 45, 'COMPLETED',
    [{ item: 'Bawang Merah', qty: 10, price: 32000 }, { item: 'Bawang Putih', qty: 8, price: 40000 }, { item: 'Cabai Merah Keriting', qty: 5, price: 40000 }], 40, true);
  const po4 = await createPO('PT Sumber Makmur', 35, 'COMPLETED',
    [{ item: 'Ayam Fillet', qty: 25, price: 37000 }, { item: 'Udang Kupas', qty: 10, price: 82000 }], 30, true);
  const po5 = await createPO('Toko Minyak Jaya', 40, 'COMPLETED',
    [{ item: 'Minyak Goreng', qty: 20, price: 17500 }, { item: 'Mentega', qty: 5, price: 27000 }], 35, true);
  const po6 = await createPO('CV Bahan Segar', 25, 'COMPLETED',
    [{ item: 'Wortel', qty: 8, price: 15000 }, { item: 'Buncis', qty: 5, price: 12000 }, { item: 'Tomat', qty: 8, price: 10000 }], 20, true);
  const po7 = await createPO('PT Sumber Makmur', 15, 'COMPLETED',
    [{ item: 'Ayam Fillet', qty: 30, price: 38000 }, { item: 'Telur Ayam', qty: 200, price: 2500 }], 12, true);
  const po8 = await createPO('UD Rempah Nusantara', 10, 'COMPLETED',
    [{ item: 'Bawang Merah', qty: 8, price: 35000 }, { item: 'Cabai Merah Keriting', qty: 5, price: 45000 }], 7, true);

  // Active POs — various statuses for demo
  const po9 = await createPO('PT Sumber Makmur', 3, 'APPROVED',
    [{ item: 'Daging Sapi Has Dalam', qty: 8, price: 135000 }, { item: 'Ikan Dori Fillet', qty: 10, price: 55000 }], 0, true);
  const po10 = await createPO('CV Kemasan Pratama', 2, 'PENDING_APPROVAL',
    [{ item: 'Box Makan Kertas', qty: 500, price: 1500 }, { item: 'Plastik Wrap', qty: 20, price: 15000 }]);
  await createPO('Toko Minyak Jaya', 1, 'DRAFT',
    [{ item: 'Minyak Goreng', qty: 30, price: 18000 }, { item: 'Gas LPG 12kg', qty: 3, price: 185000 }]);

  console.log('✓ 11 purchase orders (various statuses)');

  // ─── 7. RECEIVINGS + STOCK MOVEMENTS + PRICE HISTORY ──────
  async function createReceiving(po: any, daysBack: number, rcvItems: Array<{ item: string; qty: number }>) {
    const date = daysAgo(daysBack);
    const count = await prisma.receiving.count();
    const rcvNum = formatDocNum('RCV', date, count + 1);

    const rcv = await prisma.receiving.create({
      data: {
        receivingNumber: rcvNum,
        poId: po.id,
        receivedDate: date,
        createdBy: purchaser.id,
      },
    });

    const poItemsList = await prisma.purchaseOrderItem.findMany({ where: { poId: po.id } });

    for (const ri of rcvItems) {
      const poItem = poItemsList.find(pi => pi.itemId === items[ri.item]);
      if (!poItem) continue;

      await prisma.receivingItem.create({
        data: {
          receivingId: rcv.id,
          poItemId: poItem.id,
          itemId: items[ri.item]!,
          quantity: d(ri.qty),
          unitId: units['kg']!,
        },
      });

      // Stock movement
      const item = await prisma.item.findUnique({ where: { id: items[ri.item]! } });
      const qtyBefore = Number(item!.currentStock);
      await prisma.stockMovement.create({
        data: {
          itemId: items[ri.item]!,
          movementType: 'RCV',
          referenceType: 'RECEIVING',
          referenceId: rcv.id,
          qtyBefore: d(qtyBefore),
          qtyChange: d(ri.qty),
          qtyAfter: d(qtyBefore + ri.qty),
          createdBy: purchaser.id,
        },
      });

      // Price history
      await prisma.priceHistory.create({
        data: {
          itemId: items[ri.item]!,
          supplierId: po.supplierId,
          price: poItem.unitPrice,
          quantity: d(ri.qty),
          poId: po.id,
          recordedAt: date,
        },
      });
    }

    return rcv;
  }

  await createReceiving(po1, 50, [{ item: 'Ayam Fillet', qty: 20 }, { item: 'Daging Sapi Has Dalam', qty: 5 }]);
  await createReceiving(po2, 45, [{ item: 'Wortel', qty: 10 }, { item: 'Kentang', qty: 10 }, { item: 'Tomat', qty: 5 }]);
  await createReceiving(po3, 40, [{ item: 'Bawang Merah', qty: 10 }, { item: 'Bawang Putih', qty: 8 }, { item: 'Cabai Merah Keriting', qty: 5 }]);
  await createReceiving(po4, 30, [{ item: 'Ayam Fillet', qty: 25 }, { item: 'Udang Kupas', qty: 10 }]);
  await createReceiving(po5, 35, [{ item: 'Minyak Goreng', qty: 20 }, { item: 'Mentega', qty: 5 }]);
  await createReceiving(po6, 20, [{ item: 'Wortel', qty: 8 }, { item: 'Buncis', qty: 5 }, { item: 'Tomat', qty: 8 }]);
  await createReceiving(po7, 12, [{ item: 'Ayam Fillet', qty: 30 }, { item: 'Telur Ayam', qty: 200 }]);
  await createReceiving(po8, 7, [{ item: 'Bawang Merah', qty: 8 }, { item: 'Cabai Merah Keriting', qty: 5 }]);

  console.log('✓ 8 receivings + stock movements + price history');

  // ─── 8. INVOICES ──────────────────────────────────────────
  await prisma.purchaseInvoice.create({
    data: { invoiceNumber: 'INV-SM-2026-001', poId: po1.id, supplierId: suppliers['PT Sumber Makmur']!, invoiceDate: daysAgo(49), totalAmount: d(1370000), status: 'VERIFIED', verifiedBy: admin.id, createdBy: purchaser.id },
  });
  await prisma.purchaseInvoice.create({
    data: { invoiceNumber: 'INV-BS-2026-001', poId: po2.id, supplierId: suppliers['CV Bahan Segar']!, invoiceDate: daysAgo(44), totalAmount: d(357500), status: 'VERIFIED', verifiedBy: admin.id, createdBy: purchaser.id },
  });
  await prisma.purchaseInvoice.create({
    data: { invoiceNumber: 'INV-RN-2026-001', poId: po3.id, supplierId: suppliers['UD Rempah Nusantara']!, invoiceDate: daysAgo(39), totalAmount: d(840000), status: 'PENDING', createdBy: purchaser.id },
  });

  console.log('✓ 3 invoices');

  // ─── 9. RECIPES ───────────────────────────────────────────
  interface RecipeDef { name: string; cat: string; yield: number; sell: number; ingredients: Array<{ item: string; qty: number; unit: string }> }

  const recipeDefs: RecipeDef[] = [
    {
      name: 'Nasi Goreng Spesial', cat: 'Makanan Utama', yield: 1, sell: 25000,
      ingredients: [
        { item: 'Beras Premium', qty: 0.2, unit: 'kg' },
        { item: 'Ayam Fillet', qty: 0.1, unit: 'kg' },
        { item: 'Telur Ayam', qty: 2, unit: 'pcs' },
        { item: 'Bawang Merah', qty: 0.03, unit: 'kg' },
        { item: 'Bawang Putih', qty: 0.02, unit: 'kg' },
        { item: 'Minyak Goreng', qty: 0.03, unit: 'L' },
        { item: 'Garam', qty: 0.005, unit: 'kg' },
      ],
    },
    {
      name: 'Ayam Geprek', cat: 'Makanan Utama', yield: 1, sell: 22000,
      ingredients: [
        { item: 'Ayam Fillet', qty: 0.15, unit: 'kg' },
        { item: 'Tepung Terigu', qty: 0.05, unit: 'kg' },
        { item: 'Telur Ayam', qty: 1, unit: 'pcs' },
        { item: 'Cabai Merah Keriting', qty: 0.05, unit: 'kg' },
        { item: 'Bawang Putih', qty: 0.02, unit: 'kg' },
        { item: 'Minyak Goreng', qty: 0.1, unit: 'L' },
        { item: 'Beras Premium', qty: 0.15, unit: 'kg' },
      ],
    },
    {
      name: 'Steak Daging Sapi', cat: 'Makanan Utama', yield: 1, sell: 55000,
      ingredients: [
        { item: 'Daging Sapi Has Dalam', qty: 0.2, unit: 'kg' },
        { item: 'Mentega', qty: 0.02, unit: 'kg' },
        { item: 'Kentang', qty: 0.15, unit: 'kg' },
        { item: 'Wortel', qty: 0.05, unit: 'kg' },
        { item: 'Buncis', qty: 0.05, unit: 'kg' },
        { item: 'Merica Bubuk', qty: 1, unit: 'pack' },
        { item: 'Garam', qty: 0.005, unit: 'kg' },
      ],
    },
    {
      name: 'Udang Saus Padang', cat: 'Lauk', yield: 1, sell: 35000,
      ingredients: [
        { item: 'Udang Kupas', qty: 0.15, unit: 'kg' },
        { item: 'Cabai Merah Keriting', qty: 0.04, unit: 'kg' },
        { item: 'Bawang Merah', qty: 0.03, unit: 'kg' },
        { item: 'Bawang Putih', qty: 0.02, unit: 'kg' },
        { item: 'Tomat', qty: 0.05, unit: 'kg' },
        { item: 'Gula Pasir', qty: 0.01, unit: 'kg' },
        { item: 'Minyak Goreng', qty: 0.05, unit: 'L' },
      ],
    },
    {
      name: 'Ikan Dori Goreng Tepung', cat: 'Lauk', yield: 1, sell: 28000,
      ingredients: [
        { item: 'Ikan Dori Fillet', qty: 0.15, unit: 'kg' },
        { item: 'Tepung Terigu', qty: 0.05, unit: 'kg' },
        { item: 'Telur Ayam', qty: 1, unit: 'pcs' },
        { item: 'Minyak Goreng', qty: 0.1, unit: 'L' },
        { item: 'Garam', qty: 0.003, unit: 'kg' },
        { item: 'Merica Bubuk', qty: 1, unit: 'pack' },
      ],
    },
    {
      name: 'Sambal Matah', cat: 'Sambal & Saus', yield: 10, sell: 5000,
      ingredients: [
        { item: 'Bawang Merah', qty: 0.3, unit: 'kg' },
        { item: 'Cabai Merah Keriting', qty: 0.15, unit: 'kg' },
        { item: 'Garam', qty: 0.02, unit: 'kg' },
        { item: 'Minyak Goreng', qty: 0.05, unit: 'L' },
      ],
    },
    {
      name: 'Sop Ayam', cat: 'Makanan Utama', yield: 1, sell: 20000,
      ingredients: [
        { item: 'Ayam Fillet', qty: 0.12, unit: 'kg' },
        { item: 'Wortel', qty: 0.05, unit: 'kg' },
        { item: 'Kentang', qty: 0.08, unit: 'kg' },
        { item: 'Buncis', qty: 0.03, unit: 'kg' },
        { item: 'Bawang Putih', qty: 0.01, unit: 'kg' },
        { item: 'Merica Bubuk', qty: 1, unit: 'pack' },
        { item: 'Garam', qty: 0.005, unit: 'kg' },
      ],
    },
    {
      name: 'Es Teh Manis', cat: 'Minuman', yield: 1, sell: 8000,
      ingredients: [
        { item: 'Gula Pasir', qty: 0.03, unit: 'kg' },
      ],
    },
    {
      name: 'Kentang Goreng', cat: 'Snack', yield: 1, sell: 15000,
      ingredients: [
        { item: 'Kentang', qty: 0.2, unit: 'kg' },
        { item: 'Minyak Goreng', qty: 0.15, unit: 'L' },
        { item: 'Garam', qty: 0.003, unit: 'kg' },
      ],
    },
    {
      name: 'Nasi Kuning', cat: 'Makanan Utama', yield: 1, sell: 18000,
      ingredients: [
        { item: 'Beras Premium', qty: 0.2, unit: 'kg' },
        { item: 'Santan Kelapa', qty: 0.1, unit: 'L' },
        { item: 'Kunyit', qty: 0.01, unit: 'kg' },
        { item: 'Jahe', qty: 0.005, unit: 'kg' },
        { item: 'Garam', qty: 0.005, unit: 'kg' },
      ],
    },
  ];

  const recipes: Record<string, number> = {};
  for (const rd of recipeDefs) {
    let estimatedCost = 0;
    for (const ing of rd.ingredients) {
      const it = itemsData.find(i => i.name === ing.item)!;
      estimatedCost += (ing.qty / rd.yield) * it.lastPrice;
    }

    const recipe = await prisma.recipe.create({
      data: {
        name: rd.name,
        categoryId: cats[rd.cat]!,
        yieldQuantity: d(rd.yield),
        yieldUnit: 'porsi',
        sellingPrice: d(rd.sell),
        estimatedCost: d(Math.round(estimatedCost)),
        createdBy: kitchen.id,
      },
    });
    recipes[rd.name] = recipe.id;

    for (const ing of rd.ingredients) {
      await prisma.recipeItem.create({
        data: {
          recipeId: recipe.id,
          itemId: items[ing.item]!,
          quantity: d(ing.qty),
          unitId: units[ing.unit]!,
        },
      });
    }
  }

  console.log('✓ 10 recipes with ingredients');

  // ─── 10. PRODUCTIONS (30 hari terakhir) ───────────────────
  const productionPlan: Array<{ recipe: string; qty: number; daysBack: number }> = [
    // Minggu 1 (25-30 hari lalu)
    { recipe: 'Nasi Goreng Spesial', qty: 50, daysBack: 30 },
    { recipe: 'Ayam Geprek', qty: 60, daysBack: 30 },
    { recipe: 'Steak Daging Sapi', qty: 15, daysBack: 30 },
    { recipe: 'Sop Ayam', qty: 30, daysBack: 29 },
    { recipe: 'Es Teh Manis', qty: 80, daysBack: 29 },
    { recipe: 'Sambal Matah', qty: 5, daysBack: 28 },
    { recipe: 'Kentang Goreng', qty: 40, daysBack: 28 },
    // Minggu 2
    { recipe: 'Nasi Goreng Spesial', qty: 55, daysBack: 23 },
    { recipe: 'Ayam Geprek', qty: 65, daysBack: 23 },
    { recipe: 'Udang Saus Padang', qty: 20, daysBack: 22 },
    { recipe: 'Ikan Dori Goreng Tepung', qty: 25, daysBack: 22 },
    { recipe: 'Steak Daging Sapi', qty: 12, daysBack: 21 },
    { recipe: 'Es Teh Manis', qty: 90, daysBack: 21 },
    { recipe: 'Nasi Kuning', qty: 35, daysBack: 20 },
    // Minggu 3
    { recipe: 'Nasi Goreng Spesial', qty: 45, daysBack: 16 },
    { recipe: 'Ayam Geprek', qty: 70, daysBack: 16 },
    { recipe: 'Steak Daging Sapi', qty: 18, daysBack: 15 },
    { recipe: 'Sop Ayam', qty: 35, daysBack: 15 },
    { recipe: 'Udang Saus Padang', qty: 15, daysBack: 14 },
    { recipe: 'Sambal Matah', qty: 8, daysBack: 14 },
    { recipe: 'Kentang Goreng', qty: 45, daysBack: 13 },
    { recipe: 'Es Teh Manis', qty: 85, daysBack: 13 },
    // Minggu 4
    { recipe: 'Nasi Goreng Spesial', qty: 60, daysBack: 9 },
    { recipe: 'Ayam Geprek', qty: 75, daysBack: 9 },
    { recipe: 'Steak Daging Sapi', qty: 10, daysBack: 8 },
    { recipe: 'Ikan Dori Goreng Tepung', qty: 30, daysBack: 8 },
    { recipe: 'Sop Ayam', qty: 40, daysBack: 7 },
    { recipe: 'Nasi Kuning', qty: 40, daysBack: 7 },
    { recipe: 'Es Teh Manis', qty: 100, daysBack: 6 },
    // Minggu ini
    { recipe: 'Nasi Goreng Spesial', qty: 48, daysBack: 2 },
    { recipe: 'Ayam Geprek', qty: 55, daysBack: 2 },
    { recipe: 'Steak Daging Sapi', qty: 14, daysBack: 1 },
    { recipe: 'Udang Saus Padang', qty: 18, daysBack: 1 },
    { recipe: 'Kentang Goreng', qty: 35, daysBack: 0 },
    { recipe: 'Es Teh Manis', qty: 70, daysBack: 0 },
  ];

  for (const pp of productionPlan) {
    const date = daysAgo(pp.daysBack);
    const count = await prisma.production.count();
    const prodNum = formatDocNum('PROD', date, count + 1);

    const prod = await prisma.production.create({
      data: {
        productionNumber: prodNum,
        productionDate: date,
        recipeId: recipes[pp.recipe]!,
        plannedQty: d(pp.qty),
        actualQty: d(pp.qty),
        status: 'COMPLETED',
        createdBy: kitchen.id,
      },
    });

    const recipeItems = await prisma.recipeItem.findMany({ where: { recipeId: recipes[pp.recipe]! } });
    for (const ri of recipeItems) {
      const qtyUsed = Number(ri.quantity) * pp.qty;
      await prisma.productionItem.create({
        data: {
          productionId: prod.id,
          itemId: ri.itemId,
          plannedQty: d(qtyUsed),
          actualQty: d(qtyUsed),
          unitId: ri.unitId,
        },
      });
    }
  }

  console.log('✓ 35 production records');

  // ─── 11. WASTE RECORDS ────────────────────────────────────
  const wastes = [
    { item: 'Ayam Fillet', qty: 0.5, cat: 'DAMAGED', days: 25, note: 'Daging berubah warna' },
    { item: 'Tomat', qty: 1.5, cat: 'EXPIRED', days: 20, note: 'Tomat busuk' },
    { item: 'Bawang Merah', qty: 0.3, cat: 'PRODUCTION_LEFTOVER', days: 15, note: 'Sisa irisan' },
    { item: 'Minyak Goreng', qty: 2, cat: 'PRODUCTION_LEFTOVER', days: 12, note: 'Minyak bekas goreng (hitam)' },
    { item: 'Cabai Merah Keriting', qty: 0.5, cat: 'EXPIRED', days: 10, note: 'Cabai layu/kering' },
    { item: 'Kentang', qty: 1, cat: 'DAMAGED', days: 7, note: 'Kentang tumbuh tunas' },
    { item: 'Wortel', qty: 0.8, cat: 'EXPIRED', days: 5, note: 'Wortel berlendir' },
    { item: 'Beras Premium', qty: 0.5, cat: 'SPILLED', days: 3, note: 'Tumpah saat dipindahkan' },
    { item: 'Udang Kupas', qty: 0.3, cat: 'DAMAGED', days: 2, note: 'Udang bau tidak segar' },
    { item: 'Telur Ayam', qty: 5, cat: 'DAMAGED', days: 1, note: 'Telur pecah saat pengiriman' },
  ];

  for (const w of wastes) {
    await prisma.wasteRecord.create({
      data: {
        wasteDate: daysAgo(w.days),
        itemId: items[w.item]!,
        quantity: d(w.qty),
        unitId: units[itemsData.find(i => i.name === w.item)!.unit]!,
        category: w.cat,
        notes: w.note,
        createdBy: kitchen.id,
      },
    });
  }

  console.log('✓ 10 waste records');

  // ─── 12. STOCK OPNAME ─────────────────────────────────────
  const opname = await prisma.stockOpname.create({
    data: {
      opnameNumber: formatDocNum('OPN', daysAgo(5), 1),
      opnameDate: daysAgo(5),
      status: 'APPROVED',
      approvedBy: admin.id,
      approvedAt: daysAgo(4),
      createdBy: admin.id,
    },
  });

  const opnameItems = [
    { item: 'Ayam Fillet', system: 25, actual: 24.5 },
    { item: 'Beras Premium', system: 60, actual: 59 },
    { item: 'Minyak Goreng', system: 20, actual: 19.5 },
    { item: 'Telur Ayam', system: 250, actual: 248 },
    { item: 'Garam', system: 15, actual: 15 },
  ];

  for (const oi of opnameItems) {
    await prisma.stockOpnameItem.create({
      data: {
        opnameId: opname.id,
        itemId: items[oi.item]!,
        systemQty: d(oi.system),
        actualQty: d(oi.actual),
        difference: d(oi.actual - oi.system),
      },
    });
  }

  console.log('✓ 1 stock opname (approved)');

  // ─── 13. NOTIFICATIONS ───────────────────────────────────
  const notifs = [
    { userId: purchaser.id, type: 'LOW_STOCK', title: 'Stok Rendah: Bawang Merah', message: 'Stok Bawang Merah (ITM-BR-001) saat ini 3 kg, di bawah minimum 5 kg.', link: '/stok/item', days: 1 },
    { userId: purchaser.id, type: 'LOW_STOCK', title: 'Stok Rendah: Cabai Merah Keriting', message: 'Stok Cabai Merah Keriting (ITM-BR-003) saat ini 2 kg, di bawah minimum 3 kg.', link: '/stok/item', days: 1 },
    { userId: admin.id, type: 'LOW_STOCK', title: 'Stok Rendah: Bawang Merah', message: 'Stok Bawang Merah (ITM-BR-001) saat ini 3 kg, di bawah minimum 5 kg.', link: '/stok/item', days: 1 },
    { userId: admin.id, type: 'PO_PENDING', title: 'PO Menunggu Persetujuan: ' + po10.poNumber, message: `Purchase Order ${po10.poNumber} dari CV Kemasan Pratama sudah lebih dari 24 jam menunggu persetujuan.`, link: `/pembelian/purchase-order/${po10.id}`, days: 0 },
    { userId: owner.id, type: 'PO_PENDING', title: 'PO Menunggu Persetujuan: ' + po10.poNumber, message: `Purchase Order ${po10.poNumber} dari CV Kemasan Pratama sudah lebih dari 24 jam menunggu persetujuan.`, link: `/pembelian/purchase-order/${po10.id}`, days: 0 },
    { userId: purchaser.id, type: 'PRICE_ALERT', title: 'Kenaikan Harga: Cabai Merah Keriting', message: 'Harga Cabai Merah Keriting naik 12.5% dari rata-rata 30 hari (Rp 45.000 vs rata-rata Rp 40.000).', link: '/stok/histori-harga', days: 0 },
    { userId: owner.id, type: 'PRICE_ALERT', title: 'Kenaikan Harga: Cabai Merah Keriting', message: 'Harga Cabai Merah Keriting naik 12.5% dari rata-rata 30 hari (Rp 45.000 vs rata-rata Rp 40.000).', link: '/stok/histori-harga', days: 0 },
  ];

  for (const n of notifs) {
    await prisma.notification.create({
      data: {
        userId: n.userId,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        createdAt: daysAgo(n.days),
      },
    });
  }

  console.log('✓ 7 notifications');

  // ─── 14. AUDIT LOG ────────────────────────────────────────
  const auditEntries = [
    { userId: admin.id, action: 'CREATE', entityType: 'Supplier', entityId: suppliers['PT Sumber Makmur']!, days: 60 },
    { userId: purchaser.id, action: 'CREATE', entityType: 'PurchaseOrder', entityId: po1.id, days: 55 },
    { userId: admin.id, action: 'APPROVE', entityType: 'PurchaseOrder', entityId: po1.id, days: 54 },
    { userId: purchaser.id, action: 'CREATE', entityType: 'Receiving', entityId: 1, days: 50 },
    { userId: kitchen.id, action: 'CREATE', entityType: 'Recipe', entityId: recipes['Nasi Goreng Spesial']!, days: 45 },
    { userId: kitchen.id, action: 'CREATE', entityType: 'Production', entityId: 1, days: 30 },
    { userId: kitchen.id, action: 'CREATE', entityType: 'WasteRecord', entityId: 1, days: 25 },
    { userId: admin.id, action: 'APPROVE', entityType: 'StockOpname', entityId: opname.id, days: 4 },
  ];

  for (const ae of auditEntries) {
    await prisma.auditLog.create({
      data: {
        userId: ae.userId,
        action: ae.action,
        entityType: ae.entityType,
        entityId: ae.entityId,
        createdAt: daysAgo(ae.days),
      },
    });
  }

  console.log('✓ 8 audit log entries');

  // ─── 15. SEASONAL FACTORS ──────────────────────────────────
  const seasonalFactors = [
    { name: 'Ramadhan 2026', startDate: new Date('2026-02-18'), endDate: new Date('2026-03-19'), multiplier: 1.4, scope: 'GLOBAL', notes: 'Peningkatan produksi selama Ramadhan' },
    { name: 'Libur Lebaran 2026', startDate: new Date('2026-03-20'), endDate: new Date('2026-03-25'), multiplier: 0.3, scope: 'GLOBAL', notes: 'Penurunan drastis saat libur' },
    { name: 'Liburan Sekolah Juli', startDate: new Date('2026-07-01'), endDate: new Date('2026-07-15'), multiplier: 1.2, scope: 'GLOBAL', notes: 'Sedikit peningkatan saat liburan sekolah' },
    { name: 'Promo Steak Spesial', startDate: daysAgo(5), endDate: daysAgo(-10), multiplier: 1.5, scope: 'CATEGORY', categoryId: cats['Makanan Utama'], notes: 'Promo steak weekday' },
  ];

  for (const sf of seasonalFactors) {
    await prisma.seasonalFactor.create({ data: sf as any });
  }

  console.log('✓ 4 seasonal factors');

  // ─── 16. DEMAND FORECASTS (snapshot historis untuk akurasi) ─
  const forecastItems = [
    { name: 'Ayam Fillet', itemKey: 'Ayam Fillet' },
    { name: 'Beras Premium', itemKey: 'Beras Premium' },
    { name: 'Minyak Goreng', itemKey: 'Minyak Goreng' },
    { name: 'Bawang Merah', itemKey: 'Bawang Merah' },
    { name: 'Telur Ayam', itemKey: 'Telur Ayam' },
    { name: 'Kentang', itemKey: 'Kentang' },
    { name: 'Cabai Merah Keriting', itemKey: 'Cabai Merah Keriting' },
    { name: 'Bawang Putih', itemKey: 'Bawang Putih' },
  ];

  for (const fi of forecastItems) {
    const itemId = items[fi.itemKey];
    if (!itemId) continue;

    for (let week = 4; week >= 1; week--) {
      const forecastDate = daysAgo(week * 7);
      const predicted = 5 + Math.random() * 15;
      const actual = predicted * (0.75 + Math.random() * 0.5);

      await prisma.demandForecast.create({
        data: {
          itemId,
          forecastDate,
          horizonDays: 7,
          predictedQty: d(Math.round(predicted * 100) / 100),
          safetyStock: d(Math.round((predicted * 0.3) * 100) / 100),
          confidence: week >= 3 ? 'SEDANG' : 'TINGGI',
          actualQty: d(Math.round(actual * 100) / 100),
          generatedBy: admin.id,
          generatedAt: daysAgo(week * 7 + 1),
        },
      });
    }
  }

  console.log('✓ 32 demand forecast snapshots (4 minggu × 8 item, dengan aktual)');

  // ─── SUMMARY ──────────────────────────────────────────────
  console.log('\n✅ Demo seed selesai!\n');
  console.log('Akun login:');
  console.log('  Owner:          owner@mbg.com     / password123');
  console.log('  Admin:          admin@mbg.com     / password123');
  console.log('  Purchaser:      purchaser@mbg.com / password123');
  console.log('  Kitchen Manager: kitchen@mbg.com  / password123');
  console.log('\nData demo:');
  console.log('  4 users, 5 suppliers, 25 items, 10 resep');
  console.log('  11 PO (berbagai status), 8 receiving, 3 invoice');
  console.log('  35 produksi (30 hari), 10 waste, 1 opname');
  console.log('  7 notifikasi, 8 audit log, histori harga');
  console.log('  4 seasonal factors, 32 demand forecasts');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
