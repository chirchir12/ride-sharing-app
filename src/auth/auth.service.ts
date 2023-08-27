import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { CustomHttpException } from '../common/exception/custom-http-exception';
import { authErrors } from './errors';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersEntity } from '../users/users.entity';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { DriverService } from '../drivers/drivers.service';
import { Point } from 'geojson';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly driverService: DriverService,
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

  async registerUser(params: RegisterDto): Promise<Partial<UsersEntity>> {
    return this.register(params);
  }

  async registerDriver(
    params: RegisterDriverDto,
  ): Promise<Partial<UsersEntity>> {
    try {
      const { email, phone_number, latitude, longitude } = params;
      let user = await this.userService.userExist(phone_number, email);
      if (!user) {
        user = await this.register(params);
      }
      const pointObject: Point = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
      const driverExist = await this.driverService.driverExist(user.id);
      if (driverExist) {
        throw new CustomHttpException(authErrors.driverExist);
      }
      const driverInstance = this.driverService.driverInstance({
        availability: false,
        current_location: pointObject,
        user_id: user.id,
      });
      await this.driverService.saveDriver(driverInstance);

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
