import {MigrationInterface, QueryRunner, TableForeignKey, Table} from "typeorm";

export class ActivityMigration1570307626507 implements MigrationInterface {

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
                    name: "title",
                    type: "varchar"
                },
                {
                    name: "type",
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
                },
                {
                    name: "eventId",
                    type: "int"
                },
                {
                    name: "speakerId",
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
        const fkEvent = new TableForeignKey({
            columnNames: ["eventId"],
            referencedColumnNames: ["id"],
            referencedTableName: "event",
            onDelete: "CASCADE"
        });
        const fkSpeaker = new TableForeignKey({
            columnNames: ["speakerId"],
            referencedColumnNames: ["id"],
            referencedTableName: "speaker",
            onDelete: "CASCADE"
        });

        await queryRunner.createForeignKey("activity", fkRoom);
        await queryRunner.createForeignKey("activity", fkEvent);
        await queryRunner.createForeignKey("activity", fkSpeaker);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
