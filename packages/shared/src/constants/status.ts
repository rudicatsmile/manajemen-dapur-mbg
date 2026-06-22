export const PO_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SENT: 'SENT',
  PARTIALLY_RECEIVED: 'PARTIALLY_RECEIVED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type PoStatus = (typeof PO_STATUS)[keyof typeof PO_STATUS];

export const PRODUCTION_STATUS = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type ProductionStatus = (typeof PRODUCTION_STATUS)[keyof typeof PRODUCTION_STATUS];

export const OPNAME_STATUS = {
  DRAFT: 'DRAFT',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  APPROVED: 'APPROVED',
} as const;

export type OpnameStatus = (typeof OPNAME_STATUS)[keyof typeof OPNAME_STATUS];

export const INVOICE_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const;

export type InvoiceStatus = (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];

export const MOVEMENT_TYPE = {
  RCV: 'RCV',
  PRD: 'PRD',
  ADJ_PLUS: 'ADJ_PLUS',
  ADJ_MINUS: 'ADJ_MINUS',
  WST: 'WST',
  TRF_OUT: 'TRF_OUT',
  TRF_IN: 'TRF_IN',
} as const;

export type MovementType = (typeof MOVEMENT_TYPE)[keyof typeof MOVEMENT_TYPE];

export const TRANSFER_STATUS = {
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SHIPPED: 'SHIPPED',
  RECEIVED: 'RECEIVED',
  CANCELLED: 'CANCELLED',
} as const;

export type TransferStatus = (typeof TRANSFER_STATUS)[keyof typeof TRANSFER_STATUS];

export const WASTE_CATEGORY = {
  EXPIRED: 'EXPIRED',
  DAMAGED: 'DAMAGED',
  SPILLED: 'SPILLED',
  PRODUCTION_LEFTOVER: 'PRODUCTION_LEFTOVER',
  OTHER: 'OTHER',
} as const;

export type WasteCategory = (typeof WASTE_CATEGORY)[keyof typeof WASTE_CATEGORY];
