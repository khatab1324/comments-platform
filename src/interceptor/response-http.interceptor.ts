import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResponseFormat } from './types';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat> {
    return next.handle().pipe(map((data) => this.formatResponse(data)));
  }

  private formatResponse(data: unknown): ResponseFormat {
    const isWrappedResponse = this.isWrappedResponse(data);

    const success = isWrappedResponse ? data.success !== false : true;
    const payload = isWrappedResponse ? data.data : data;
    const message =
      isWrappedResponse && 'message' in data
        ? data.message
        : success
          ? 'Operation successful'
          : 'Operation failed';
    const errors =
      isWrappedResponse && 'errors' in data ? data.errors : success ? null : [];
    return {
      success,
      message,
      data: payload ?? null,
      errors,
    };
  }

  private isWrappedResponse(data: unknown): data is ResponseFormat {
    return !!data && typeof data === 'object' && 'success' in data;
  }
}
