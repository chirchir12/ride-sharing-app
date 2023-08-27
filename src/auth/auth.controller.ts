import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UsersEntity } from '../users/users.entity';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthUser } from './auth-decorator';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { JWTAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(AuthTokenInterceptor)
  @HttpCode(HttpStatus.CREATED)
  register(@Body() params: RegisterDto): Promise<Partial<UsersEntity>> {
    return this.authService.register(params);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AuthTokenInterceptor)
  async login(@AuthUser() user: UsersEntity): Promise<UsersEntity> {
    return user;
  }
}
