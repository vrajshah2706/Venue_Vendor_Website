//database columns for previousHire
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import {User} from "./User"
import {Venue} from "./Venue"

@Entity()
export class PreviousHire {
    @PrimaryGeneratedColumn()
    id! : number; 

    @Column()
    eventName! : string 

    @Column("date")
    date!: Date

    @Column({ type: "int" })
    rating!: number;

    //relationships
    @ManyToOne( ()=> User, (user) => user.previousHires, {nullable: false})
    hirer! : User; 

    @ManyToOne( () => Venue, (venue) => venue.previousHires, {nullable: false})
    venue! : Venue; 

}