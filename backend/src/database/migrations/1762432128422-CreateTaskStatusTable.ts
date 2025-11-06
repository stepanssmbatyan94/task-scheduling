import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskStatusTable1762432128422 implements MigrationInterface {
  name = 'CreateTaskStatusTable1762432128422';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task_status" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_task_status" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task_status"`);
  }
}
