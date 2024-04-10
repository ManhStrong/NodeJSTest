import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTableGroupAndUserGroup1712672007136 implements MigrationInterface {
    name = 'CreateTableGroupAndUserGroup1712672007136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user-groups\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`group_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`groups\` (\`id\` int NOT NULL AUTO_INCREMENT, \`group_name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user-groups\` ADD CONSTRAINT \`FK_5a551586a2b33ad8a5ea1fa513d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user-groups\` ADD CONSTRAINT \`FK_f23d274a88d7506f2f76810085b\` FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user-groups\` DROP FOREIGN KEY \`FK_f23d274a88d7506f2f76810085b\``);
        await queryRunner.query(`ALTER TABLE \`user-groups\` DROP FOREIGN KEY \`FK_5a551586a2b33ad8a5ea1fa513d\``);
        await queryRunner.query(`DROP TABLE \`groups\``);
        await queryRunner.query(`DROP TABLE \`user-groups\``);
    }

}
