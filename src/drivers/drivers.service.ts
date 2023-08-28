import { Injectable } from '@nestjs/common';
import { DriverRepository } from './drivers.repository';
import { DriverEntity } from './drivers.entity';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { UpdateCurrentLocationDto } from './dto/update-current-location.dto';
import { Point } from 'geojson';

@Injectable()
export class DriverService {
  constructor(private readonly repository: DriverRepository) {}

  driverInstance(params: Partial<DriverEntity>): Partial<DriverEntity> {
    return this.repository.create(params);
  }

  saveDriver(params: Partial<DriverEntity>): Promise<Partial<DriverEntity>> {
    return this.repository.save(params);
  }

  driverExist(userid: number): Promise<Partial<DriverEntity>> {
    return this.repository.findOne({ where: { user_id: userid } });
  }

  async getProfile(userid: number) {
    return this.repository.findOne({ where: { user_id: userid } });
  }

  async updateAvailability(
    userId: number,
    params: UpdateAvailabilityDto,
  ): Promise<Partial<DriverEntity>> {
    const driver = await this.repository.findOne({
      where: { user_id: userId },
    });
    const driverInstance = this.driverInstance({
      ...driver,
      availability: params.status,
    });
    await this.repository.save(driverInstance);
    return {
      user_id: userId,
      availability: params.status,
    };
  }

  async updateCurrentLocation(
    userId: number,
    params: UpdateCurrentLocationDto,
  ) {
    const driver = await this.repository.findOne({
      where: { user_id: userId },
    });
    const pointObject: Point = {
      type: 'Point',
      coordinates: [params.longitude, params.latitude],
    };
    const driverInstance = this.driverInstance({
      ...driver,
      current_location: pointObject,
    });
    await this.repository.save(driverInstance);
    return {
      user_id: userId,
      latitude: params.latitude,
      longitude: params.longitude,
    };
  }
}
