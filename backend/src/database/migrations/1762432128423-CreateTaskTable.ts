import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateTaskTable1762432128423 implements MigrationInterface {
  name = 'CreateTaskTable1762432128423';

  private readonly taskTitleIndex = new TableIndex({
    name: 'IDX_task_title',
    columnNames: ['title'],
  });

  private readonly taskStatusIndex = new TableIndex({
    name: 'IDX_task_status_id',
    columnNames: ['statusId'],
  });

  private readonly taskStatusForeignKey = new TableForeignKey({
    name: 'FK_task_status',
    columnNames: ['statusId'],
    referencedTableName: 'task_status',
    referencedColumnNames: ['id'],
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'task',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'statusId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndices('task', [
      this.taskTitleIndex,
      this.taskStatusIndex,
    ]);

    await queryRunner.createForeignKeys('task', [this.taskStatusForeignKey]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys('task', [this.taskStatusForeignKey]);

    await queryRunner.dropIndices('task', [
      this.taskStatusIndex,
      this.taskTitleIndex,
    ]);

    await queryRunner.dropTable('task');
  }
}
