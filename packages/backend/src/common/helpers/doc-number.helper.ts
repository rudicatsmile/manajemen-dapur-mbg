import { PrismaClient } from '@prisma/client';

export async function generateDocNumber(
  prisma: PrismaClient,
  prefix: string,
  tableName: string,
  columnName: string,
): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const pattern = `${prefix}-${dateStr}-%`;

  const result = await prisma.$queryRawUnsafe<{ last_num: string | null }[]>(
    `SELECT ${columnName} as last_num FROM ${tableName} WHERE ${columnName} LIKE ? ORDER BY ${columnName} DESC LIMIT 1`,
    pattern,
  );

  let nextNum = 1;
  if (result.length > 0 && result[0].last_num) {
    const lastNum = result[0].last_num;
    const parts = lastNum.split('-');
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) {
      nextNum = lastSeq + 1;
    }
  }

  return `${prefix}-${dateStr}-${String(nextNum).padStart(3, '0')}`;
}
