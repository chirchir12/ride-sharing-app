import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CustomHttpException } from '../common/exception/custom-http-exception';
import { userErrors } from './errors';
import { UsersEntity } from './users.entity';
@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async getById(id: number): Promise<Partial<UsersEntity>> {
    const user = await this.repository.findOne({
      where: {
        id,
      },
      select: ['id', 'email', 'phone_number', 'name'],
    });

    if (!user) {
      throw new CustomHttpException(userErrors.usernotFound, 404);
    }
    return user;
  }

  async getByphone(phone: string): Promise<Partial<UsersEntity>> {
    const user = await this.repository.findOne({
      where: {
        phone_number: phone,
      },
      select: ['id', 'email', 'phone_number', 'name'],
    });

    if (!user) {
      throw new CustomHttpException(userErrors.usernotFound, 404);
    }
    return user;
  }

  async userExist(
    phone: string,
    email: string,
  ): Promise<Partial<UsersEntity> | null> {
    const user = await this.repository.findOne({
      where: [{ email: email.toLowerCase() }, { phone_number: phone }],
      select: ['id', 'email', 'phone_number', 'name'],
    });
    return user;
  }

  async userInstance(params: Partial<UsersEntity>): Promise<UsersEntity> {
    return this.repository.create(params);
  }

  async create(params: Partial<UsersEntity>): Promise<UsersEntity> {
    return this.repository.save(params);
  }

  // async update(params) {
  //   return;
  // }
}
