import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../Auth/interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
