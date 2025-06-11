import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserData } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const CRYPT_SALT = +process.env.CRYPT_SALT;

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
    const cryptedPassword = await bcrypt.hash(
      createUserDto.password,
      CRYPT_SALT,
    );
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: cryptedPassword },
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

  async findLogin(login: string) {
    const user = await this.prisma.user.findFirst({
      where: { login },
    });
    if (!user) {
      throw new NotFoundException(`User with login "${login}" not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    const oldPasswordCorrect = await bcrypt.compare(
      updateUserDto.oldPassword,
      user.password,
    );
    if (!oldPasswordCorrect) {
      throw new ForbiddenException('Old password is incorrect');
    }
    const cryptedNewPassword = await bcrypt.hash(
      updateUserDto.newPassword,
      CRYPT_SALT,
    );
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        version: user.version + 1,
        updatedAt: new Date(),
        password: cryptedNewPassword,
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
