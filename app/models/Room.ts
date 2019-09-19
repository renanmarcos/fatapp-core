import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, JoinTable} from "typeorm";
import { RoomResource } from "./RoomResource";

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
    
    @OneToMany(type => RoomResource, roomResource => roomResource.room)
    roomResources!: RoomResource[];

}
