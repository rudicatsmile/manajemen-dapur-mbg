import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((responseData) => {
        const user = request.user;
        if (!user) return;

        const url = request.url as string;
        const pathParts = url.replace(/^\/api\//, '').split('/');
        const entityType = pathParts[0] || 'unknown';
        const entityId = responseData?.data?.id || responseData?.id || 0;

        let action = 'UNKNOWN';
        if (method === 'POST') action = 'CREATE';
        else if (method === 'PATCH' || method === 'PUT') action = 'UPDATE';
        else if (method === 'DELETE') action = 'DELETE';

        this.prisma.auditLog
          .create({
            data: {
              userId: user.id,
              action,
              entityType,
              entityId: typeof entityId === 'number' ? entityId : 0,
              newValues: request.body || null,
              ipAddress: request.ip || null,
              userAgent: request.headers?.['user-agent'] || null,
            },
          })
          .catch(() => {
            // Fire-and-forget
          });
      }),
    );
  }
}
