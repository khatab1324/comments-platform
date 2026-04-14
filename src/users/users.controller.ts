import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Serialize } from '../interceptor/serialized.interceptor';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from './users.service';
import { getUserDto } from './dto/get-user.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { ResponseSigninDto } from './dto/response-signin.dto';
import { JwtAuthGuard } from './Auth/guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayload } from './Auth/interfaces/jwt-payload.interface';
import { CurrentUserInterceptor } from '../interceptor/current-user.interceptor';

@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  @Serialize(getUserDto)
  signup(@Body() body: SignupDto) {
    const { name, email, password } = body;
    return this.authService.signup({ name, email, password });
  }
  @Post('/signin')
  @Serialize(ResponseSigninDto)
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Get('/:id')
  @Serialize(getUserDto)
  @UseGuards(JwtAuthGuard)
  getUserById(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    console.log('Current user:', user);
    return this.usersService.getUserById(parseInt(id));
  }
  @Get()
  @Serialize(getUserDto)
  @UseGuards(JwtAuthGuard)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
  @Put('/:id')
  @Serialize(getUserDto)
  @UseGuards(JwtAuthGuard)
  updateUser(@Param('id') id: string, @Body() body: Partial<SignupDto>) {
    return this.usersService.updateUser(parseInt(id), body);
  }
  @Delete('/:id')
  @Serialize(getUserDto)
  @UseGuards(JwtAuthGuard)
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(parseInt(id));
  }
}
