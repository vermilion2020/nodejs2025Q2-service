import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshDto } from './dto/refresh.dto';
import { Public } from './auth.guard';
import { StatusCodes } from 'http-status-codes';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('signup')
  @Public()
  @ApiOperation({ summary: 'User sign up' })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  @Public()
  @HttpCode(StatusCodes.ACCEPTED)
  @ApiOperation({ summary: 'User login' })
  login(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }

  @Post('refresh')
  @HttpCode(StatusCodes.ACCEPTED)
  @ApiOperation({ summary: 'Refresh token' })
  @ApiBearerAuth()
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
