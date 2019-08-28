import {MigrationInterface, QueryRunner, Table, JoinColumn, TableForeignKey} from "typeorm";

export class RoomMigration1566752447857 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.createTable(new Table({
            name: "room",
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
                    name: "type",
                    type: "int"
                }
            ]
        }), true)

        const fk_roomType = new TableForeignKey({
            columnNames: ["type"],
            referencedColumnNames: ["id"],
            referencedTableName: "room_type",
            onDelete: "CASCADE"
        });

        await queryRunner.createForeignKey("room", fk_roomType);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
