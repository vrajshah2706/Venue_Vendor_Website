//database columns for user 

import {Entity, PrimaryGeneratedColumn, Column, OneToMany,OneToOne, CreateDateColumn} from "typeorm";
import {Venue} from "./Venue";
import { Application } from "./Application";
import {PreviousHire} from "./PreviousHire";
import {HirerDocument} from "./HirerDocument"
import { Preference } from "./Preference";

//for user role 
export enum UserRole {
    HIRER = "hirer",
    VENDOR = "vendor",
    ADMIN = "admin",
}
@Entity() //declaring user class as an entity 
export class User {
    @PrimaryGeneratedColumn() //PK 
    id! : number; 

    @Column()
    name! : string; 

    @Column({unique: true})
    email! : string; 

    @Column()
    password! : string;

    @Column({ type: "varchar", length: 20 })
    role!: UserRole;

    @Column({ type: "varchar", length: 20, nullable: true })
    phoneNumber!: string;

    @CreateDateColumn()
    createdAt! : Date;

    //relationships 
    @OneToMany( () => Venue, (venue) => venue.vendor)
    venues! : Venue[];

    @OneToMany( () => Application, (app) => app.hirer)
    applications! : Application[];

    @OneToMany( () => PreviousHire, (hire) => hire.hirer)
    previousHires! : PreviousHire[]; 

    @OneToOne(() => HirerDocument, (doc) => doc.hirer)
    documents!: HirerDocument;

    @OneToMany(() => Preference, (preference) => preference.hirer) preferences!: Preference[];


}


