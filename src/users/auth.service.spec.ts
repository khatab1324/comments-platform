import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './users.entity';

it('can create an instance of auth service', async () => {
  const fackUserService: Partial<UsersService> = {
    getAllUsers: () => Promise.resolve([]),
    create: (email: string, password: string, name: string) =>
      Promise.resolve({ id: 1, email, password, name } as User),
  };

  const module = await Test.createTestingModule({
    providers: [
      { provide: UsersService, useValue: fackUserService },
      AuthService,
      {
        provide: JwtService,
        useValue: {},
      },
    ],
  }).compile();
  const service = module.get(AuthService);
  expect(service).toBeDefined();
}); 
