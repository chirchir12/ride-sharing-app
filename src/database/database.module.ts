import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConnection } from '../config/interfaces';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: config.get<DBConnection>('db').type,
          host: config.get<DBConnection>('db').host,
          port: config.get<DBConnection>('db').port,
          username: config.get<DBConnection>('db').username,
          password: config.get<DBConnection>('db').password,
          entities: ['dist/**/*.entity.js'],
          migrations: ['dist/database/migrations/*.js'],
          extra: {
            poolSize: 30,
            connectionTimeoutMillis: 30000,
            query_timeout: 10000,
            statement_timeout: 20000,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
