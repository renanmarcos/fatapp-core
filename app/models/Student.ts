import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { ActivityStudent } from "./ActivityStudent";

@Entity()
export class Student extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ra: number;

    @Column()
    course: string;

    @OneToMany(type => ActivityStudent, activityStudent => activityStudent.student)
    activityStudents!: ActivityStudent[];
}