import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn
} from "typeorm";

import { User } from "./User";
import { Venue } from "./Venue";

@Entity()
export class Application {

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

    @CreateDateColumn()
    createdAt!: Date;
}