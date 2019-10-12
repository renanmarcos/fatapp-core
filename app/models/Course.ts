import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { Activity } from "../models/Activity";

@Entity()
export class Course extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => Activity)
    @JoinTable({ name: "course_activity" })
    activities!: Activity[];

}
