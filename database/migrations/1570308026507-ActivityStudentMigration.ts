import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";

export class SubscriptionsMigration1570308026507 implements MigrationInterface {

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
                    name: "activityId",
                    type: "int",
                },
                {
                    name: "userId",
                    type: "int",
                },
                {
                    name: "attended",
                    type: "bool"
                }
            ]
        }), true)

        const fkActivity = new TableForeignKey({
            columnNames: ["activityId"],
            referencedColumnNames: ["id"],
            referencedTableName: "activity",
            onDelete: "CASCADE"
        });
        const fkStudent = new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
            onDelete: "CASCADE"
        });

        const SubscriptionIndex = new TableIndex({
            columnNames: ["activityId", "userId"],
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
