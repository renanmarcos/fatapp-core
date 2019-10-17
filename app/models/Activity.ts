import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm";
import { Subscription } from "./Subscription";

@Entity()
export class Activity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: "timestamp" })
    start_at: Date;

    @Column()
    speaker: string;

    @Column()
    description: string;

    @OneToMany(type => Subscription, subscription => subscription.activity)
    subscriptions!: Subscription[];
}