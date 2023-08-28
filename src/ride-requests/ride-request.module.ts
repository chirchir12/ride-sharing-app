import { Module } from '@nestjs/common';
import { RideRequestRepository } from './ride-request.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideRequestEntity } from './ride-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RideRequestEntity])],
  providers: [RideRequestRepository],
})
export class RideRequestsModule {}
