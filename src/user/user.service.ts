import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserData } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  removePassword(user: UserData) {
    const { id, login, createdAt, updatedAt, version } = user;
    return {
      id,
      login,
      createdAt: new Date(createdAt).getTime(),
      updatedAt: new Date(updatedAt).getTime(),
      version,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: createUserDto,
    });
    return this.removePassword(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user: UserData) => this.removePassword(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return this.removePassword(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    if (updateUserDto.oldPassword !== user.password) {
      throw new ForbiddenException('Old password is incorrect');
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        version: user.version + 1,
        updatedAt: new Date(),
        password: updateUserDto.newPassword,
      },
    });
    return this.removePassword(updatedUser);
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    await this.prisma.user.delete({
      where: { id },
    });
    return true;
  }
}
