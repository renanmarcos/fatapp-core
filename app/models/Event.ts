import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { Activity } from "./Activity";

@Entity()
export class Event extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    edition: string;

    @Column()
    initialDate: Date;

    @Column()
    finalDate: Date;

    @Column()
    banner: string;

    @OneToMany(type => Activity, activity => activity.event)
    activity!: Activity[];

}