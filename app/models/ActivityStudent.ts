import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, JoinTable, Unique, Index} from "typeorm";
import { Activity } from "./Activity";
import { Student } from "./Student";

@Entity()
@Index(["activity", "student"], {unique: true})
export class ActivityStudent extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    registered!: boolean;

    @ManyToOne(type => Activity, activity => activity.activityStudents)
    @JoinColumn({name: 'activity_id', referencedColumnName: 'id'})
    activity!: Activity;

    @ManyToOne(type => Student, student => student.activityStudents)
    @JoinColumn({name: 'student_id', referencedColumnName: 'id'})
    student!: Student;
}
