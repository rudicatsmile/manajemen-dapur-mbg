import type { TransferStatus } from '../constants/status';

export interface StockTransferItem {
  id: number;
  itemId: number;
  unitId: number;
  requestedQty: number;
  shippedQty: number | null;
  receivedQty: number | null;
  notes: string | null;
  itemName?: string;
  unitAbbr?: string;
}

export interface StockTransfer {
  id: number;
  transferNumber: string;
  fromBranchId: number;
  toBranchId: number;
  status: TransferStatus;
  requestDate: string;
  notes: string | null;
  requestedBy: number;
  approvedBy: number | null;
  approvedAt: string | null;
  shippedBy: number | null;
  shippedAt: string | null;
  receivedBy: number | null;
  receivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  fromBranchName?: string;
  toBranchName?: string;
  items?: StockTransferItem[];
}
