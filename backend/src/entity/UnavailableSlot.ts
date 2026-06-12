//database columns for unavailableSlot 
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import {Venue} from "./Venue"

@Entity()
export class UnavailableSlot {
    @PrimaryGeneratedColumn()
    id! : number;

    @Column("datetime")
    fromDateTime! : Date;

    @Column("datetime")
    toDateTime! : Date;
    
    @ManyToOne( () => Venue, (venue) => venue.unavailableSlots, {
        nullable: false,
    })
    venue! : Venue; 

}