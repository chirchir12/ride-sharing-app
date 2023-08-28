import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { RideRequestEntity } from './ride-request.entity';

@Entity({
  name: 'rides',
})
export class RidesEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'pk_rides_id',
  })
  id: number;

  @Column({
    type: 'bigint',
  })
  driver_id: number;

  @Column({
    type: 'bigint',
  })
  user_id: number;

  @Column({
    type: 'bigint',
  })
  request_id: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  status: 'accepted' | 'completed' | 'canceled';

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
    type: 'timestamp',
    nullable: true,
  })
  completed_at: Date;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  estimated_amount: number;

  @Column({
    type: 'decimal',
    nullable: true,
  })
  actual_amount: number;

  //   foreign keys
  @ManyToOne(() => UsersEntity, (entity) => entity.user_rides)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'FK_rides_user_id',
  })
  user: UsersEntity;

  @ManyToOne(() => UsersEntity, (entity) => entity.driver_rides)
  @JoinColumn({
    name: 'driver_id',
    foreignKeyConstraintName: 'FK_rides_driver_id',
  })
  driver: UsersEntity;

  @OneToOne(() => RideRequestEntity, (entity) => entity.ride)
  @JoinColumn({
    name: 'request_id',
    foreignKeyConstraintName: 'fk_rides_request_id',
  })
  ride_request: RideRequestEntity;
}
