import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";
import { TableUnique } from "typeorm/schema-builder/table/TableUnique";

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

        const fkRoom = new TableForeignKey({
            columnNames: ["roomId"],
            referencedColumnNames: ["id"],
            referencedTableName: "room",
            onDelete: "CASCADE"
        });
        const fkResource = new TableForeignKey({
            columnNames: ["resourceId"],
            referencedColumnNames: ["id"],
            referencedTableName: "resource",
            onDelete: "CASCADE"
        });

        const roomAndResourceIndex = new TableIndex({
            columnNames: ["roomId", "resourceId"],
            name: "RoomAndResourceIndex",
            isUnique: true
        });

        await queryRunner.createForeignKey("room_resource", fkRoom);
        await queryRunner.createForeignKey("room_resource", fkResource);
        await queryRunner.createIndex("room_resource", roomAndResourceIndex);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
