import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './Auth/guards/jwt-auth.guard';
import { CurrentUserInterceptor } from '../interceptor/current-user.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    JwtAuthGuard,
    { provide: 'APP_INTERCEPTOR', useClass: CurrentUserInterceptor },
  ],
  exports: [UsersService, AuthService, JwtAuthGuard],
})
export class UsersModule {}
