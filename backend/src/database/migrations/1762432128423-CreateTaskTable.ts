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

  private readonly taskStartDateIndex = new TableIndex({
    name: 'IDX_task_start_date',
    columnNames: ['startDate'],
  });

  private readonly taskEndDateIndex = new TableIndex({
    name: 'IDX_task_end_date',
    columnNames: ['endDate'],
  });

  private readonly taskStatusIndex = new TableIndex({
    name: 'IDX_task_status_id',
    columnNames: ['statusId'],
  });

  private readonly taskAssignedDateRangeIndex = new TableIndex({
    name: 'IDX_task_assigned_range',
    columnNames: ['assignedUserId', 'startDate', 'endDate'],
  });

  private readonly taskAssignedUserForeignKey = new TableForeignKey({
    name: 'FK_task_assigned_user',
    columnNames: ['assignedUserId'],
    referencedTableName: 'user',
    referencedColumnNames: ['id'],
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
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
            name: 'startDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'endDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'assignedUserId',
            type: 'int',
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
      this.taskStartDateIndex,
      this.taskEndDateIndex,
      this.taskStatusIndex,
      this.taskAssignedDateRangeIndex,
    ]);

    await queryRunner.createForeignKeys('task', [
      this.taskAssignedUserForeignKey,
      this.taskStatusForeignKey,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys('task', [
      this.taskStatusForeignKey,
      this.taskAssignedUserForeignKey,
    ]);

    await queryRunner.dropIndices('task', [
      this.taskAssignedDateRangeIndex,
      this.taskStatusIndex,
      this.taskEndDateIndex,
      this.taskStartDateIndex,
      this.taskTitleIndex,
    ]);

    await queryRunner.dropTable('task');
  }
}
