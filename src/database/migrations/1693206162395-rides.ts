import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rides1693206162395 implements MigrationInterface {
  name = 'Rides1693206162395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rides" (
        "id" BIGSERIAL NOT NULL, 
        "driver_id" bigint NOT NULL, 
        "user_id" bigint NOT NULL, 
        "request_id" bigint NOT NULL, 
        "status" character varying(50) NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "completed_at" TIMESTAMP, 
        "estimated_amount" numeric, 
        "actual_amount" numeric, 
        CONSTRAINT "REL_eb9b79805e6a7b6b244d2ab58a" UNIQUE ("request_id"), CONSTRAINT "pk_rides_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rides" ADD CONSTRAINT "FK_rides_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rides" ADD CONSTRAINT "FK_rides_driver_id" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rides" ADD CONSTRAINT "fk_rides_request_id" FOREIGN KEY ("request_id") REFERENCES "ride_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rides" DROP CONSTRAINT "fk_rides_request_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rides" DROP CONSTRAINT "FK_rides_driver_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rides" DROP CONSTRAINT "FK_rides_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "rides"`);
  }
}
