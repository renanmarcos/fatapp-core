import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, JoinTable, Unique, Index} from "typeorm";
import { Activity } from "./Activity";
import { Student } from "./Student";

@Entity()
@Index(["activity", "student"], {unique: true})
export class Subscription extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    attended!: boolean;

    @ManyToOne(type => Activity, activity => activity.subscriptions)
    @JoinColumn({name: 'activity_id', referencedColumnName: 'id'})
    activity!: Activity;

    @ManyToOne(type => Student, student => student.subscriptions)
    @JoinColumn({name: 'student_id', referencedColumnName: 'id'})
    student!: Student;
}
