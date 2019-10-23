import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity} from "typeorm";
import { Activity } from "./Activity";

@Entity()
export class Speaker extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    phone: string

    @Column()
    secondPhone: string

    @Column()
    curriculum: string

    @Column()
    profilePicture!: string

    @OneToMany(type => Activity, activity => activity.room)
    activity!: Activity[];

}
