import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { CustomHttpException } from '../common/exception/custom-http-exception';
import { authErrors } from './errors';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async register(params: RegisterDto) {
    const { email, phone_number } = params;
    try {
      const userExist = await this.userService.userExist(phone_number, email);
      if (userExist) {
        throw new CustomHttpException(authErrors.userExist);
      }
      //
      const userInstance = await this.userService.userInstance({
        ...params,
        salt: await bcrypt.genSalt(),
        email: email.toLowerCase(),
      });
      const user = await this.userService.create(userInstance);
      delete user.password;
      delete user.salt;
      delete user.skipHashPassword;
      return user;
    } catch (error) {
      throw error;
    }
  }

  login() {
    return;
  }
}
