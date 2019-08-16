import {MigrationInterface, QueryRunner} from "typeorm";

export class LectureMigration1565920294035 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE "users" 
        ("id" INT NOT NULL AUTO_INCREMENT, "title" VARCHAR(45), "date" date, "rg" INT, "speaker" VARCHAR(45), "description" VARCHAR(45)'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
