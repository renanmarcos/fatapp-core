import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, JoinTable, Unique, Index} from "typeorm";
import { Activity } from "./Activity";
import { User } from "./User";

@Entity()
@Index(["activity", "user"], {unique: true})
export class Subscription extends BaseEntity
{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    attended!: boolean;

    @ManyToOne(type => Activity, activity => activity.subscriptions)
    @JoinColumn({name: 'activity_id', referencedColumnName: 'id'})
    activity!: Activity;

    @ManyToOne(type => User, user => user.subscriptions)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user!: User;
}
