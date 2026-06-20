import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

  // Admin User
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@mbg.com' },
    update: {},
    create: {
      email: 'admin@mbg.com',
      passwordHash: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
    },
  });

  // Owner User
  await prisma.user.upsert({
    where: { email: 'owner@mbg.com' },
    update: {},
    create: {
      email: 'owner@mbg.com',
      passwordHash: hashedPassword,
      name: 'Owner MBG',
      role: 'OWNER',
    },
  });

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
