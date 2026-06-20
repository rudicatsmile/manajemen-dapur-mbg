# CLAUDE.md — Manajemen Dapur MBG

## Project Overview

Aplikasi web internal untuk manajemen operasional dapur bisnis F&B. Mencakup pembelian (procurement), stok gudang (inventory), produksi harian, dan analisis biaya per porsi (food costing). Target user: Owner, Admin, Purchaser, Kitchen Manager.

PRD lengkap: `docs/PRD.md`

---

## Tech Stack & Versions

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js (App Router) | 15.x |
| **Frontend** | React | 19.x |
| **Frontend** | TypeScript | 5.6+ |
| **Frontend** | Tailwind CSS | 4.x |
| **Frontend** | Shadcn/ui | latest (CLI install) |
| **Frontend** | Radix UI | latest (via Shadcn) |
| **Frontend** | Tanstack Table | 8.x |
| **Frontend** | Tanstack Query | 5.x |
| **Frontend** | React Hook Form | 7.x |
| **Frontend** | Zod | 3.x |
| **Frontend** | Axios | 1.x |
| **Frontend** | @react-pdf/renderer | 4.x |
| **Frontend** | date-fns | 4.x |
| **Frontend** | Lucide React (icons) | latest |
| **Backend** | NestJS | 11.x |
| **Backend** | TypeScript | 5.6+ |
| **Backend** | Prisma ORM | 6.x |
| **Backend** | MySQL | 8.0+ |
| **Backend** | Passport + JWT | latest |
| **Backend** | bcrypt | latest |
| **Backend** | Zod (validation) | 3.x |
| **Backend** | Redis (Phase 2) | 7.x |
| **Runtime** | Node.js | 22 LTS |
| **Package Manager** | pnpm | 10.x |

---

## Project Structure

Monorepo dengan pnpm workspaces. Tiga packages: `frontend`, `backend`, `shared`.

```
manajemen-dapur-mbg/
├── CLAUDE.md
├── pnpm-workspace.yaml
├── package.json                    # root scripts
├── .gitignore
├── .env.example
├── docs/
│   └── PRD.md
│
├── packages/
│   ├── shared/                     # Shared types & Zod schemas
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── schemas/            # Zod schemas (used by FE & BE)
│   │       │   ├── auth.schema.ts
│   │       │   ├── supplier.schema.ts
│   │       │   ├── item.schema.ts
│   │       │   ├── purchase-order.schema.ts
│   │       │   ├── receiving.schema.ts
│   │       │   ├── recipe.schema.ts
│   │       │   ├── production.schema.ts
│   │       │   ├── waste.schema.ts
│   │       │   └── common.schema.ts
│   │       ├── types/              # TypeScript interfaces/types
│   │       │   ├── auth.types.ts
│   │       │   ├── supplier.types.ts
│   │       │   ├── item.types.ts
│   │       │   ├── purchase-order.types.ts
│   │       │   ├── api-response.types.ts
│   │       │   └── ...
│   │       └── constants/
│   │           ├── roles.ts
│   │           ├── status.ts
│   │           └── units.ts
│   │
│   ├── frontend/                   # Next.js 15
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts
│   │   ├── components.json         # Shadcn config
│   │   ├── public/
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx
│   │       │   ├── globals.css
│   │       │   ├── (auth)/
│   │       │   │   ├── layout.tsx
│   │       │   │   └── login/
│   │       │   │       └── page.tsx
│   │       │   └── (dashboard)/
│   │       │       ├── layout.tsx          # Sidebar + Header + Auth guard
│   │       │       ├── dashboard/
│   │       │       │   └── page.tsx
│   │       │       ├── pembelian/
│   │       │       │   ├── supplier/
│   │       │       │   │   ├── page.tsx            # List
│   │       │       │   │   ├── baru/
│   │       │       │   │   │   └── page.tsx        # Create
│   │       │       │   │   └── [id]/
│   │       │       │   │       ├── page.tsx        # Detail
│   │       │       │   │       └── edit/
│   │       │       │   │           └── page.tsx    # Edit
│   │       │       │   ├── purchase-order/
│   │       │       │   ├── receiving/
│   │       │       │   └── invoice/
│   │       │       ├── stok/
│   │       │       │   ├── item/
│   │       │       │   ├── mutasi/
│   │       │       │   └── opname/
│   │       │       ├── produksi/
│   │       │       │   ├── resep/
│   │       │       │   ├── harian/
│   │       │       │   └── waste/
│   │       │       ├── laporan/
│   │       │       └── pengaturan/
│   │       │           ├── user/
│   │       │           ├── kategori/
│   │       │           └── satuan/
│   │       ├── components/
│   │       │   ├── ui/             # Shadcn components (auto-generated)
│   │       │   ├── layout/
│   │       │   │   ├── sidebar.tsx
│   │       │   │   ├── header.tsx
│   │       │   │   ├── breadcrumb-nav.tsx
│   │       │   │   └── page-header.tsx
│   │       │   ├── shared/         # Reusable app components
│   │       │   │   ├── data-table.tsx
│   │       │   │   ├── data-table-toolbar.tsx
│   │       │   │   ├── data-table-pagination.tsx
│   │       │   │   ├── confirm-dialog.tsx
│   │       │   │   ├── status-badge.tsx
│   │       │   │   ├── file-upload.tsx
│   │       │   │   ├── date-picker.tsx
│   │       │   │   ├── combobox.tsx
│   │       │   │   └── empty-state.tsx
│   │       │   ├── pembelian/      # Module-specific components
│   │       │   ├── stok/
│   │       │   ├── produksi/
│   │       │   └── pdf/            # PDF templates
│   │       │       ├── pdf-layout.tsx
│   │       │       ├── purchase-report.tsx
│   │       │       ├── stock-report.tsx
│   │       │       ├── production-report.tsx
│   │       │       └── food-cost-report.tsx
│   │       ├── hooks/
│   │       │   ├── use-auth.ts
│   │       │   ├── use-pagination.ts
│   │       │   └── queries/        # Tanstack Query hooks
│   │       │       ├── use-suppliers.ts
│   │       │       ├── use-items.ts
│   │       │       ├── use-purchase-orders.ts
│   │       │       └── ...
│   │       ├── lib/
│   │       │   ├── api-client.ts       # Axios instance
│   │       │   ├── auth.ts             # Token management
│   │       │   ├── utils.ts            # cn(), formatRupiah(), etc.
│   │       │   └── query-client.ts     # Tanstack Query config
│   │       └── stores/                 # Zustand (if needed)
│   │           └── auth-store.ts
│   │
│   └── backend/                    # NestJS
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsconfig.build.json
│       ├── nest-cli.json
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── common/
│       │   │   ├── decorators/
│       │   │   │   ├── roles.decorator.ts
│       │   │   │   └── current-user.decorator.ts
│       │   │   ├── guards/
│       │   │   │   ├── jwt-auth.guard.ts
│       │   │   │   └── roles.guard.ts
│       │   │   ├── interceptors/
│       │   │   │   ├── audit-log.interceptor.ts
│       │   │   │   └── transform-response.interceptor.ts
│       │   │   ├── filters/
│       │   │   │   └── http-exception.filter.ts
│       │   │   ├── pipes/
│       │   │   │   └── zod-validation.pipe.ts
│       │   │   └── helpers/
│       │   │       ├── pagination.helper.ts
│       │   │       └── doc-number.helper.ts
│       │   ├── prisma/
│       │   │   ├── prisma.module.ts
│       │   │   └── prisma.service.ts
│       │   └── modules/
│       │       ├── auth/
│       │       │   ├── auth.module.ts
│       │       │   ├── auth.controller.ts
│       │       │   ├── auth.service.ts
│       │       │   └── strategies/
│       │       │       └── jwt.strategy.ts
│       │       ├── user/
│       │       │   ├── user.module.ts
│       │       │   ├── user.controller.ts
│       │       │   └── user.service.ts
│       │       ├── supplier/
│       │       ├── item/
│       │       ├── purchase-order/
│       │       ├── receiving/
│       │       ├── invoice/
│       │       ├── stock/
│       │       ├── recipe/
│       │       ├── production/
│       │       ├── waste/
│       │       ├── dashboard/
│       │       ├── report/
│       │       └── audit-log/
│       └── test/
│           ├── app.e2e-spec.ts
│           └── jest-e2e.json
```

---

## Coding Conventions

### Naming

| Context | Convention | Example |
|---------|-----------|---------|
| File (component) | kebab-case | `purchase-order-form.tsx` |
| File (module/service) | kebab-case | `purchase-order.service.ts` |
| React Component | PascalCase | `PurchaseOrderForm` |
| Function/variable | camelCase | `calculateFoodCost()` |
| Constant (enum-like) | UPPER_SNAKE_CASE | `PO_STATUS.DRAFT` |
| Type/Interface | PascalCase | `PurchaseOrder`, `CreatePurchaseOrderInput` |
| Zod schema | camelCase + `Schema` suffix | `createPurchaseOrderSchema` |
| Database table (Prisma model) | PascalCase | `model PurchaseOrder` |
| Database column | camelCase (Prisma maps to snake_case) | `createdAt` → `created_at` |
| API endpoint | kebab-case | `/api/purchase-orders` |
| CSS class | Tailwind utility classes only, no custom CSS class names |
| Env variable | UPPER_SNAKE_CASE | `DATABASE_URL` |

### TypeScript Rules

```jsonc
// tsconfig.json (shared base)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": false, // terlalu strict untuk form handling
    "forceConsistentCasingInImports": true
  }
}
```

Rules:
- **Jangan gunakan `any`**. Gunakan `unknown` lalu narrow, atau definisikan type yang benar.
- **Jangan gunakan `!` (non-null assertion)**. Handle null/undefined secara eksplisit.
- **Jangan gunakan `@ts-ignore`**. Jika harus, gunakan `@ts-expect-error` dengan penjelasan.
- **Jangan gunakan `enum`**. Gunakan `as const` object + Zod enum:
  ```ts
  // ✅ Benar
  export const PO_STATUS = {
    DRAFT: 'DRAFT',
    PENDING_APPROVAL: 'PENDING_APPROVAL',
    APPROVED: 'APPROVED',
  } as const;
  export type PoStatus = (typeof PO_STATUS)[keyof typeof PO_STATUS];

  // ❌ Salah
  enum PoStatus { DRAFT, PENDING_APPROVAL }
  ```
- **Return types eksplisit** untuk service methods dan API handlers.
- **Gunakan `satisfies`** untuk type-checking tanpa widening.

### React / Next.js Component Structure

```tsx
// Urutan dalam file component:
// 1. Imports
// 2. Types/interfaces (jika lokal)
// 3. Zod schema (jika ada form)
// 4. Component
// 5. Sub-components (jika kecil, jika besar pisah file)

// ✅ Page component (server component by default)
// src/app/(dashboard)/pembelian/supplier/page.tsx
import { Metadata } from 'next';
import { SupplierTable } from '@/components/pembelian/supplier-table';
import { PageHeader } from '@/components/layout/page-header';

export const metadata: Metadata = {
  title: 'Supplier — Manajemen Dapur MBG',
};

export default function SupplierPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier"
        description="Kelola data supplier bahan baku"
      />
      <SupplierTable />
    </div>
  );
}
```

```tsx
// ✅ Client component (interactive)
// src/components/pembelian/supplier-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSupplierSchema, type CreateSupplierInput } from '@mbg/shared';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateSupplier } from '@/hooks/queries/use-suppliers';

export function SupplierForm() {
  const form = useForm<CreateSupplierInput>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
    },
  });

  const { mutate, isPending } = useCreateSupplier();

  function onSubmit(values: CreateSupplierInput) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Supplier</FormLabel>
              <FormControl>
                <Input placeholder="PT Sumber Makmur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </form>
    </Form>
  );
}
```

### Tanstack Query Hooks

```ts
// src/hooks/queries/use-suppliers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Supplier, CreateSupplierInput, PaginatedResponse } from '@mbg/shared';

const QUERY_KEY = ['suppliers'] as const;

export function useSuppliers(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => apiClient.get<PaginatedResponse<Supplier>>('/suppliers', { params }).then(r => r.data),
  });
}

export function useSupplier(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => apiClient.get<Supplier>(`/suppliers/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSupplierInput) =>
      apiClient.post<Supplier>('/suppliers', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
```

### NestJS Module Pattern

Setiap modul mengikuti struktur yang sama:

```ts
// ✅ Controller — thin, hanya routing + validation + response
// src/modules/supplier/supplier.controller.ts
import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { createSupplierSchema, updateSupplierSchema, type CreateSupplierInput } from '@mbg/shared';
import { SupplierService } from './supplier.service';

@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  @Roles('OWNER', 'ADMIN', 'PURCHASER')
  findAll(@Query() query: { page?: string; search?: string }) {
    return this.supplierService.findAll({
      page: query.page ? parseInt(query.page, 10) : 1,
      search: query.search,
    });
  }

  @Post()
  @Roles('OWNER', 'ADMIN')
  create(
    @Body(new ZodValidationPipe(createSupplierSchema)) data: CreateSupplierInput,
    @CurrentUser() user: { id: number },
  ) {
    return this.supplierService.create(data, user.id);
  }

  @Patch(':id')
  @Roles('OWNER', 'ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateSupplierSchema)) data: UpdateSupplierInput,
    @CurrentUser() user: { id: number },
  ) {
    return this.supplierService.update(id, data, user.id);
  }
}
```

```ts
// ✅ Service — semua business logic di sini
// src/modules/supplier/supplier.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { CreateSupplierInput } from '@mbg/shared';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { page: number; search?: string }): Promise<PaginatedResponse<Supplier>> {
    const take = 20;
    const skip = (params.page - 1) * take;

    const where = params.search
      ? { name: { contains: params.search }, isActive: true }
      : { isActive: true };

    const [data, total] = await Promise.all([
      this.prisma.supplier.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
      this.prisma.supplier.count({ where }),
    ]);

    return {
      data,
      meta: { page: params.page, perPage: take, total, totalPages: Math.ceil(total / take) },
    };
  }

  async create(data: CreateSupplierInput, userId: number): Promise<Supplier> {
    return this.prisma.supplier.create({
      data: { ...data, createdBy: userId },
    });
  }

  async update(id: number, data: UpdateSupplierInput, userId: number): Promise<Supplier> {
    const existing = await this.prisma.supplier.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Supplier #${id} tidak ditemukan`);

    return this.prisma.supplier.update({
      where: { id },
      data: { ...data, updatedBy: userId },
    });
  }
}
```

### Zod Validation (Shared Package)

```ts
// packages/shared/src/schemas/supplier.schema.ts
import { z } from 'zod';

export const createSupplierSchema = z.object({
  name: z.string().min(1, 'Nama supplier wajib diisi').max(200),
  address: z.string().max(500).optional(),
  phone: z
    .string()
    .regex(/^(\+62|0)[0-9]{8,13}$/, 'Format nomor telepon tidak valid')
    .optional(),
  email: z.string().email('Format email tidak valid').optional(),
  contactPerson: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
```

```ts
// Zod validation pipe untuk NestJS
// src/common/pipes/zod-validation.pipe.ts
import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      throw new BadRequestException({ message: 'Validasi gagal', errors });
    }
    return result.data;
  }
}
```

### Prisma Schema Best Practices

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// Gunakan @map untuk snake_case di database, camelCase di code
model PurchaseOrder {
  id            Int       @id @default(autoincrement())
  poNumber      String    @unique @map("po_number") @db.VarChar(20)
  supplierId    Int       @map("supplier_id")
  poDate        DateTime  @map("po_date") @db.Date
  expectedDate  DateTime? @map("expected_date") @db.Date
  status        String    @default("DRAFT") @db.VarChar(30)
  totalAmount   Decimal   @default(0) @map("total_amount") @db.Decimal(15, 2)
  notes         String?   @db.Text
  approvedBy    Int?      @map("approved_by")
  approvedAt    DateTime? @map("approved_at")
  createdBy     Int       @map("created_by")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  supplier      Supplier          @relation(fields: [supplierId], references: [id])
  approver      User?             @relation("POApprover", fields: [approvedBy], references: [id])
  creator       User              @relation("POCreator", fields: [createdBy], references: [id])
  items         PurchaseOrderItem[]
  receivings    Receiving[]

  // Indexes
  @@index([supplierId])
  @@index([status])
  @@index([poDate])
  @@index([createdBy])
  @@map("purchase_orders")
}
```

Rules:
- Semua model menggunakan `@map("snake_case")` untuk nama tabel dan `@map("snake_case")` untuk kolom.
- Gunakan `@db.VarChar(n)`, `@db.Text`, `@db.Decimal(p,s)` untuk kontrol tipe MySQL.
- Selalu tambahkan `@@index` pada foreign key dan kolom yang sering di-filter/sort.
- Jangan gunakan `@db.DateTime` tanpa timezone awareness — simpan semua waktu dalam timezone server (WIB/Asia Jakarta).
- Gunakan `Decimal` (bukan `Float`) untuk semua nilai uang dan quantity.

### Error Handling

**Backend (NestJS)**:
```ts
// Gunakan NestJS built-in exceptions
throw new NotFoundException('Supplier tidak ditemukan');
throw new BadRequestException('Stok tidak mencukupi untuk produksi');
throw new ConflictException('PO sudah di-approve, tidak bisa diedit');
throw new ForbiddenException('Anda tidak memiliki akses');

// Global exception filter menangani format response
// Response format untuk error:
{
  "statusCode": 400,
  "message": "Validasi gagal",
  "errors": [
    { "field": "name", "message": "Nama supplier wajib diisi" }
  ]
}
```

**Frontend**:
```ts
// Axios interceptor handles globally
// src/lib/api-client.ts
import axios from 'axios';
import { toast } from 'sonner'; // or shadcn toast

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? 'Terjadi kesalahan';
    if (error.response?.status === 401) {
      // redirect to login
    } else {
      toast.error(message);
    }
    return Promise.reject(error);
  },
);
```

---

## Architecture Rules

### API Response Format

Semua API response menggunakan format konsisten:

```ts
// Success (single)
{ "data": { ... } }

// Success (list/paginated)
{
  "data": [...],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Error
{
  "statusCode": 400,
  "message": "...",
  "errors": [...]  // optional, untuk validation errors
}
```

### Database Transactions — Critical Operations

**Semua operasi yang melibatkan mutasi stok WAJIB menggunakan Prisma transaction:**

```ts
// ✅ Receiving — stok bertambah
async createReceiving(data: CreateReceivingInput, userId: number) {
  return this.prisma.$transaction(async (tx) => {
    // 1. Validasi PO exists dan status valid
    const po = await tx.purchaseOrder.findUniqueOrThrow({
      where: { id: data.poId },
      include: { items: true },
    });
    if (!['APPROVED', 'SENT', 'PARTIALLY_RECEIVED'].includes(po.status)) {
      throw new BadRequestException('PO tidak dalam status yang valid untuk receiving');
    }

    // 2. Buat receiving record
    const receiving = await tx.receiving.create({
      data: {
        receivingNumber: await this.generateNumber('RCV', tx),
        poId: data.poId,
        receivedDate: data.receivedDate,
        createdBy: userId,
      },
    });

    // 3. Process setiap item
    for (const item of data.items) {
      // Validasi qty tidak melebihi sisa
      const poItem = po.items.find(pi => pi.id === item.poItemId);
      const remaining = Number(poItem.quantity) - Number(poItem.receivedQty);
      if (item.quantity > remaining) {
        throw new BadRequestException(`Qty melebihi sisa PO untuk item ${poItem.itemId}`);
      }

      // Buat receiving item
      await tx.receivingItem.create({ data: { receivingId: receiving.id, ...item } });

      // Update PO item received qty
      await tx.purchaseOrderItem.update({
        where: { id: item.poItemId },
        data: { receivedQty: { increment: item.quantity } },
      });

      // Update stok + catat mutasi
      const currentItem = await tx.item.findUniqueOrThrow({ where: { id: item.itemId } });
      const qtyInBaseUnit = item.quantity * (currentItem.conversionFactor ?? 1);

      await tx.item.update({
        where: { id: item.itemId },
        data: {
          currentStock: { increment: qtyInBaseUnit },
          lastPrice: item.unitPrice ?? currentItem.lastPrice,
        },
      });

      await tx.stockMovement.create({
        data: {
          itemId: item.itemId,
          movementType: 'RCV',
          referenceType: 'RECEIVING',
          referenceId: receiving.id,
          qtyBefore: currentItem.currentStock,
          qtyChange: qtyInBaseUnit,
          qtyAfter: Number(currentItem.currentStock) + qtyInBaseUnit,
          createdBy: userId,
        },
      });
    }

    // 4. Update PO status
    const updatedPo = await tx.purchaseOrder.findUniqueOrThrow({
      where: { id: data.poId },
      include: { items: true },
    });
    const allFullyReceived = updatedPo.items.every(
      (i) => Number(i.receivedQty) >= Number(i.quantity),
    );
    await tx.purchaseOrder.update({
      where: { id: data.poId },
      data: { status: allFullyReceived ? 'COMPLETED' : 'PARTIALLY_RECEIVED' },
    });

    return receiving;
  });
}
```

```ts
// ✅ Production — stok berkurang
async createProduction(data: CreateProductionInput, userId: number) {
  return this.prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.findUniqueOrThrow({
      where: { id: data.recipeId },
      include: { items: true },
    });

    // 1. Cek kecukupan stok semua bahan
    const shortages: Array<{ itemName: string; needed: number; available: number }> = [];

    for (const ri of recipe.items) {
      const item = await tx.item.findUniqueOrThrow({ where: { id: ri.itemId } });
      const needed = Number(ri.quantity) * data.plannedQty;
      if (Number(item.currentStock) < needed) {
        shortages.push({
          itemName: item.name,
          needed,
          available: Number(item.currentStock),
        });
      }
    }

    if (shortages.length > 0 && !data.forceCreate) {
      throw new BadRequestException({
        message: 'Stok tidak mencukupi',
        shortages,
      });
    }

    // 2. Buat production record
    const production = await tx.production.create({
      data: {
        productionNumber: await this.generateNumber('PROD', tx),
        productionDate: data.productionDate,
        recipeId: data.recipeId,
        plannedQty: data.plannedQty,
        status: 'COMPLETED',
        createdBy: userId,
      },
    });

    // 3. Deduct stok untuk setiap bahan
    for (const ri of recipe.items) {
      const item = await tx.item.findUniqueOrThrow({ where: { id: ri.itemId } });
      const qtyUsed = Number(ri.quantity) * data.plannedQty;

      await tx.item.update({
        where: { id: ri.itemId },
        data: { currentStock: { decrement: qtyUsed } },
      });

      await tx.productionItem.create({
        data: {
          productionId: production.id,
          itemId: ri.itemId,
          plannedQty: qtyUsed,
          actualQty: qtyUsed,
          unitId: ri.unitId,
        },
      });

      await tx.stockMovement.create({
        data: {
          itemId: ri.itemId,
          movementType: 'PRD',
          referenceType: 'PRODUCTION',
          referenceId: production.id,
          qtyBefore: item.currentStock,
          qtyChange: -qtyUsed,
          qtyAfter: Number(item.currentStock) - qtyUsed,
          createdBy: userId,
        },
      });
    }

    return production;
  });
}
```

### Food Costing Calculation Rules

```ts
// Biaya per porsi = Σ(qty bahan per 1 porsi × harga terakhir bahan)
function calculateCostPerServing(recipe: RecipeWithItems): number {
  let totalCost = 0;
  for (const ri of recipe.items) {
    const qtyPerServing = Number(ri.quantity) / Number(recipe.yieldQuantity);
    const unitPrice = Number(ri.item.lastPrice);
    totalCost += qtyPerServing * unitPrice;
  }
  return totalCost;
}

// Food cost percentage = (biaya per porsi / harga jual) × 100
function calculateFoodCostPercentage(costPerServing: number, sellingPrice: number): number {
  if (sellingPrice === 0) return 0;
  return (costPerServing / sellingPrice) * 100;
}

// Threshold warna:
// < 30% → hijau (bagus)
// 30-40% → kuning (perhatian)
// > 40% → merah (terlalu tinggi)
```

---

## Security & Best Practices

### Authentication Flow

```
1. POST /auth/login → { accessToken, refreshToken }
2. accessToken disimpan di memory (variable), refreshToken di httpOnly cookie
3. Setiap request: Authorization: Bearer <accessToken>
4. Jika 401: POST /auth/refresh (cookie auto-sent) → accessToken baru
5. Jika refresh gagal: redirect ke /login
```

### Security Checklist

- [ ] Semua endpoint dilindungi `JwtAuthGuard` kecuali `/auth/login`
- [ ] Role check via `RolesGuard` + `@Roles()` decorator
- [ ] Password di-hash dengan bcrypt (salt rounds: 12)
- [ ] JWT secret disimpan di env variable, bukan hardcoded
- [ ] File upload: validasi MIME type (image/jpeg, image/png, application/pdf), max 5MB
- [ ] Rate limiting: 100 req/min per IP (gunakan `@nestjs/throttler`)
- [ ] CORS: whitelist frontend URL saja
- [ ] Semua input divalidasi dengan Zod sebelum masuk service
- [ ] Prisma ORM mencegah SQL injection secara default
- [ ] Jangan expose stack trace di production (gunakan global exception filter)
- [ ] Audit log untuk semua operasi CREATE, UPDATE, DELETE pada data penting

### Audit Log Implementation

```ts
// Gunakan NestJS interceptor untuk otomatis log
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap((responseData) => {
          this.prisma.auditLog.create({
            data: {
              userId: request.user?.id,
              action: this.mapMethodToAction(method),
              entityType: this.getEntityType(request.path),
              entityId: responseData?.id ?? 0,
              newValues: method !== 'DELETE' ? responseData : undefined,
              ipAddress: request.ip,
              userAgent: request.headers['user-agent'],
            },
          }).catch(() => {}); // fire-and-forget, jangan block response
        }),
      );
    }

    return next.handle();
  }
}
```

---

## Testing Strategy

### Test Pyramid

| Level | Tool | Scope | Coverage Target |
|-------|------|-------|----------------|
| Unit | Jest | Service methods, helpers, utils | 80%+ untuk business logic |
| Integration | Jest + Prisma (test DB) | Service + DB transactions | Semua operasi stok |
| E2E | Jest + Supertest | API endpoints | Happy path + error cases |
| Component | Vitest + Testing Library | React components | Form validation, data table |

### Critical Paths yang WAJIB Ditest

1. **Receiving → stok bertambah** (transaction integrity)
2. **Produksi → stok berkurang** (transaction integrity, cek kecukupan)
3. **Food cost calculation** (akurasi perhitungan)
4. **PO approval workflow** (status transitions)
5. **Role-based access** (authorization)
6. **Stok opname → adjustment** (selisih & koreksi)

### Test Database

```bash
# Gunakan database terpisah untuk testing
DATABASE_URL_TEST="mysql://root:password@localhost:3306/mbg_test"

# Sebelum test suite: reset & seed
npx prisma migrate reset --force --skip-seed
npx prisma db seed
```

---

## Git Workflow

### Branching Strategy

```
main                    ← production-ready, protected
├── develop             ← integration branch
│   ├── feature/PRC-010-create-po
│   ├── feature/INV-011-auto-stock-update
│   ├── fix/stock-calculation-rounding
│   └── chore/update-dependencies
```

- **main**: production. Hanya menerima merge dari `develop` (via PR).
- **develop**: integration. Feature branches di-merge ke sini.
- **feature/**: prefix `feature/` + ID user story + deskripsi singkat.
- **fix/**: untuk bug fix.
- **chore/**: untuk non-feature (deps, config, refactor).

### Commit Messages

Format: `type(scope): description`

```
feat(purchase-order): add PO approval workflow
fix(stock): correct rounding in stock deduction
chore(prisma): add index on purchase_orders.status
refactor(auth): extract token refresh logic
docs(readme): update setup instructions
```

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`

Scopes: `auth`, `supplier`, `item`, `purchase-order`, `receiving`, `invoice`, `stock`, `recipe`, `production`, `waste`, `dashboard`, `report`, `prisma`, `ui`

---

## UI/UX Rules

### Layout

- Sidebar kiri (collapsible di mobile), header atas dengan breadcrumb dan user menu.
- Sidebar menggunakan Shadcn `Sidebar` component.
- Content area: max-width `1280px`, padding `p-6` (desktop), `p-4` (mobile).

### Component Usage

| Kebutuhan | Component |
|-----------|-----------|
| Form input | Shadcn `Input`, `Select`, `Textarea`, `DatePicker` wrapped dalam `FormField` |
| Data table | Shadcn `Table` + Tanstack Table (custom `DataTable` component) |
| Dialog/Modal | Shadcn `Dialog` (untuk form create/edit kecil) |
| Full page form | Halaman terpisah (`/baru`, `/[id]/edit`) |
| Konfirmasi aksi | Shadcn `AlertDialog` |
| Notifikasi | Shadcn `Sonner` (toast) |
| Loading | Skeleton (Shadcn `Skeleton`) untuk data fetch |
| Empty state | Custom `EmptyState` component dengan ilustrasi |
| Status indicator | Custom `StatusBadge` component dengan warna per status |
| Navigasi | Shadcn `Breadcrumb` + `Button` link |

### Data Table Standard

Semua halaman list menggunakan `DataTable` component yang konsisten:

```tsx
// Fitur standar setiap data table:
// - Server-side pagination (20 items per page)
// - Column sorting (klik header)
// - Search/filter (toolbar atas)
// - Column visibility toggle
// - Row actions (view, edit, delete) via dropdown menu
// - Responsive: scroll horizontal di mobile
```

### Warna & Status

```tsx
// Status badge colors (gunakan Shadcn Badge variants)
const STATUS_COLORS = {
  DRAFT: 'secondary',          // abu-abu
  PENDING_APPROVAL: 'warning', // kuning — custom variant
  APPROVED: 'default',         // biru
  REJECTED: 'destructive',     // merah
  COMPLETED: 'success',        // hijau — custom variant
  CANCELLED: 'outline',        // border only
  IN_PROGRESS: 'default',      // biru
} as const;
```

### Bahasa Indonesia

- Semua label, placeholder, error message, dan toast dalam Bahasa Indonesia.
- Jangan campur Bahasa Indonesia dan Inggris dalam satu kalimat UI.
- Nama technical (seperti "Purchase Order") boleh tetap dalam Bahasa Inggris jika sudah umum dipakai, tapi label navigasi gunakan Bahasa Indonesia ("Pembelian", "Stok Gudang", "Produksi", "Laporan").
- Format angka: `Rp 1.500.000` (titik sebagai pemisah ribuan).
- Format tanggal: `20 Jun 2026` atau `20/06/2026`.

### Responsive Breakpoints

```
sm: 640px   — smartphone landscape
md: 768px   — tablet portrait
lg: 1024px  — tablet landscape / laptop kecil
xl: 1280px  — desktop
```

- Sidebar: hidden di < `lg`, toggle via hamburger menu.
- Data table: horizontal scroll di < `md`, hide non-essential columns.
- Form: single column di < `md`, two columns di >= `md`.
- Dashboard cards: 1 col (mobile), 2 col (tablet), 4 col (desktop).

---

## PDF Report Standards

Menggunakan `@react-pdf/renderer`. Semua laporan PDF mengikuti template yang konsisten:

```tsx
// ✅ Struktur PDF Report
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 10, color: '#666' },
  table: { display: 'flex', flexDirection: 'column', marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingVertical: 6 },
  tableHeader: { backgroundColor: '#f3f4f6', fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, color: '#999', flexDirection: 'row', justifyContent: 'space-between' },
});

// Elemen standar di setiap report:
// 1. Header: Logo (opsional), nama perusahaan, judul laporan, periode, tanggal cetak
// 2. Filter/parameter yang digunakan
// 3. Tabel data
// 4. Summary/total di bawah tabel
// 5. Footer: "Dicetak pada: {tanggal}", halaman X dari Y
```

**Rules**:
- Ukuran kertas: A4 portrait (default), landscape untuk tabel lebar.
- Font: Helvetica (built-in, tidak perlu embed).
- Currency format: `Rp 1.500.000` (tanpa desimal kecuali diperlukan).
- Tanggal format: `20 Juni 2026`.
- PDF di-generate di client-side (browser) menggunakan `@react-pdf/renderer`, bukan di server.
- Gunakan `<BlobProvider>` atau `pdf().toBlob()` untuk download, `<PDFViewer>` untuk preview.

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm --filter frontend dev          # Next.js dev server (port 3000)
pnpm --filter backend dev           # NestJS dev server (port 3001)
pnpm dev                            # Run both (concurrent)

# Database
pnpm --filter backend prisma:migrate   # Run migrations
pnpm --filter backend prisma:generate  # Generate Prisma client
pnpm --filter backend prisma:seed      # Seed data
pnpm --filter backend prisma:studio    # Open Prisma Studio

# Build
pnpm --filter shared build
pnpm --filter frontend build
pnpm --filter backend build

# Test
pnpm --filter backend test             # Unit tests
pnpm --filter backend test:e2e         # E2E tests
pnpm --filter frontend test            # Component tests

# Lint & Format
pnpm lint
pnpm format
```

---

## Environment Variables

```bash
# .env (backend)
DATABASE_URL="mysql://user:password@localhost:3306/mbg_dapur"
JWT_SECRET="your-secret-key-min-32-chars"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880  # 5MB

# .env.local (frontend)
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_APP_NAME="Manajemen Dapur MBG"
```

**Jangan pernah commit file `.env` ke git.** Gunakan `.env.example` sebagai template.
