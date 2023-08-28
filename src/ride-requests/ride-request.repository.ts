import { DataSource, Repository } from 'typeorm';
import { RideRequestEntity } from './ride-request.entity';
import { Injectable } from '@nestjs/common';
import { RideRequestSqlService } from './rideRequestSql.service';
import {
  CalculatedDistance,
  DestinationLocation,
  PickupLocation,
} from './interface';

@Injectable()
export class RideRequestRepository extends Repository<RideRequestEntity> {
  constructor(
    private dataSource: DataSource,
    private readonly sqlService: RideRequestSqlService,
  ) {
    super(RideRequestEntity, dataSource.createEntityManager());
  }

  async calculateDistanceInMeters(
    pickup: PickupLocation,
    destination: DestinationLocation,
  ): Promise<CalculatedDistance> {
    const distanceData = await this.sqlService.calculateDistance(
      pickup,
      destination,
    );
    return distanceData[0];
  }
}
