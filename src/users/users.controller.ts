import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from './users.service';
import { getUserDto } from './dto/get-user.dto';
import { AuthService } from './auth.service';
import { ResponseInterceptor } from 'src/interceptor/response-http.interceptor';
import { SigninDto } from './dto/signin.dto';
import { ResponseSigninDto } from './dto/response-signin.dto';

@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  signup(@Body() body: SignupDto) {
    const { name, email, password } = body;

    return this.authService.signup({ name, email, password });
  }
  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Get('/:id')
  @UseInterceptors(new ResponseInterceptor<getUserDto>(getUserDto))
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(parseInt(id));
  }
  @Get()
  @UseInterceptors(new ResponseInterceptor<getUserDto>(getUserDto))
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
  @Put('/:id')
  @UseInterceptors(new ResponseInterceptor<getUserDto>(getUserDto))
  updateUser(@Param('id') id: string, @Body() body: Partial<SignupDto>) {
    return this.usersService.updateUser(parseInt(id), body);
  }
  @Delete('/:id')
  @UseInterceptors(new ResponseInterceptor<getUserDto>(getUserDto))
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(parseInt(id));
  }
}
