import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaskFulltextIndex1765131000000 implements MigrationInterface {
  name = 'AddTaskFulltextIndex1765131000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE task ADD FULLTEXT INDEX IDX_task_title_description (title, description)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE task DROP INDEX IDX_task_title_description`,
    );
  }
}
