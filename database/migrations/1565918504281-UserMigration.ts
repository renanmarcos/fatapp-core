import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigration1565918504281 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE "users" ("id" INT NOT NULL AUTO_INCREMENT, "name" VARCHAR(45), "email" VARCHAR(45), "rg" INT)'
        );
 
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
