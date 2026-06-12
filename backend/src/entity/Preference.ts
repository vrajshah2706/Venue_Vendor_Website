import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Venue } from "./Venue";

@Entity("preference")
export class Preference {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.preferences)
    hirer!: User;

    @ManyToOne(() => Venue, (venue) => venue.preferences)
    venue!: Venue;

    @Column()
    rank!: number;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    addedAt!: Date;
}