//database columns for Venue
import {Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne} from "typeorm";
import { User } from "./User";
import { Application } from "./Application";
import {PreviousHire} from "./PreviousHire";
import {UnavailableSlot} from "./UnavailableSlot";
import { VenueKeyword } from "./VenueKeyword"; 
import { Preference } from "./Preference";

@Entity()
export class Venue {
    @PrimaryGeneratedColumn()
    id! : number ;

    @Column()
    name! : string;
    
    @Column("text")
    location! :string

    @Column()
    capacity! : number; 

    @Column("text")
    image! : string; 

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number;

    @Column()
    isActive! : boolean; 

    @Column()
    isFeatured! : boolean;

    //relationship
    //FK Vendor 
    @ManyToOne( () => User, (user) => user.venues, {nullable: false})
    vendor! : User;

    @OneToMany( () => Application, (app) => app.venue)
    applications! : Application[];

    @OneToMany( () => PreviousHire, (hire) => hire.venue)
    previousHires! : PreviousHire[];

    @OneToMany(() => UnavailableSlot, (slot) => slot.venue)
    unavailableSlots! : UnavailableSlot[];

    @OneToMany(() => VenueKeyword, (vk) => vk.venue)
    venueKeywords! : VenueKeyword[];

    @OneToMany(() => Preference, (preference) => preference.venue) preferences!: Preference[];

}