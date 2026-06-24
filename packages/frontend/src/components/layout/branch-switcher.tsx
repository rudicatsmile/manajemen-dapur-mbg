'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';
import { useBranchStore, type ActiveBranch } from '@/stores/branch-store';
import { useAuthStore } from '@/stores/auth-store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ALL_VALUE = 'ALL';

export function BranchSwitcher() {
  const queryClient = useQueryClient();
  const { branches, activeBranch, setActiveBranch, hydrate } = useBranchStore();
  const role = useAuthStore((s) => s.user?.role);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Owner/Admin boleh melihat konsolidasi semua cabang
  const canViewAll = role === 'OWNER' || role === 'ADMIN';

  // Jangan render bila hanya ada satu cabang dan tidak boleh lihat "Semua"
  if (branches.length <= 1 && !canViewAll) return null;

  const value = activeBranch === null ? undefined : String(activeBranch);

  const handleChange = (next: string) => {
    const parsed: ActiveBranch = next === ALL_VALUE ? 'ALL' : parseInt(next, 10);
    setActiveBranch(parsed);
    // Ganti cabang → refetch semua data agar sesuai cabang baru
    queryClient.invalidateQueries();
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="h-9 w-[180px] gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder="Pilih cabang" />
      </SelectTrigger>
      <SelectContent>
        {canViewAll && <SelectItem value={ALL_VALUE}>Semua Cabang</SelectItem>}
        {branches.map((b) => (
          <SelectItem key={b.id} value={String(b.id)}>
            {b.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
