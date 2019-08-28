import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne} from "typeorm";
import { Resource } from "./Resource";
import { RoomType } from "./RoomType";

@Entity()
export class Room extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    capacity: number;

    @Column()
    type: number;

    @ManyToMany(type => Resource, resource => resource.rooms)
    resources: Resource[];

    @ManyToOne(type => RoomType, roomType => roomType.rooms)
    roomType: RoomType;

}
