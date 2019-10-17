import {MigrationInterface, QueryRunner, Table, JoinColumn, TableForeignKey} from "typeorm";

export class RoomMigration1566752447857 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.createTable(new Table({
            name: "room",
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
                    name: "type",
                    type: "varchar"
                },
                {
                    name: "capacity",
                    type: "int"
                }
            ]
        }), true)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
