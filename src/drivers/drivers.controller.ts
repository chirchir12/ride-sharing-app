import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DriverService } from './drivers.service';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/auth-decorator';
import { UsersEntity } from '../users/users.entity';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { UpdateCurrentLocationDto } from './dto/update-current-location.dto';

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

  @Post('update/availability')
  @HttpCode(HttpStatus.OK)
  async updateAvailability(
    @AuthUser() user: UsersEntity,
    @Body() params: UpdateAvailabilityDto,
  ) {
    return this.service.updateAvailability(user.id, params);
  }

  @Post('update/location')
  @HttpCode(HttpStatus.OK)
  async updateCurrentLocation(
    @AuthUser() user: UsersEntity,
    @Body() params: UpdateCurrentLocationDto,
  ) {
    return this.service.updateCurrentLocation(user.id, params);
  }
}
