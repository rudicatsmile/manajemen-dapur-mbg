'use client';

import { PageHeader } from '@/components/layout/page-header';
import { RecipeForm } from '@/components/produksi/recipe-form';

export default function CreateRecipePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tambah Resep" description="Tambahkan resep baru" />
      <RecipeForm />
    </div>
  );
}
