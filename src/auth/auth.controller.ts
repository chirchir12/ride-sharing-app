import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UsersEntity } from '../users/users.entity';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthUser } from './auth-decorator';
import { RegisterDriverDto } from './dto/register-driver.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/register')
  @UseInterceptors(AuthTokenInterceptor)
  @HttpCode(HttpStatus.CREATED)
  registerUser(@Body() params: RegisterDto): Promise<Partial<UsersEntity>> {
    return this.authService.registerUser(params);
  }

  @Post('driver/register')
  @UseInterceptors(AuthTokenInterceptor)
  @HttpCode(HttpStatus.CREATED)
  registerDriver(
    @Body() params: RegisterDriverDto,
  ): Promise<Partial<UsersEntity>> {
    return this.authService.registerDriver(params);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AuthTokenInterceptor)
  async login(@AuthUser() user: UsersEntity): Promise<UsersEntity> {
    return user;
  }
}
