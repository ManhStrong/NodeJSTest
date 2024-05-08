import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTable1712888925798 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create 'groups' table
        await queryRunner.createTable(new Table({
            name: 'groups',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'group_name', type: 'varchar' },
                { name: 'created_at', type: 'datetime', default: 'now()' },
                { name: 'updated_at', type: 'datetime', default: 'now()', },
                { name: 'deleted_at', type: 'datetime', isNullable: true }
            ]
        }), true);

        // Create 'user-groups' table
        await queryRunner.createTable(new Table({
            name: 'user-groups',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'user_id', type: 'int' },
                { name: 'group_id', type: 'int' },
                { name: 'created_at', type: 'datetime', default: 'now()' },
                { name: 'updated_at', type: 'datetime', default: 'now()', },
                { name: 'deleted_at', type: 'datetime', isNullable: true }
            ]
        }), true);

        // Create 'users' table
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'user_name', type: 'varchar' },
                { name: 'avatar', type: 'varchar', isNullable: true },
                { name: 'password', type: 'varchar' },
                { name: 'created_at', type: 'datetime', default: 'now()' },
                { name: 'updated_at', type: 'datetime', default: 'now()', },
                { name: 'deleted_at', type: 'datetime', isNullable: true }
            ]
        }), true);

        // Create 'user-permissions' table
        await queryRunner.createTable(new Table({
            name: 'user-permissions',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'user_id', type: 'int' },
                { name: 'permission_id', type: 'int' },
                { name: 'is_active', type: 'tinyint', isNullable: true },
                { name: 'created_at', type: 'datetime', default: 'now()' },
                { name: 'updated_at', type: 'datetime', default: 'now()', },
                { name: 'deleted_at', type: 'datetime', isNullable: true }
            ]
        }), true);

        // Create 'permissions' table
        await queryRunner.createTable(new Table({
            name: 'permissions',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'permission_name', type: 'varchar' },
                { name: 'created_at', type: 'datetime', default: 'now()' },
                { name: 'updated_at', type: 'datetime', default: 'now()', },
                { name: 'deleted_at', type: 'datetime', isNullable: true }
            ]
        }), true);

        // Create 'group-permissions' table
        await queryRunner.createTable(new Table({
            name: 'group-permissions',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'group_id', type: 'int' },
                { name: 'permission_id', type: 'int' },
                { name: 'is_active', type: 'tinyint', isNullable: true },
                { name: 'created_at', type: 'datetime', default: 'now()' },
                { name: 'updated_at', type: 'datetime', default: 'now()', },
                { name: 'deleted_at', type: 'datetime', isNullable: true }
            ]
        }), true);

        // Add foreign key constraints
        await queryRunner.createForeignKey('user-groups', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
            name: 'FK_5a551586a2b33ad8a5ea1fa513d'
        }));

        await queryRunner.createForeignKey('user-groups', new TableForeignKey({
            columnNames: ['group_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'groups',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
            name: 'FK_f23d274a88d7506f2f76810085b'
        }));

        await queryRunner.createForeignKey('user-permissions', new TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
            name: 'FK_dd4945ff7a60291eeddfc3fd74b'
        }));

        await queryRunner.createForeignKey('user-permissions', new TableForeignKey({
            columnNames: ['permission_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'permissions',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
            name: 'FK_f6a9e734de8612cbf834bdcf7a9'
        }));

        await queryRunner.createForeignKey('group-permissions', new TableForeignKey({
            columnNames: ['group_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'groups',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
            name: 'FK_e8fea665fe4ab6dec4b50ab5462'
        }));

        await queryRunner.createForeignKey('group-permissions', new TableForeignKey({
            columnNames: ['permission_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'permissions',
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
            name: 'FK_4a045e0731051a752b735ecd41e'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.dropForeignKey('group-permissions', 'FK_4a045e0731051a752b735ecd41e');
        await queryRunner.dropForeignKey('group-permissions', 'FK_e8fea665fe4ab6dec4b50ab5462');
        await queryRunner.dropForeignKey('user-permissions', 'FK_f6a9e734de8612cbf834bdcf7a9');
        await queryRunner.dropForeignKey('user-permissions', 'FK_dd4945ff7a60291eeddfc3fd74b');
        await queryRunner.dropForeignKey('user-groups', 'FK_f23d274a88d7506f2f76810085b');
        await queryRunner.dropForeignKey('user-groups', 'FK_5a551586a2b33ad8a5ea1fa513d');

        // Drop tables
        await queryRunner.dropTable('group-permissions');
        await queryRunner.dropTable('permissions');
        await queryRunner.dropTable('user-permissions');
        await queryRunner.dropTable('users');
        await queryRunner.dropTable('user-groups');
        await queryRunner.dropTable('groups');
    }

}
