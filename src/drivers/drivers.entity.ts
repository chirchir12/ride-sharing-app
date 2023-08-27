import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { Point } from 'geojson';

@Entity({
  name: 'drivers',
})
export class DriverEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'PK_drivers_id',
  })
  id: number;

  @Column({
    type: 'bigint',
  })
  user_id: number;

  @Column()
  availability: boolean;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  current_location: Point;

  //foreign key
  @OneToOne(() => UsersEntity, (entity) => entity.driver, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'FK_drivers_user_id',
  })
  user?: UsersEntity;
}
