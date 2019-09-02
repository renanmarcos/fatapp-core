import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import { Resource } from "./Resource";
// import { RoomResource } from "./RoomResource";

@Entity()
export class Room extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    capacity: number;

    @Column()
    type: string;

    // @ManyToMany(type => Resource, resource => resource.rooms)
    // resources: Resource[];
    
    // TODO: REVIEW THIS RELATIONSHIP
    // @OneToMany(type => RoomResource, roomResource => roomResource.room)
    // roomResources: RoomResource[];

}
