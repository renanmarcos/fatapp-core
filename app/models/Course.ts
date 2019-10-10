import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany} from "typeorm";
import { Activity } from "../models/Activity";

@Entity()
export class Course extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => Activity, activity => activity.course)
    activity: Activity[];

}
