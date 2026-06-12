import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from "typeorm";

import { Venue } from "./Venue";
import { Application } from "./Application";
import { PreviousHire } from "./PreviousHire";

export enum UserRole {
    HIRER = "hirer",
    VENDOR = "vendor",
    ADMIN = "admin"
}

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column({
        type: "varchar"
    })
    role!: UserRole;

    // vendor owns many venues
    @OneToMany(
        () => Venue,
        venue => venue.vendor
    )
    venues!: Venue[];

    @OneToMany(
        () => Application,
        app => app.hirer
    )
    applications!: Application[];

    @OneToMany(
        () => PreviousHire,
        hire => hire.hirer
    )
    previousHires!: PreviousHire[];
}