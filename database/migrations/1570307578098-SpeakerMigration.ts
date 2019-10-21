import {MigrationInterface, QueryRunner, TableIndex, Table} from "typeorm";

export class SpeakerMigration1570307578098 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "speaker",
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
                    name: "email",
                    type: "varchar",
                },
                {
                    name: "phone",
                    type: "varchar",
                },
                {
                    name: "secondPhone",
                    type: "varchar"
                },
                {
                    name: "curriculum",
                    type: "varchar"
                }
            ]
        }), true)

        const SpeakerIndex = new TableIndex({
            columnNames: ["email"],
            name: "SpeakerIndex",
            isUnique: true
        });

        await queryRunner.createIndex("speaker", SpeakerIndex);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
