import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Point,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { RidesEntity } from './rides.entity';

@Entity({
  name: 'ride_requests',
})
export class RideRequestEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'pk_ride_requests_id',
  })
  id: number;

  @Index('idx_ride_request_pickup_location', { spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  pickup_location: Point;

  @Index('idx_ride_request_destination_location', { spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  destination_location: Point;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({
    type: 'varchar',
    length: 50,
  })
  status: 'pending' | 'accepted' | 'completed' | 'canceled';

  @Column({
    type: 'bigint',
  })
  user_id: number;

  @ManyToOne(() => UsersEntity, (entity) => entity.ride_requests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'FK_ride_reuqests_user_id',
  })
  user: UsersEntity;

  @OneToOne(() => RidesEntity, (entity) => entity.ride_request)
  ride: RidesEntity;
}
