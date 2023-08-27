// db connection schemas
import * as Joi from 'joi';

import * as dotenv from 'dotenv';
import { DBConnection } from '../interfaces';

dotenv.config();

const schema = Joi.object({
  host: Joi.string().required(),
  type: Joi.valid('postgres'),
  port: Joi.number().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  database: Joi.string().required(),
  synchronize: Joi.boolean().default(false),
  logging: Joi.boolean().default(false),
});

const toBeValidated: DBConnection = {
  host: process.env.DB_HOST,
  type: 'postgres', // this is because the intention is to use postgres
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: Number(process.env.DB_SYCHRONIZE) === 1,
  logging: Number(process.env.DB_LOGGINGs) === 1,
};

// db creator schema

const { error, value: validated } = schema.validate({
  ...toBeValidated,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const DB_CONFIG: DBConnection = validated;
