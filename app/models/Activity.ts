import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinColumn, ManyToOne, OneToMany, JoinTable} from "typeorm";
import { Room } from "./Room";

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

    @Column()
    speakerName: string

    @Column()
    speakerEmail: string

    @Column()
    speakerPhone: string

    @Column()
    speakerCurriculum: string

    @ManyToOne(type => Room, room => room.activity)
    @JoinColumn({name: 'roomId', referencedColumnName: 'id'})
    room!: Room;

}