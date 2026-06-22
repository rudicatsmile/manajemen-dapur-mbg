export interface Branch {
  id: number;
  code: string;
  name: string;
  address: string | null;
  phone: string | null;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BranchWithMeta extends Branch {
  memberCount?: number;
  itemCount?: number;
}

export interface BranchMember {
  id: number;
  name: string;
  email: string;
  role: string;
}
