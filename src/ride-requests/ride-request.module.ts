import { Module } from '@nestjs/common';
import { RideRequestRepository } from './ride-request.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideRequestEntity } from './ride-request.entity';
import { RideRequestService } from './ride-request.service';
import { RideRequestController } from './ride-request.controller';
import { DriversModule } from '../drivers/drivers.module';
import { RidesEntity } from './rides.entity';
import { RideRequestSqlService } from './rideRequestSql.service';

@Module({
  controllers: [RideRequestController],
  imports: [
    TypeOrmModule.forFeature([RideRequestEntity, RidesEntity]),
    DriversModule,
  ],
  providers: [RideRequestRepository, RideRequestSqlService, RideRequestService],
})
export class RideRequestsModule {}
