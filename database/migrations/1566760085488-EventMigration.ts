import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class EventMigration1566760085488 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.createTable(new Table({
            name: "event",
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
