import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { CustomHttpException } from '../common/exception/custom-http-exception';
import { authErrors } from './errors';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersEntity } from '../users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

  async verifyPayload(payload: JwtPayload): Promise<Partial<UsersEntity>> {
    let user: Partial<UsersEntity>;

    try {
      user = await this.userService.getByEmail(payload.sub);
    } catch (error) {
      throw new CustomHttpException(authErrors.unAuthorized, 401);
    }
    delete user.password;
    delete user.hashPassword;
    delete user.salt;
    delete user.skipHashPassword;

    return user;
  }

  async login(email: string, password: string): Promise<Partial<UsersEntity>> {
    let user: Partial<UsersEntity>;

    try {
      user = await this.userService.getByEmail(email);
    } catch (err) {
      throw new CustomHttpException(authErrors.unAuthorized, 401);
    }

    if (!(await user.validatePassword(password))) {
      throw new CustomHttpException(authErrors.invalidUsernamePassword, 401);
    }
    delete user.password;
    delete user.hashPassword;
    delete user.salt;

    return user;
  }

  signToken(user: Partial<UsersEntity>): string {
    const payload = {
      sub: user.email,
    };

    return this.jwtService.sign(payload);
  }
}
