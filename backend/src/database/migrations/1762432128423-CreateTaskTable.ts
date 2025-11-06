import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskTable1762432128423 implements MigrationInterface {
  name = 'CreateTaskTable1762432128423';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "startDate" TIMESTAMP, "endDate" TIMESTAMP, "assignedUserId" integer, "statusId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3399e2710196ea4bf734751558" ON "task" ("title") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_008a6ce926bcdbe5fa89abf1fb" ON "task" ("startDate") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_82dd8c2ddcf7ffd6be5dd0cd5a" ON "task" ("endDate") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_task_description" ON "task" ("description") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_task_assignedUserId" ON "task" ("assignedUserId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_e3bd734666db0cb70e8c8d542c8" FOREIGN KEY ("assignedUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_02068239bb8d5b2fc7f3ded618c" FOREIGN KEY ("statusId") REFERENCES "task_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_02068239bb8d5b2fc7f3ded618c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_e3bd734666db0cb70e8c8d542c8"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_task_assignedUserId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_task_description"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_82dd8c2ddcf7ffd6be5dd0cd5a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_008a6ce926bcdbe5fa89abf1fb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3399e2710196ea4bf734751558"`,
    );
    await queryRunner.query(`DROP TABLE "task"`);
  }
}
