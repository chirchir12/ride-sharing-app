import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UsersEntity } from '../users/users.entity';

export interface IGetUserAuthInfoRequest extends Request {
  user: Partial<UsersEntity>; // or any other type
}

export const AuthUser = createParamDecorator(
  (data: keyof UsersEntity, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<IGetUserAuthInfoRequest>()
      .user as UsersEntity;

    return data ? user && user[data] : user;
  },
);
