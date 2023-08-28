import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/auth-decorator';
import { UsersEntity } from './users.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@UseGuards(SessionAuthGuard, JWTAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  getProfile(@AuthUser() user: UsersEntity): UsersEntity {
    return user;
  }
}
