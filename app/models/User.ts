import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, getManager, OneToMany, OneToOne} from "typeorm";
import * as bcrypt from "bcryptjs";
import { Subscription } from './Subscription';
import { Student } from "./Student";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    cpf: string;

    @Column()
    password: string;

    @OneToMany(type => Subscription, subscription => subscription.user)
    subscriptions!: Subscription[];

    @OneToOne(type => Student, student => student.user)
    student: Student;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }
    
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
