import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
