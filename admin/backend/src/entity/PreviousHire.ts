import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column
} from "typeorm";

import { User } from "./User";
import { Venue } from "./Venue";

@Entity()
export class PreviousHire {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(
        () => User
    )
    hirer!: User;

    @ManyToOne(
        () => Venue
    )
    venue!: Venue;

    @Column()
    eventName!: string;

    @Column()
    rating!: number;

    @Column()
    date!: Date;
}