//mock data - giving ui some data  . 
import "reflect-metadata";
import { AppDataSource } from "../data-source"; 
import { User, UserRole } from "../entity/User";
import { Venue } from "../entity/Venue";
import { Application, ApplicationStatus } from "../entity/Application";
import { Keyword } from "../entity/Keyword";
import { VenueKeyword } from "../entity/VenueKeyword";
import { PreviousHire } from "../entity/PreviousHire";

async function mockData() {
    //connecting to database
    await AppDataSource.initialize()
    
    //deleting everything and resetting to get the same mock data 
    await AppDataSource.dropDatabase();
    await AppDataSource.synchronize();

    
    //getting repositories into varaibles for CRUD operartions
    const userRepo = AppDataSource.getRepository(User);
    const venueRepo = AppDataSource.getRepository(Venue);
    const appRepo = AppDataSource.getRepository(Application); 
    const keywordRepo = AppDataSource.getRepository(Keyword);
    const venueKeywordRepo = AppDataSource.getRepository(VenueKeyword);
    const prevHireRepo = AppDataSource.getRepository(PreviousHire); 

    //note unavailable slots and hirerdocuments will be added through UI rather than hard coding into database

    //users  - making user objects 
    //hirer1
    const hirer1 = userRepo.create({
        name: "John",
        email: "john@gmail.com",
        password: "Johnpass123.",
        role: UserRole.HIRER,
    }); 
    //hirer2 
    const hirer2 = userRepo.create({
        name: "Smith",
        email: "smith@gmail.com",
        password: "Smithpass123.",
        role: UserRole.HIRER,
    }); 
    //vendor1 
    const vendor1 = userRepo.create({
        name: "Vendor One",
        email: "vendorone@gmail.com",
        password: "Vendorone123.",
        role: UserRole.VENDOR,
    }); 
    //vendor2
    const vendor2 = userRepo.create({
        name: "Vendor Two",
        email: "vendortwo@gmail.com",
        password: "VendorTwo123.",
        role: UserRole.VENDOR,
    });     
    //admin 1 
    const admin = userRepo.create({
        name: "admin",
        email: "admin",
        password: "admin",
        role: UserRole.ADMIN,
    }); 

    //saving the above objects into database
    await userRepo.save([hirer1, hirer2, vendor1, vendor2, admin]); 

    //venues 
    const venues = [
        venueRepo.create({
        name: "Grand Hall",
        location: "Melbourne CBD",
        capacity: 200,
        image: "/images/GrandHall.png",
        price: 1500,
        isActive: true,
        isFeatured: false,
        vendor: vendor1,
        }),
        venueRepo.create({
        name: "Beach",
        location: "St Kilda",
        capacity: 100,
        image: "/images/Beach.png",
        price: 500,
        isActive: true,
        isFeatured: false,
        vendor: vendor1,
        }),
        venueRepo.create({
        name: "Conference Center",
        location: "Docklands",
        capacity: 300,
        image: "/images/ConferenceCenter.png",
        price: 2000,
        isActive: true,
        isFeatured: false,
        vendor: vendor1,
        }),
        venueRepo.create({
        name: "Wedding Garden",
        location: "Yarra Valley",
        capacity: 150,
        image: "/images/Wedding.png",
        price: 1800,
        isActive: true,
        isFeatured: false,
        vendor: vendor2,
        }),
        venueRepo.create({
        name: "Music Arena",
        location: "Richmond",
        capacity: 500,
        image: "/images/MusicArena.png",
        price: 2500,
        isActive: true,
        isFeatured: false,
        vendor: vendor2,
        }),
        venueRepo.create({
        name: "Rooftop Bar",
        location: "Melbourne CBD",
        capacity: 50,
        image: "/images/RoofTopBar.png",
        price: 600,
        isActive: true,
        isFeatured: false,
        vendor: vendor2,
        }),
  ];
  //saving to database
  await venueRepo.save(venues); 
  //keywords
  const keywords = ["Wedding", "Concert", "Birthday", "Conference", "Dinner", "Bar"];

  const keywordEntities = []; 
  //converting strings into objects 
  for (const name of keywords) {
    const k = keywordRepo.create({name});
    keywordEntities.push(k);
  }
  //saving into database 
  await keywordRepo.save(keywordEntities);
  
  //venue keywords 
  //linking venue to a keyword
  const venueKeywords = [
    { venue: venues[0], keyword: keywordEntities[3] }, // conference
    { venue: venues[0], keyword: keywordEntities[0] }, // wedding

    { venue: venues[1], keyword: keywordEntities[2] }, // birthday
    { venue: venues[2], keyword: keywordEntities[3] }, // conference
    { venue: venues[3], keyword: keywordEntities[0] }, // wedding
    { venue: venues[4], keyword: keywordEntities[1] }, // concert
    { venue: venues[5], keyword: keywordEntities[5] } // bar
  ].map(vk => venueKeywordRepo.create(vk));

  //saving into database
  await venueKeywordRepo.save(venueKeywords); 

  //Applications
  const applications = [
    appRepo.create({
      hirer: hirer1,
      venue: venues[0],
      numberOfGuests: 100,
      startDateTime: new Date("2026-05-01T18:00:00"),
      duration: 240,
      status: ApplicationStatus.PENDING,
    }),
    appRepo.create({
      hirer: hirer1,
      venue: venues[3],
      numberOfGuests: 80,
      startDateTime: new Date("2026-05-03T20:00:00"),
      duration: 180,
      status: ApplicationStatus.PENDING,
    }),
    appRepo.create({
      hirer: hirer2,
      venue: venues[1],
      numberOfGuests: 50,
      startDateTime: new Date("2026-05-05T18:00:00"),
      duration: 120,
      status: ApplicationStatus.PENDING,
    }),
    appRepo.create({
      hirer: hirer2,
      venue: venues[4],
      numberOfGuests: 200,
      startDateTime: new Date("2026-05-06T20:00:00"),
      duration: 300,
      status: ApplicationStatus.PENDING,
    }),
    appRepo.create({
        hirer: hirer1,
        venue: venues[0],
        numberOfGuests: 60,
        startDateTime: new Date("2026-05-07T19:00:00"),
        duration: 120,
        status: ApplicationStatus.PENDING,
    }),

    appRepo.create({
        hirer: hirer2,
        venue: venues[3],
        numberOfGuests: 90,
        startDateTime: new Date("2026-05-08T21:00:00"),
        duration: 240,
        status: ApplicationStatus.PENDING,
    }),
  ];

  //saving into databse
  await appRepo.save(applications); 

  //previous hire 
  const prevHires = [

        //hirer1 - 5 records
    prevHireRepo.create({
        hirer: hirer1,
        venue: venues[0], 
        eventName: "Corporate Meeting",
        date: new Date("2026-03-05"),
        rating: 4,
    }),
    prevHireRepo.create({
        hirer: hirer1,
        venue: venues[0], 
        eventName: "Tech Meetup",
        date: new Date("2026-04-12"),
        rating: 5,
    }),
    prevHireRepo.create({
        hirer: hirer1,
        venue: venues[3], 
        eventName: "Wedding Reception",
        date: new Date("2026-05-20"),
        rating: 2,
    }),
    prevHireRepo.create({
        hirer: hirer1,
        venue: venues[0], 
        eventName: "Networking Event",
        date: new Date("2026-06-10"),
        rating: 3,
    }),
    prevHireRepo.create({
        hirer: hirer1,
        venue: venues[2],
        eventName: "Conference",
        date: new Date("2026-07-02"),
        rating: 3,
    }),

    //hirer 2 - 5 records 
    prevHireRepo.create({
        hirer: hirer2,
        venue: venues[4], 
        eventName: "Music Concert",
        date: new Date("2026-03-18"),
        rating: 2,
    }),
    prevHireRepo.create({
        hirer: hirer2,
        venue: venues[4], 
        eventName: "Live Show",
        date: new Date("2026-02-25"),
        rating: 3,
    }),
    prevHireRepo.create({
        hirer: hirer2,
        venue: venues[0], 
        eventName: "Business Seminar",
        date: new Date("2026-01-30"),
        rating: 4,
    }),
    prevHireRepo.create({
        hirer: hirer2,
        venue: venues[3], 
        eventName: "Wedding",
        date: new Date("2026-06-15"),
        rating: 5,
    }),
    prevHireRepo.create({
        hirer: hirer2,
        venue: venues[5], 
        eventName: "Evening Drinks",
        date: new Date("2026-07-10"),
        rating: 4,
    }),
    ];


    await prevHireRepo.save(prevHires);

    //closing connection 
    await AppDataSource.destroy();
}

mockData()
  .then(() => {
    console.log("Seeding complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
