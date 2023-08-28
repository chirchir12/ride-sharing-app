import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { DriverEntity } from '../drivers/drivers.entity';
import { RideRequestEntity } from '../ride-requests/ride-request.entity';
import { RidesEntity } from '../ride-requests/rides.entity';

@Entity({
  name: 'users',
})
export class UsersEntity {
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'pk_users_id',
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: '230',
    unique: true,
  })
  @Index('idx_users_email')
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  @Index('idx_users_phone_number')
  phone_number: string;

  @Column({
    default: false,
  })
  skipHashPassword: boolean;

  @Column()
  salt: string;

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

  //foreign key
  @OneToOne(() => DriverEntity, (entity) => entity.user)
  driver?: DriverEntity;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password && !this.skipHashPassword) {
      await this.hashPassword();
    }
  }

  @OneToMany(() => RideRequestEntity, (entity) => entity.user)
  ride_requests: RideRequestEntity[];

  @OneToMany(() => RidesEntity, (entity) => entity.user)
  user_rides: RidesEntity[];

  @OneToMany(() => RidesEntity, (entity) => entity.driver)
  driver_rides: RidesEntity[];

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.password && !this.skipHashPassword) {
      await this.hashPassword();
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt); // create a new one and compare with the saved one
    return hash === this.password;
  }

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, this.salt);
  }
}
