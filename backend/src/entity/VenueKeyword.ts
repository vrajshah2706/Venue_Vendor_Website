import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, JoinColumn, OneToMany } from "typeorm";
import { Venue } from "./Venue";
import { Keyword } from "./Keyword";


@Entity() 
@Unique(["venue", "keyword"]) //prevents duplicates 
export class VenueKeyword {
    @PrimaryGeneratedColumn()
    id! : number; 

    //relationships
    @OneToMany(() => VenueKeyword, (vk) => vk.venue)
        venueKeywords!: VenueKeyword[];

    @ManyToOne(() => Venue, (venue) => venue.venueKeywords, {
    nullable: false,
    onDelete: "CASCADE",
    })
    @JoinColumn()
    venue!: Venue;

    @ManyToOne(() => Keyword, {
        nullable: false,
        eager: false,
    })
    @JoinColumn()
    keyword!: Keyword;
}