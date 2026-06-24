import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Units of Measure
  const units = [
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

  const createdUnits: Record<string, number> = {};
  for (const unit of units) {
    const result = await prisma.unitOfMeasure.upsert({
      where: { id: units.indexOf(unit) + 1 },
      update: { name: unit.name, abbreviation: unit.abbreviation },
      create: { name: unit.name, abbreviation: unit.abbreviation },
    });
    createdUnits[unit.abbreviation] = result.id;
  }

  // Unit Conversions
  if (createdUnits['kg'] && createdUnits['g']) {
    await prisma.unitConversion.upsert({
      where: { fromUnitId_toUnitId: { fromUnitId: createdUnits['kg'], toUnitId: createdUnits['g'] } },
      update: { factor: 1000 },
      create: { fromUnitId: createdUnits['kg'], toUnitId: createdUnits['g'], factor: 1000 },
    });
  }

  if (createdUnits['L'] && createdUnits['ml']) {
    await prisma.unitConversion.upsert({
      where: { fromUnitId_toUnitId: { fromUnitId: createdUnits['L'], toUnitId: createdUnits['ml'] } },
      update: { factor: 1000 },
      create: { fromUnitId: createdUnits['L'], toUnitId: createdUnits['ml'], factor: 1000 },
    });
  }

  // Item Categories
  const itemCategories = [
    'Bahan Baku', 'Bumbu & Rempah', 'Minyak & Lemak', 'Sayuran',
    'Protein', 'Kemasan', 'Bahan Habis Pakai',
  ];

  for (const name of itemCategories) {
    await prisma.category.upsert({
      where: { id: itemCategories.indexOf(name) + 1 },
      update: { name, type: 'ITEM' },
      create: { name, type: 'ITEM' },
    });
  }

  // Recipe Categories
  const recipeCategories = [
    'Makanan Utama', 'Lauk', 'Sambal & Saus', 'Minuman', 'Snack',
  ];

  for (const name of recipeCategories) {
    await prisma.category.upsert({
      where: { id: itemCategories.length + recipeCategories.indexOf(name) + 1 },
      update: { name, type: 'RECIPE' },
      create: { name, type: 'RECIPE' },
    });
  }

  // Branches
  const branchSeed = [
    { code: 'PST', name: 'Cabang Pusat', address: 'Jl. Pusat No. 1, Jakarta', isDefault: true },
    { code: 'CBG-SLT', name: 'Cabang Selatan', address: 'Jl. Selatan No. 10, Jakarta', isDefault: false },
  ];
  const createdBranches: Record<string, number> = {};
  for (const b of branchSeed) {
    const result = await prisma.branch.upsert({
      where: { code: b.code },
      update: { name: b.name, address: b.address, isDefault: b.isDefault },
      create: { code: b.code, name: b.name, address: b.address, isDefault: b.isDefault },
    });
    createdBranches[b.code] = result.id;
  }
  const defaultBranchId = createdBranches['PST'];

  // Admin User
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mbg.com' },
    update: { defaultBranchId },
    create: {
      email: 'admin@mbg.com',
      passwordHash: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
      defaultBranchId,
    },
  });

  // Owner User
  const owner = await prisma.user.upsert({
    where: { email: 'owner@mbg.com' },
    update: { defaultBranchId },
    create: {
      email: 'owner@mbg.com',
      passwordHash: hashedPassword,
      name: 'Owner MBG',
      role: 'OWNER',
      defaultBranchId,
    },
  });

  // Assign both users to all branches (owner & admin akses semua cabang)
  for (const userId of [admin.id, owner.id]) {
    for (const branchId of Object.values(createdBranches)) {
      await prisma.userBranch.upsert({
        where: { userId_branchId: { userId, branchId } },
        update: {},
        create: { userId, branchId },
      });
    }
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
