import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";
import { TableUnique } from "typeorm/schema-builder/table/TableUnique";

export class ActivityStudentMigration1568943141052 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.createTable(new Table({
            name: "activity_student",
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
                    name: "registered",
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

        const ActivityAndStudentIndex = new TableIndex({
            columnNames: ["activity_id", "student_id"],
            name: "ActivityAndStudentIndex",
            isUnique: true
        });

        await queryRunner.createForeignKey("activity_student", fkActivity);
        await queryRunner.createForeignKey("activity_student", fkStudent);
        await queryRunner.createIndex("activity_student", ActivityAndStudentIndex);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
