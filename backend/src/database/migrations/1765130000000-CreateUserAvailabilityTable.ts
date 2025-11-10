import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateUserAvailabilityTable1765130000000
  implements MigrationInterface
{
  name = 'CreateUserAvailabilityTable1765130000000';

  private readonly userAvailabilityTaskUnique = new TableIndex({
    name: 'UQ_user_availability_task',
    columnNames: ['taskId'],
    isUnique: true,
  });

  private readonly userAvailabilityUserRangeIndex = new TableIndex({
    name: 'IDX_user_availability_range',
    columnNames: ['userId', 'startDate', 'endDate'],
  });

  private readonly userAvailabilityUserForeignKey = new TableForeignKey({
    name: 'FK_user_availability_user',
    columnNames: ['userId'],
    referencedTableName: 'user',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  });

  private readonly userAvailabilityTaskForeignKey = new TableForeignKey({
    name: 'FK_user_availability_task',
    columnNames: ['taskId'],
    referencedTableName: 'task',
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_availability',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'taskId',
            type: 'int',
            isNullable: false,
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
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndices('user_availability', [
      this.userAvailabilityTaskUnique,
      this.userAvailabilityUserRangeIndex,
    ]);

    await queryRunner.createForeignKeys('user_availability', [
      this.userAvailabilityUserForeignKey,
      this.userAvailabilityTaskForeignKey,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKeys('user_availability', [
      this.userAvailabilityTaskForeignKey,
      this.userAvailabilityUserForeignKey,
    ]);

    await queryRunner.dropIndices('user_availability', [
      this.userAvailabilityUserRangeIndex,
      this.userAvailabilityTaskUnique,
    ]);

    await queryRunner.dropTable('user_availability');
  }
}
