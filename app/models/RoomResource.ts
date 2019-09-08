import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, JoinTable} from "typeorm";
import { Room } from "./Room";
import { Resource } from "./Resource";

@Entity()
export class RoomResource extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    resourceAmmount!: number;

    @ManyToOne(type => Room, room => room.roomResources)
    @JoinColumn({name: 'roomId', referencedColumnName: 'id'})
    room!: Room;

    @ManyToOne(type => Resource, resource => resource.roomResources)
    @JoinColumn({name: 'resourceId', referencedColumnName: 'id'})
    resource!: Resource;
}
