import { MigrationInterface, QueryRunner } from 'typeorm';

export class RideRequestAddTimestamps1693206702693
  implements MigrationInterface
{
  name = 'RideRequestAddTimestamps1693206702693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ride_requests" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "ride_requests" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ride_requests" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ride_requests" DROP COLUMN "created_at"`,
    );
  }
}
