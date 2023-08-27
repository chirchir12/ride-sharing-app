import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersEntity } from '../users/users.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(
    user: UsersEntity,
    done: (err: Error | null, id?: UsersEntity) => void,
  ): void {
    done(null, user);
  }

  deserializeUser(
    payload: unknown,
    done: (err: Error | null, payload?: unknown) => void,
  ): void {
    done(null, payload);
  }
}
