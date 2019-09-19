import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable, OneToMany} from "typeorm";
import { RoomResource } from "./RoomResource";

@Entity()
export class Resource extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @OneToMany(type => RoomResource, roomResource => roomResource.resource)
    roomResources!: RoomResource[];
}
