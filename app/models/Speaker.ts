import {Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity} from "typeorm";
import { Activity } from "./Activity";

@Entity()
export class Speaker extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    speakerName: string

    @Column()
    speakerEmail: string

    @Column()
    speakerPhone: string

    @Column()
    speakerPhone2: string

    @Column()
    speakerCurriculum: string

    @OneToMany(type => Activity, activity => activity.room)
    activity!: Activity[];

}
