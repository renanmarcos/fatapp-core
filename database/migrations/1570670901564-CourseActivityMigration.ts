import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CourseActivityMigration1570670901564 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "course_activity",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "courseId",
                    type: "int",
                },
                {
                    name: "activityId",
                    type: "int",
                }
            ]
        }), true)

        const fkCourse = new TableForeignKey({
            columnNames: ["courseId"],
            referencedColumnNames: ["id"],
            referencedTableName: "course",
            onDelete: "CASCADE"
        });
        const fkActivity = new TableForeignKey({
            columnNames: ["activityId"],
            referencedColumnNames: ["id"],
            referencedTableName: "activity",
            onDelete: "CASCADE"
        });


        await queryRunner.createForeignKey("course_activity", fkCourse);
        await queryRunner.createForeignKey("course_activity", fkActivity);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
