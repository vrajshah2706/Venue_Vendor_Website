import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Venue } from "./entity/Venue";
import { Application } from "./entity/Application";
import { PreviousHire } from "./entity/PreviousHire";
import { UnavailableSlot } from "./entity/UnavailableSlot";
import { HirerDocument } from "./entity/HirerDocument";
import { Keyword } from "./entity/Keyword";
import { VenueKeyword } from "./entity/VenueKeyword";
import { Preference } from "./entity/Preference";


//using Vraj's database connection 
export const AppDataSource = new DataSource({
  type: "mssql",
  host: "dipto-database.cn2ems8y2mfe.ap-southeast-2.rds.amazonaws.com",
  username: "s4176645",
  password: "Vrajshah123",
  database: "s4176645",
      options: {
        encrypt: false, // Use this for Azure SQL Database
       
        // trustedConnection: false // Use this for Windows Authentication (if applicable)
    },
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true,
  logging: true,
  entities: [
    User,
    Venue,
    Application,
    PreviousHire,
    UnavailableSlot,
    HirerDocument,
    Keyword,
    VenueKeyword,
    Preference
  ],
  migrations: [],
  subscribers: [],
});
