import { Controller, Get, UseGuards } from '@nestjs/common';
import { DriverService } from './drivers.service';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/auth-decorator';
import { UsersEntity } from '../users/users.entity';

@UseGuards(SessionAuthGuard, JWTAuthGuard)
@Controller('drivers')
export class DriverController {
  constructor(private readonly service: DriverService) {}

  @Get('profile')
  async getProfile(@AuthUser() user: UsersEntity) {
    const driverInfo = await this.service.getProfile(user.id);
    return {
      ...user,
      availability: driverInfo.availability,
      longitude: driverInfo.current_location.coordinates[0] || null,
      latitude: driverInfo.current_location.coordinates[1] || null,
    };
  }
}
