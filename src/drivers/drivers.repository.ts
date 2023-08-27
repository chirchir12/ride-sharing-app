import { DataSource, Repository } from 'typeorm';
import { DriverEntity } from './drivers.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverRepository extends Repository<DriverEntity> {
  constructor(private dataSource: DataSource) {
    super(DriverEntity, dataSource.createEntityManager());
  }
}
