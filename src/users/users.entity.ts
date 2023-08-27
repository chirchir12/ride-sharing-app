import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password && !this.skipHashPassword) {
      await this.hashPassword();
    }
  }

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
