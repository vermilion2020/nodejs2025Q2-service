import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { users } from '../db/db';
import { randomUUID } from 'node:crypto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  removePassword(user: User) {
    const { id, login, createdAt, updatedAt, version } = user;
    return { id, login, createdAt, updatedAt, version };
  }

  create(createUserDto: CreateUserDto) {
    const user = {
      id: randomUUID(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...createUserDto,
    };
    users.set(user.id, user);
    return this.removePassword(user);
  }

  findAll() {
    return Array.from(users.values()).map((user) => this.removePassword(user));
  }

  findOne(id: string) {
    const user = users.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.removePassword(user);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = users.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.oldPassword !== user.password) {
      throw new ForbiddenException('Old password is incorrect');
    }
    users.set(id, {
      ...user,
      version: user.version + 1,
      updatedAt: Date.now(),
      password: updateUserDto.newPassword,
    });
    return this.removePassword(users.get(id));
  }

  remove(id: string) {
    if (!users.has(id)) {
      throw new NotFoundException('User not found');
    }
    users.delete(id);
    return true;
  }
}
