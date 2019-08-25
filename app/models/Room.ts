import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany} from "typeorm";
import { Resource } from "./Resource";

@Entity()
export class Room extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => Resource, resource => resource.rooms)
    resources: Resource[];

}
