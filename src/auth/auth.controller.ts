import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('signup')
  @ApiOperation({ summary: 'User sign up' })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  login(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
