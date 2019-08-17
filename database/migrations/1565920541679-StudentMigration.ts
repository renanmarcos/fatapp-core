import {MigrationInterface, QueryRunner} from "typeorm";

export class StudentMigration1565920541679 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "students",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: "ra",
                    type: "int",
                },
                {
                    name: "date",
                    type: "date",
                },
                {
                    name: "course",
                    type: "varchar",
                }
            ]
        }), true)  
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
