import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type { ClassConstructor } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { ResponseFormat } from './types';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  constructor(private readonly dto?: ClassConstructor<T>) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(map((data) => this.formatResponse(data)));
  }

  private formatResponse(data: any): ResponseFormat<T> {
    const isWrappedResponse =
      data && typeof data === 'object' && 'success' in data;

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
      data: this.serializePayload(payload),
      errors,
    };
  }

  private serializePayload(payload: unknown): T | T[] | null | unknown {
    if (payload == null || !this.dto) {
      return payload ?? null;
    }

    return plainToInstance(this.dto, payload as object, {
      excludeExtraneousValues: true,
    });
  }
}
