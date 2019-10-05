import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class SpeakerMigration1570301435551 implements MigrationInterface {

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
                    name: "speakerName",
                    type: "varchar",
                },
                {
                    name: "speakerEmail",
                    type: "varchar",
                },
                {
                    name: "speakerPhone",
                    type: "varchar",
                },
                {
                    name: "speakerPhone2",
                    type: "varchar"
                },
                {
                    name: "speakerCurriculum",
                    type: "varchar"
                }
            ]
        }), true)

        const SpeakerIndex = new TableIndex({
            columnNames: ["speakerEmail"],
            name: "SpeakerIndex",
            isUnique: true
        });

        await queryRunner.createIndex("speaker", SpeakerIndex);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
