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
                    type: "int",
                },
                {
                    name: "course",
                    type: "varchar",
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

        await queryRunner.createForeignKey("room_resource", fkUser);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
