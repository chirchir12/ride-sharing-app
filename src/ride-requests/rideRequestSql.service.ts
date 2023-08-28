import { join } from 'path';
import { LoadSQL } from '../common/services/load-sql.service';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  CalculatedDistance,
  DestinationLocation,
  PendingRideReqiests,
  PickupLocation,
} from './interface';
interface queriesInterface {
  calculateDistance: string;
  getPendingRequests: string;
}

const path_to_sql_dir = join(__dirname, 'sql');

@Injectable()
export class RideRequestSqlService extends LoadSQL<queriesInterface> {
  public queries: queriesInterface = {} as queriesInterface;
  private readonly logger = new Logger(RideRequestSqlService.name);

  constructor(public readonly dataSource: DataSource) {
    super(path_to_sql_dir, dataSource);
    this.readSQLFiles();
  }

  calculateDistance(
    pickup: PickupLocation,
    destionation: DestinationLocation,
  ): Promise<CalculatedDistance[]> {
    try {
      return this.runSQL(this.queries.calculateDistance, [
        pickup.longitude,
        pickup.latitude,
        destionation.longitude,
        destionation.latitude,
      ]);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  getPendingRequests(
    driver_id: number,
    distance_in_meters: number,
  ): Promise<PendingRideReqiests[]> {
    try {
      return this.runSQL(this.queries.getPendingRequests, [
        driver_id,
        distance_in_meters,
      ]);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
