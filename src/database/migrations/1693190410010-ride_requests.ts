import { MigrationInterface, QueryRunner } from 'typeorm';

export class RideRequests1693190410010 implements MigrationInterface {
  name = 'RideRequests1693190410010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ride_requests" (
        "id" BIGSERIAL NOT NULL, 
        "pickup_location" geography(Point,4326), 
        "destination_location" geography(Point,4326), 
        "status" character varying(50) NOT NULL, 
        "user_id" bigint NOT NULL, 
        CONSTRAINT "pk_ride_requests_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_ride_request_pickup_location" ON "ride_requests" USING GiST ("pickup_location") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_ride_request_destination_location" ON "ride_requests" USING GiST ("destination_location") `,
    );
    await queryRunner.query(
      `ALTER TABLE "ride_requests" ADD CONSTRAINT "FK_ride_reuqests_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ride_requests" DROP CONSTRAINT "FK_ride_reuqests_user_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_ride_request_destination_location"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_ride_request_pickup_location"`,
    );
    await queryRunner.query(`DROP TABLE "ride_requests"`);
  }
}
