export const ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  PURCHASER: 'PURCHASER',
  KITCHEN_MANAGER: 'KITCHEN_MANAGER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
