import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany
} from "typeorm";
import { User } from "./User";
import { Application } from "./Application";
import { PreviousHire } from "./PreviousHire";

@Entity()
export class Venue {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column("text")
  location!: string;

  @Column()
  capacity!: number;

  @Column("text")
  image!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column()
  isActive!: boolean;

  @Column({ default: false })
  isFeatured!: boolean;

  @ManyToOne(() => User, (user) => user.venues, { nullable: false })
  vendor!: User;

  @OneToMany(() => Application, (app) => app.venue)
  applications!: Application[];

  @OneToMany(() => PreviousHire, (hire) => hire.venue)
  previousHires!: PreviousHire[];
}