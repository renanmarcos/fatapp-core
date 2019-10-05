import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne} from "typeorm";
import { Room } from "./Room";
import { Event } from "./Event";
import { Speaker } from "./Speaker";

@Entity()
export class Activity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string

    @Column()
    type: string

    @Column()
    targetAudience: string

    @Column()
    description: string

    @Column()
    initialDate: Date

    @Column()
    finalDate: Date
    
    @Column()
    obsActivity: string

    @Column()
    obsResource: string

    @Column()
    isActive: boolean

    @Column()
    qrCode: string

    @ManyToOne(type => Room, room => room.activity)
    @JoinColumn({name: 'roomId', referencedColumnName: 'id'})
    room!: Room;

    @ManyToOne(type => Event, event => event.activity)
    @JoinColumn({name: 'eventId', referencedColumnName: 'id'})
    event!: Event;

    @ManyToOne(type => Speaker, speaker => speaker.activity)
    @JoinColumn({name: 'speakerId', referencedColumnName: 'id'})
    speaker!: Speaker;

}