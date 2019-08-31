import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne} from "typeorm";
import { Room } from "./Room";
import { Resource } from "./Resource";

@Entity()
export class RoomResource extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roomId: number;

    @ManyToOne(type => Room, room => room.roomResources, { primary: true })
    room: Room[];

    @Column()
    resourceId: number;

    @ManyToOne(type => Resource, resource => resource.roomResources, { primary: true })
    resource: Resource[];

    @Column()
    resourceAmmount: number;

}
