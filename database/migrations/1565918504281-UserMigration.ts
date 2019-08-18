import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class UserMigration1565918504281 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "user",
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
                },
                {
                    name: "email",
                    type: "varchar",
                },
                {
                    name: "cpf",
                    type: "int",
                }
            ]
        }), true)  
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
