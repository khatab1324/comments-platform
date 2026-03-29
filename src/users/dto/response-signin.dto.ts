import { Expose, Type } from 'class-transformer';
import { getUserDto } from './get-user.dto';

export class ResponseSigninDto {
  @Expose()
  accessToken!: string;

  @Expose()
  @Type(() => getUserDto)
  user!: getUserDto;
}
