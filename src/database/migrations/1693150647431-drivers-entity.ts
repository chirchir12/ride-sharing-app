import { MigrationInterface, QueryRunner } from 'typeorm';

export class DriversEntity1693150647431 implements MigrationInterface {
  name = 'DriversEntity1693150647431';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "drivers" (
        "id" BIGSERIAL NOT NULL, 
        "user_id" bigint NOT NULL, 
        "availability" boolean NOT NULL, 
        "current_location" geography(Point,4326), 
        CONSTRAINT "REL_8e224f1b8f05ace7cfc7c76d03" UNIQUE ("user_id"), 
        CONSTRAINT "PK_drivers_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e9eda945e9fee3a8bee1cb0e80" ON "drivers" USING GiST ("current_location") `,
    );
    await queryRunner.query(
      `ALTER TABLE "drivers" ADD CONSTRAINT "FK_drivers_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "drivers" DROP CONSTRAINT "FK_drivers_user_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e9eda945e9fee3a8bee1cb0e80"`,
    );
    await queryRunner.query(`DROP TABLE "drivers"`);
  }
}
