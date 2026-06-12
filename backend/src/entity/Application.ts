import { Entity, PrimaryGeneratedColumn, Column, ManyToOne , CreateDateColumn } from "typeorm";
import {User } from "./User";
import {Venue} from "./Venue"

//declaring enum for status
export enum ApplicationStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
}

@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    id! : number;

    @Column()
    numberOfGuests! : number;

    @Column("datetime")
    startDateTime! : Date; 

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ type: "varchar", length: 20, default: ApplicationStatus.PENDING, })
    status!: ApplicationStatus;
    
    @Column( "text", {nullable: true})
    comment! : string | null;

   
    @Column()
    duration! : number;  //in minutes

    //relationship
    @ManyToOne( ()=> User, (user) => user.applications, {nullable: false})
    hirer! : User; 

    @ManyToOne( () => Venue, (venue) => venue.applications, {nullable: false})
    venue! : Venue; 






}