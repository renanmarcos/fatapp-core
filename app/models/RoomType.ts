import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Room } from "./Room";

@Entity()
export class RoomType extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Room, room => room.roomType)
    rooms: Room[];
}
