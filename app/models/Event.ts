import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Activity } from "./Activity";
import { Certificate } from './Certificate';

@Entity()
export class Event extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    edition: string;

    @Column()
    description: string;

    @Column()
    initialDate: Date;

    @Column()
    finalDate: Date;

    @Column()
    banner: string;

    @OneToMany(type => Activity, activity => activity.event)
    activity!: Activity[];

    @OneToOne(type => Certificate)
    @JoinColumn()
    certificate: Certificate;

}