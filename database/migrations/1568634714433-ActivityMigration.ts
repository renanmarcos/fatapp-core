import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import { date } from "@hapi/joi";

export class ActivityMigration1568634714433 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "activity",
            columns: [
               {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "speakerEmail",
                    type: "varchar"
                },
                {
                    name: "speakerName",
                    type: "varchar"
                },
                {
                    name: "speakerPhone",
                    type: "varchar"
                },
                {
                    name: "speakerCurriculum",
                    type: "varchar"
                },
                {
                    name: "title",
                    type: "varchar"
                },
                {
                    name: "type",
                    type: "varchar"
                },
                {
                    name: "targetAudience",
                    type: "varchar"
                },
                {
                    name: "description",
                    type: "varchar"
                },
                {
                    name: "initialDate",
                    type: "datetime"
                },
                {
                    name: "finalDate",
                    type: "datetime"
                },
                {
                    name: "obsActivity",
                    type: "varchar"
                },
                {
                    name: "obsResource",
                    type: "varchar"
                },
                {
                    name: "isActive",
                    type: "boolean"
                },
                {
                    name: "qrCode",
                    type: "varchar"
                },
                {
                    name: "roomId",
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

        await queryRunner.createForeignKey("activity", fkRoom);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
