import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, lastValueFrom } from 'rxjs';
import { ResponseInterceptor } from './response-http.interceptor';

describe('ResponseInterceptor', () => {
  const context = {} as ExecutionContext;

  it('wraps raw responses in the standard success envelope', async () => {
    const interceptor = new ResponseInterceptor();
    const next: CallHandler = {
      handle: () => of('Hello World!'),
    };

    const result = await lastValueFrom(interceptor.intercept(context, next));

    expect(result).toEqual({
      success: true,
      message: 'Operation successful',
      data: 'Hello World!',
      errors: null,
    });
  });

  it('preserves wrapped success responses', async () => {
    const interceptor = new ResponseInterceptor();
    const next: CallHandler = {
      handle: () =>
        of({
          success: true,
          message: 'User created successfully',
          data: {
            id: 1,
            name: 'Ada',
            email: 'ada@example.com',
            role: 'user',
            password: 'secret',
          },
          errors: null,
        }),
    };

    const result = await lastValueFrom(interceptor.intercept(context, next));

    expect(result).toEqual({
      success: true,
      message: 'User created successfully',
      data: {
        id: 1,
        name: 'Ada',
        email: 'ada@example.com',
        role: 'user',
        password: 'secret',
      },
      errors: null,
    });
  });

  it('preserves failure envelopes', async () => {
    const interceptor = new ResponseInterceptor();
    const next: CallHandler = {
      handle: () =>
        of({
          success: false,
          message: 'Email already in use',
          errors: ['Email already in use'],
          data: null,
        }),
    };

    const result = await lastValueFrom(interceptor.intercept(context, next));

    expect(result).toEqual({
      success: false,
      message: 'Email already in use',
      data: null,
      errors: ['Email already in use'],
    });
  });
});
