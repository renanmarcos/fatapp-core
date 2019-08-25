import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class RoomResource extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roomId: number;

    @Column()
    resourceId: number;

}
