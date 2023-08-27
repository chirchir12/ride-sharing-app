import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnablePostGISExtension1628793558290 implements MigrationInterface {
  name = 'EnablePostGISExtension1628793558290';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS postgis;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP EXTENSION IF EXISTS postgis;');
  }
}
