import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signin(signinData: SigninDto) {
    const { email, password } = signinData;
    const user = await this.usersService.getUser(email);
    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials',
        errors: ['Invalid email or password'],
        data: null,
      };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid credentials',
        errors: ['Invalid email or password'],
        data: null,
      };
    }

    const payload = {
      user_id: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      success: true,
      message: 'User signed in successfully',
      errors: null,
      data: { accessToken, user },
    };
  }
  async signup(signupData: { name: string; email: string; password: string }) {
    const { name, email, password } = signupData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const existingUser = await this.usersService.getUserByName(name);
    if (existingUser) {
      return {
        success: false,
        message: 'Username already in use',
        errors: ['Username already in use'],
        data: null,
      };
    }
    const existingUserByEmail = await this.usersService.getUser(email);
    if (existingUserByEmail) {
      return {
        success: false,
        message: 'Email already in use',
        errors: ['Email already in use'],
        data: null,
      };
    }
    const user = await this.usersService.create(email, hashedPassword, name);

    return {
      success: true,
      message: 'User created successfully',
      errors: null,
      data: user,
    };
  }
}
