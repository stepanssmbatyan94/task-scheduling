import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class CreateUser1715028537217 implements MigrationInterface {
  name = 'CreateUser1715028537217';

  private readonly userSocialIdIndex = new TableIndex({
    name: 'IDX_user_social_id',
    columnNames: ['socialId'],
  });

  private readonly userFullNameIndex = new TableIndex({
    name: 'IDX_user_full_name',
    columnNames: ['firstName', 'lastName'],
  });

  private readonly sessionUserIndex = new TableIndex({
    name: 'IDX_session_user_id',
    columnNames: ['userId'],
  });

  private readonly userPhotoForeignKey = new TableForeignKey({
    name: 'FK_user_photo',
    columnNames: ['photoId'],
    referencedTableName: 'file',
    referencedColumnNames: ['id'],
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  private readonly userRoleForeignKey = new TableForeignKey({
    name: 'FK_user_role',
    columnNames: ['roleId'],
    referencedTableName: 'role',
    referencedColumnNames: ['id'],
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  private readonly userStatusForeignKey = new TableForeignKey({
    name: 'FK_user_status',
    columnNames: ['statusId'],
    referencedTableName: 'status',
    referencedColumnNames: ['id'],
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  private readonly sessionUserForeignKey = new TableForeignKey({
    name: 'FK_session_user',
    columnNames: ['userId'],
    referencedTableName: 'user',
    referencedColumnNames: ['id'],
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'role',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'status',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'file',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'path',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'provider',
            type: 'varchar',
            isNullable: false,
            default: `'email'`,
          },
          {
            name: 'socialId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'lastName',
            type: 'varchar',
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
          {
            name: 'photoId',
            type: 'char',
            length: '36',
            isNullable: true,
          },
          {
            name: 'roleId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'statusId',
            type: 'int',
            isNullable: true,
          },
        ],
        uniques: [
          new TableUnique({
            name: 'UQ_user_email',
            columnNames: ['email'],
          }),
          new TableUnique({
            name: 'UQ_user_photo',
            columnNames: ['photoId'],
          }),
        ],
      }),
      true,
    );

    await queryRunner.createIndices('user', [
      this.userSocialIdIndex,
      this.userFullNameIndex,
    ]);

    await queryRunner.createTable(
      new Table({
        name: 'session',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'hash',
            type: 'varchar',
            isNullable: false,
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
          {
            name: 'userId',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex('session', this.sessionUserIndex);

    await queryRunner.createForeignKeys('user', [
      this.userPhotoForeignKey,
      this.userRoleForeignKey,
      this.userStatusForeignKey,
    ]);
    await queryRunner.createForeignKey('session', this.sessionUserForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('session', this.sessionUserForeignKey);
    await queryRunner.dropForeignKeys('user', [
      this.userStatusForeignKey,
      this.userRoleForeignKey,
      this.userPhotoForeignKey,
    ]);

    await queryRunner.dropIndex('session', this.sessionUserIndex);
    await queryRunner.dropIndices('user', [
      this.userFullNameIndex,
      this.userSocialIdIndex,
    ]);

    await queryRunner.dropTable('session');
    await queryRunner.dropTable('user');
    await queryRunner.dropTable('file');
    await queryRunner.dropTable('status');
    await queryRunner.dropTable('role');
  }
}
