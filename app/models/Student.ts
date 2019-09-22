import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { Subscription } from "./Subscription";

@Entity()
export class Student extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ra: number;

    @Column()
    course: string;

    @OneToMany(type => Subscription, subscription => subscription.student)
    subscriptions!: Subscription[];
}