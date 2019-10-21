import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, JoinTable, Unique, Index} from "typeorm";
import { Room } from "./Room";
import { Resource } from "./Resource";

@Entity()
@Index(["room", "resource"], {unique: true})
export class RoomResource extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount!: number;

    @ManyToOne(type => Room, room => room.roomResources)
    @JoinColumn({name: 'roomId', referencedColumnName: 'id'})
    room!: Room;

    @ManyToOne(type => Resource, resource => resource.roomResources)
    @JoinColumn({name: 'resourceId', referencedColumnName: 'id'})
    resource!: Resource;
}
