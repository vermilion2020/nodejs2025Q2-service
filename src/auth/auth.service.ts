import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  createTokens(jwtPayloadDto: JwtPayloadDto) {
    const accessToken = this.jwtService.sign(jwtPayloadDto, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });
    const refreshToken = this.jwtService.sign(jwtPayloadDto, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });
    return { accessToken, refreshToken };
  }

  async signup(createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);
      return {
        message: 'User is created.',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(createUserDto: CreateUserDto) {
    const errorMessage = 'Login or password is incorrect';
    const { login, password } = createUserDto;
    const user = await this.userService.findLogin(login);
    if (!user) {
      throw new UnauthorizedException(errorMessage);
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      throw new UnauthorizedException(errorMessage);
    }

    return this.createTokens({ userId: user.id, login });
  }

  async refresh(refreshDto: RefreshDto) {
    try {
      const { userId, login } = await this.jwtService.verifyAsync(
        refreshDto.refreshToken,
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
        },
      );
      return this.createTokens({ userId, login });
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
