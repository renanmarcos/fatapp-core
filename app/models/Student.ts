import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn} from "typeorm";
import { Course } from './Course';
import { User } from './User';

@Entity()
export class Student extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ra: string;

    @OneToOne(type => Course)
    @JoinColumn()
    course: Course;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;
}