import { Module } from '@nestjs/common';
import { DriverService } from './drivers.service';
import { DriverRepository } from './drivers.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverEntity } from './drivers.entity';
import { DriverController } from './drivers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DriverEntity])],
  providers: [DriverRepository, DriverService],
  exports: [DriverService],
  controllers: [DriverController],
})
export class DriversModule {}
