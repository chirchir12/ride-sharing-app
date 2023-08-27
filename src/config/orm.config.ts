import { DataSource, DataSourceOptions } from 'typeorm';
import { DB_CONFIG } from './validation/db.validate';
export const ormconfig: DataSourceOptions = {
  ...DB_CONFIG,
  migrationsTransactionMode: 'each',
  migrationsRun: process.env.NODE_ENV === 'test',
  dropSchema: process.env.NODE_ENV === 'test',
  migrationsTableName: 'migration',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
};

export default new DataSource(ormconfig); // this is for migrations using cli
