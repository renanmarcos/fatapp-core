import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";
import { TableUnique } from "typeorm/schema-builder/table/TableUnique";

export class SubscriptionsMigration1568943141052 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.createTable(new Table({
            name: "subscription",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "activity_id",
                    type: "int",
                },
                {
                    name: "student_id",
                    type: "int",
                },
                {
                    name: "attended",
                    type: "bool"
                }
            ]
        }), true)

        const fkActivity = new TableForeignKey({
            columnNames: ["activity_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "activity",
            onDelete: "CASCADE"
        });
        const fkStudent = new TableForeignKey({
            columnNames: ["student_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "student",
            onDelete: "CASCADE"
        });

        const SubscriptionIndex = new TableIndex({
            columnNames: ["activity_id", "student_id"],
            name: "SubscriptionIndex",
            isUnique: true
        });

        await queryRunner.createForeignKey("subscription", fkActivity);
        await queryRunner.createForeignKey("subscription", fkStudent);
        await queryRunner.createIndex("subscription", SubscriptionIndex);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}