import {MigrationInterface, QueryRunner} from "typeorm";

export class StudentMigration1565920541679 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE "users" 
        ("id" INT NOT NULL AUTO_INCREMENT, "ra" INT, "date" date, "curso" VARCHAR(45)'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
