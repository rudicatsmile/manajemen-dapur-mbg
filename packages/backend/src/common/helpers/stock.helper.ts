import { Prisma } from '@prisma/client';

export interface AdjustBranchStockParams {
  branchId: number;
  itemId: number;
  /** Perubahan stok dalam base unit. Positif = tambah, negatif = kurang. */
  qtyChange: number;
  movementType: string;
  referenceType: string;
  referenceId: number;
  userId: number;
  notes?: string;
}

/**
 * Helper terpusat untuk mutasi stok per-cabang.
 * Meng-update (atau membuat) baris BranchStock untuk (branchId, itemId)
 * sekaligus mencatat StockMovement. WAJIB dipanggil di dalam Prisma transaction.
 */
export async function adjustBranchStock(
  tx: Prisma.TransactionClient,
  params: AdjustBranchStockParams,
): Promise<{ qtyBefore: number; qtyAfter: number }> {
  const { branchId, itemId, qtyChange } = params;

  const existing = await tx.branchStock.findUnique({
    where: { branchId_itemId: { branchId, itemId } },
  });

  const qtyBefore = existing ? Number(existing.currentStock) : 0;
  const qtyAfter = qtyBefore + qtyChange;

  if (existing) {
    await tx.branchStock.update({
      where: { branchId_itemId: { branchId, itemId } },
      data: { currentStock: qtyAfter },
    });
  } else {
    // Cabang belum punya baris stok untuk item ini → buat, ambil minStock dari template Item.
    const item = await tx.item.findUniqueOrThrow({
      where: { id: itemId },
      select: { minStock: true },
    });
    await tx.branchStock.create({
      data: { branchId, itemId, currentStock: qtyAfter, minStock: item.minStock },
    });
  }

  await tx.stockMovement.create({
    data: {
      branchId,
      itemId,
      movementType: params.movementType,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      qtyBefore,
      qtyChange,
      qtyAfter,
      notes: params.notes ?? null,
      createdBy: params.userId,
    },
  });

  return { qtyBefore, qtyAfter };
}

/**
 * Ambil stok terkini sebuah item pada cabang tertentu (0 jika belum ada baris).
 * Bisa dipakai dengan PrismaService maupun TransactionClient.
 */
export async function getBranchStockQty(
  tx: Prisma.TransactionClient,
  branchId: number,
  itemId: number,
): Promise<number> {
  const bs = await tx.branchStock.findUnique({
    where: { branchId_itemId: { branchId, itemId } },
  });
  return bs ? Number(bs.currentStock) : 0;
}
