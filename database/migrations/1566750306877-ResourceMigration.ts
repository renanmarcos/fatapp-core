import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class ResourceMigration1566750306877 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "resource",
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
