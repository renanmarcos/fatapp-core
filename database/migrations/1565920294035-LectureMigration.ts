import {MigrationInterface, QueryRunner} from "typeorm";

export class LectureMigration1565920294035 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "lectures",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: "title",
                    type: "varchar",
                },
                {
                    name: "date",
                    type: "date",
                },
                {
                    name: "rg",
                    type: "int",
                },
                {
                    name: "speaker",
                    type: "varchar",
                }
                {
                    name: "description",
                    type: "varchar",
                }
            ]
        }), true)  
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
