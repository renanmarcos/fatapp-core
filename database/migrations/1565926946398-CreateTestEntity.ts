import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTestEntity1565926946398 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "test_entity",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: "firstName",
                    type: "varchar",
                },
                {
                    name: "lastName",
                    type: "varchar",
                },
                {
                    name: "isActive",
                    type: "boolean",
                }
            ]
        }), true)  
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('test_entity');
    }

}
