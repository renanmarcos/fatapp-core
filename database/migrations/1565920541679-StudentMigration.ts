import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class StudentMigration1565920541679 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "student",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "ra",
                    type: "varchar",
                },
                {
                    name: "courseId",
                    type: "int",
                },
                {
                    name: "userId",
                    type: "int"
                }
            ]
        }), true);

        const fkUser = new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
            onDelete: "CASCADE"
        });

        const fkCourse = new TableForeignKey({
            columnNames: ["courseId"],
            referencedColumnNames: ["id"],
            referencedTableName: "course"
        });

        await queryRunner.createForeignKey("student", fkUser);
        await queryRunner.createForeignKey("student", fkCourse);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
