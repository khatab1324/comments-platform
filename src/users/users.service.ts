import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from './Auth/guards/jwt-auth.guard';

@Injectable()

export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string, name: string) {
    const user = this.repo.create({ email, password, name });
    return this.repo.save(user);
  }
  getUser(email: string) {
    return this.repo.findOne({ where: { email } });
  }
  async getUserByName(name: string) {
    const user = await this.repo.findOne({ where: { name } });
    console.log(user);
    return user;
  }
  getUserById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
  getAllUsers() {
    return this.repo.find();
  }
  async updateUser(id: number, attrs: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }
  async removeUser(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    return this.repo.remove(user);
  }
}
