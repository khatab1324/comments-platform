import { Expose } from 'class-transformer';

export class getUserDto {
  @Expose()
  id!: number;
  @Expose()
  name!: string;
  @Expose()
  email!: string;
  @Expose()
  role!: string;
}
