import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { users } from '../db/db';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    const user = {
      id: randomUUID(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...createUserDto,
    };
    users.set(user.id, user);
    return user;
  }

  findAll() {
    console.log(users);
    return Array.from(users.values());
  }

  findOne(id: string) {
    const user = users.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = users.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    users.set(id, { ...user, ...updateUserDto });
    return users.get(id);
  }

  remove(id: string) {
    if (!users.has(id)) {
      throw new NotFoundException('User not found');
    }
    users.delete(id);
    return true;
  }
}
