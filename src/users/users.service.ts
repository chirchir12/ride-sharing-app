import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CustomHttpException } from '../common/exception/custom-http-exception';
import { userErrors } from './errors';
@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async getById(id: number) {
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

  async getByphone(phone: string) {
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

  async userExist(phone: string, email: string) {
    const user = await this.repository.findOne({
      where: [{ email }, { phone_number: phone }],
      select: ['id', 'email', 'phone_number', 'name'],
    });
    return user;
  }

  // async create(params) {
  //   return;
  // }

  // async update(params) {
  //   return;
  // }
}
