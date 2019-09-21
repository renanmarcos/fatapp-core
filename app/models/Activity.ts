import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { ActivityStudent } from "./ActivityStudent";

@Entity()
export class Activity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    date: Date;

    @Column()
    speaker: string;

    @Column()
    description: string;

    @OneToMany(type => ActivityStudent, activityStudent => activityStudent.activity)
    activityStudents!: ActivityStudent[];
}