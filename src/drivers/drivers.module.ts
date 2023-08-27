import { Module } from '@nestjs/common';
import { DriverService } from './drivers.service';
import { DriverRepository } from './drivers.repository';

@Module({
  providers: [DriverRepository, DriverService],
  exports: [DriverService],
})
export class DriversModule {}
