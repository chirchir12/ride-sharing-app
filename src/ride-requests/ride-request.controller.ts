import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RideRequestService } from './ride-request.service';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/auth-decorator';
import { UsersEntity } from '../users/users.entity';
import { RideRequestDto } from './dtos/create-ride-request.dto';
import { AcceptRideRequestDto } from './dtos/accept-ride-request.dto';
import { CancelRideRequestDto } from './dtos/cancel-ride-request.dto';
import { CompleteRideRequestDto } from './dtos/complete-ride-request.dto';
import { SearchRidesdDto } from './dtos/search-ride.dto';

@UseGuards(SessionAuthGuard, JWTAuthGuard)
@Controller()
export class RideRequestController {
  constructor(private readonly service: RideRequestService) {}

  @Post('users/rides/request')
  requestRide(@AuthUser() user: UsersEntity, @Body() params: RideRequestDto) {
    params.user_id = user.id;
    return this.service.requestRide(params);
  }

  @Get('users/rides')
  allUserRides(@AuthUser() user: UsersEntity) {
    return this.service.allUserRides(user.id);
  }

  @Post('users/rides/cancel')
  @HttpCode(HttpStatus.OK)
  cancelRideRequest(
    @AuthUser() user: UsersEntity,
    @Body() params: CancelRideRequestDto,
  ) {
    return this.service.cancelRideRequest(user.id, params.request_id);
  }

  @Post('drivers/rides/accept')
  @HttpCode(HttpStatus.OK)
  acceptRideRequest(
    @AuthUser() user: UsersEntity,
    @Body() params: AcceptRideRequestDto,
  ) {
    return this.service.acceptRideRequest(user.id, params.request_id);
  }

  @Post('drivers/rides/complete')
  @HttpCode(HttpStatus.OK)
  completeRideRequest(
    @AuthUser() user: UsersEntity,
    @Body() params: CompleteRideRequestDto,
  ) {
    return this.service.completeRideRequest(user.id, params.request_id);
  }

  @Get('drivers/rides/receive')
  @HttpCode(HttpStatus.OK)
  getPendingRideRequest(@AuthUser() user: UsersEntity) {
    return this.service.getPendingRideRequests(user.id);
  }

  @Get('drivers/rides')
  allDriverRides(@AuthUser() user: UsersEntity) {
    return this.service.allDriverRides(user.id);
  }

  @Get('rides/:id')
  getRide(@Param('id', ParseIntPipe) id: number) {
    return this.service.getRideRequest(id);
  }
}
