import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CourseMigration1570669084371 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "course",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "name",
                    type: "varchar",
                }
            ]
        }), true)  
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
