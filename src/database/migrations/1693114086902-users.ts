import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1693114086902 implements MigrationInterface {
  name = 'Users1693114086902';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" BIGSERIAL NOT NULL, 
      "email" character varying(230) NOT NULL, 
      "password" character varying NOT NULL, 
      "name" character varying NOT NULL, 
      "phone_number" character varying NOT NULL, 
      "skipHashPassword" boolean NOT NULL DEFAULT false, 
      "salt" character varying NOT NULL, 
      CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
      CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number"), 
      CONSTRAINT "pk_users_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_users_email" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_users_phone_number" ON "users" ("phone_number") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_users_phone_number"`);
    await queryRunner.query(`DROP INDEX "public"."idx_users_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
