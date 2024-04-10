import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFieldAvatarIntoUserTable1712720631155 implements MigrationInterface {
    name = 'AddFieldAvatarIntoUserTable1712720631155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatar\``);
    }

}
