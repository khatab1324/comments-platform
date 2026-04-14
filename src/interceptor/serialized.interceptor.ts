import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type { ClassConstructor } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { ResponseFormat } from './types';

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor<T>) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<T | T[] | ResponseFormat<T> | null> {
    return next.handle().pipe(map((data) => this.serialize(data)));
  }

  private serialize(data: unknown): T | T[] | ResponseFormat<T> | null {
    if (this.isWrappedResponse(data)) {
      return {
        ...data,
        data: this.serializePayload(data.data),
      };
    }

    return this.serializePayload(data);
  }

  private serializePayload(payload: unknown): T | T[] | null {
    if (payload == null) {
      return null;
    }

    return plainToInstance(this.dto, payload as object, {
      excludeExtraneousValues: true,
    });
  }

  private isWrappedResponse(data: unknown): data is ResponseFormat<unknown> {
    return !!data && typeof data === 'object' && 'success' in data;
  }
}
