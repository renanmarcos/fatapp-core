import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, OneToMany} from "typeorm";
import { Room } from "./Room";
import { RoomResource } from "./RoomResource";

@Entity()
export class Resource extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @OneToMany(type => RoomResource, roomResource => roomResource.resource)
    roomResources: RoomResource[];

    @ManyToMany(type => Room, room => room.resources)
    @JoinTable({
        name: "room_resource", // table name for the junction table of this relation
        joinColumn: {
            name: "resourceId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "roomId",
            referencedColumnName: "id"
        }
    })
    
    rooms: Room[];

}
