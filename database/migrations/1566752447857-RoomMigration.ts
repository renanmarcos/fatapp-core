import {MigrationInterface, QueryRunner, Table, JoinColumn, TableForeignKey} from "typeorm";
import { Room } from '../../app/models/Room';

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
                    type: "varchar"
                },
                {
                    name: "capacity",
                    type: "int"
                }
            ]
        }), true);

        this.createRooms();
    }

    private async createRooms()
    {
        for (let i = 1; i <= 12; i++) {
            let room = new Room();
            room.capacity = 40;
            room.name = "Sala " + i;
            room.type = "Sala de aula";
        }

        for (let i = 1; i <= 3; i++) {
            let room = new Room();
            room.capacity = 40;
            room.name = "Laboratório " + i;
            room.type = "Laboratório de informática";
        }

        let room = new Room();
        room.capacity = 200;
        room.name = "Auditório";
        room.type = "Auditório";
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
