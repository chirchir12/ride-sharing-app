import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export type DBConnection = PostgresConnectionOptions & {
  username: string;
  password: string;
  host: string;
  port: number;
};

export type DB_TYPES =
  | 'postgres'
  | 'mysql'
  | 'mariadb'
  | 'cockroachdb'
  | 'sqlite'
  | 'mssql'
  | 'sap'
  | 'oracle'
  | 'cordova'
  | 'nativescript'
  | 'react-native'
  | 'sqljs'
  | 'mongodb';
