import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";

export class SubscriptionsMigration1570708032103 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.createTable(new Table({
            name: "rating",
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
                    name: "numberOfStars",
                    type: "int"
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

        const RatingIndex = new TableIndex({
            columnNames: ["activityId", "userId"],
            name: "RatingIndex",
            isUnique: true
        });

        await queryRunner.createForeignKey("rating", fkActivity);
        await queryRunner.createForeignKey("rating", fkStudent);
        await queryRunner.createIndex("rating", RatingIndex);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
