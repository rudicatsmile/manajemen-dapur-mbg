'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useSupplierAuthStore } from '@/stores/supplier-auth-store';
import { PortalMobileSidebar } from './portal-sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function PortalHeader() {
  const router = useRouter();
  const { supplier, logout } = useSupplierAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/portal/login');
  };

  const initials = supplier?.name
    ? supplier.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'S';

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <PortalMobileSidebar />
      <div className="flex-1" />
      <span className="hidden text-sm text-muted-foreground sm:inline">{supplier?.supplierName}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{supplier?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{supplier?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Keluar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
