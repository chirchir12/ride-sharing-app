import { DataSource, Repository } from 'typeorm';
import { RideRequestEntity } from './ride-request.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RideRequestRepository extends Repository<RideRequestEntity> {
  constructor(private dataSource: DataSource) {
    super(RideRequestEntity, dataSource.createEntityManager());
  }
}
