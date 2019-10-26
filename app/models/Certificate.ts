import {Entity, BaseEntity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Certificate extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

}
