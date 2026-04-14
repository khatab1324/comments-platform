import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { lastValueFrom, of } from 'rxjs';
import { SerializeInterceptor } from './serialized.interceptor';

class UserDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  role!: string;
}

class SigninResponseDto {
  @Expose()
  accessToken!: string;

  @Expose()
  @Type(() => UserDto)
  user!: UserDto;
}

describe('SerializeInterceptor', () => {
  const context = {} as ExecutionContext;

  it('serializes raw payloads with the provided dto', async () => {
    const interceptor = new SerializeInterceptor(UserDto);
    const next: CallHandler = {
      handle: () =>
        of({
          id: 1,
          name: 'Ada',
          email: 'ada@example.com',
          role: 'user',
          password: 'secret',
        }),
    };

    const result = await lastValueFrom(interceptor.intercept(context, next));

    expect(result).toEqual({
      id: 1,
      name: 'Ada',
      email: 'ada@example.com',
      role: 'user',
    });
  });

  it('serializes the data field inside wrapped responses', async () => {
    const interceptor = new SerializeInterceptor(SigninResponseDto);
    const next: CallHandler = {
      handle: () =>
        of({
          success: true,
          message: 'User signed in successfully',
          errors: null,
          data: {
            accessToken: 'jwt-token',
            user: {
              id: 1,
              name: 'Ada',
              email: 'ada@example.com',
              role: 'user',
              password: 'secret',
            },
          },
        }),
    };

    const result = await lastValueFrom(interceptor.intercept(context, next));

    expect(result).toEqual({
      success: true,
      message: 'User signed in successfully',
      errors: null,
      data: {
        accessToken: 'jwt-token',
        user: {
          id: 1,
          name: 'Ada',
          email: 'ada@example.com',
          role: 'user',
        },
      },
    });
  });
});
