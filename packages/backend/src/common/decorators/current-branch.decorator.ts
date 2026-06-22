import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Konteks cabang aktif untuk request, di-resolve oleh BranchAccessGuard.
 * - isAll = true  → mode konsolidasi (semua cabang), branchId null.
 * - isAll = false → cabang spesifik, branchId terisi.
 */
export interface BranchContext {
  branchId: number | null;
  isAll: boolean;
}

export const CurrentBranch = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): BranchContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.branchContext as BranchContext;
  },
);
