
// TODO: REVIEW THIS RELATIONSHIP

import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class RoomResourceMigration1566767323829 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.createTable(new Table({
            name: "room_resource",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "roomId",
                    type: "int",
                },
                {
                    name: "resourceId",
                    type: "int",
                },
                {
                    name: "resourceAmmount",
                    type: "int"
                }
            ]
        }), true)

        const fk_room = new TableForeignKey({
            columnNames: ["roomId"],
            referencedColumnNames: ["id"],
            referencedTableName: "room",
            onDelete: "CASCADE"
        });
        const fk_resource = new TableForeignKey({
            columnNames: ["resourceId"],
            referencedColumnNames: ["id"],
            referencedTableName: "resource",
            onDelete: "CASCADE"
        });
        await queryRunner.createForeignKey("room_resource", fk_room);
        await queryRunner.createForeignKey("room_resource", fk_resource);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
