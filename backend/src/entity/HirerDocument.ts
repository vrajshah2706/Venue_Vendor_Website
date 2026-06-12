//database columns for HirerDocuments 
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import {User} from "./User"

@Entity()
export class HirerDocument{
    @PrimaryGeneratedColumn()
    id!: number; 

    @Column("text", {nullable: true})
    driversLicense!: string | null;

    @Column("text", {nullable: true})
    insuranceCertificate!: string | null; 

    @Column( "text", {nullable: true})
    businessRegistration!: string | null;

    @Column({ default: false })
    isBusiness!: boolean;

    //relationshikps
    @OneToOne(() => User, (user) => user.documents, {
        nullable: false,
    })  
    @JoinColumn()
    hirer!: User; 
}