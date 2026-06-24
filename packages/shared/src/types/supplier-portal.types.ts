export interface SupplierUser {
  id: number;
  supplierId: number;
  email: string;
  name: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierSessionProfile {
  id: number;
  supplierId: number;
  name: string;
  email: string;
  supplierName: string;
}

export interface SupplierSession {
  accessToken: string;
  refreshToken: string;
  supplier: SupplierSessionProfile;
}
