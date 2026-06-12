import {Request, Response} from "express"; 
import {AppDataSource} from "../data-source";
import { Venue } from "../entity/Venue";
import { User } from "../entity/User";
import { UnavailableSlot } from "../entity/UnavailableSlot";
import { PreviousHire } from "../entity/PreviousHire";
import { Application } from "../entity/Application";
import { VenueKeyword } from "../entity/VenueKeyword";
import { Keyword } from "../entity/Keyword";


//repostiory for database operations
const venueRepo = AppDataSource.getRepository(Venue);
const userRepo = AppDataSource.getRepository(User);
const slotRepo = AppDataSource.getRepository(UnavailableSlot);
const applicationRepo = AppDataSource.getRepository(Application); 
const previousHireRepo = AppDataSource.getRepository(PreviousHire);
const venueKeywordRepo = AppDataSource.getRepository(VenueKeyword); 

//Get all venues for a vendor 
export const getVendorVenues = async (req: Request, res:Response) => {
    
    try{
        //getting vendor id from URL
        const vendorID = Number(req.params.vendorID)

        //finding venues belonging to vendor
        const venues = await venueRepo.find(
            {
                where: {
                    vendor: {
                        id: vendorID,
                    },
                },

                //also include unavailabe slots
                relations: ["unavailableSlots", "venueKeywords", "venueKeywords.keyword"],
        });

        return res.json(venues);

    } catch (error) {
        console.log(error); 

        return res.status(500).json({
            message: "Failed to fetch venues", 
        })
    }
}

export const getAllVenues = async (req: Request, res: Response) => {
  
  try {
    const venues = await venueRepo.find({
        relations: [
        "vendor",
        "venueKeywords",
        "venueKeywords.keyword",
        ],
    });

    return res.json(venues);
    } catch(error) {
        console.log(error); 

        return res.status(500).json({
            message: "Failed to fetch venues", 
        })
    }
};
//create venue 
export const createVenue = async ( req: Request , res: Response) => {
    
    try{

        //geting form data
        const {
            vendorID, 
            name, 
            location, 
            capacity,
            price,
            keywordIDs,
        } = req.body; 
        
        const parsedKeywordIDs = typeof keywordIDs === "string"
            ? JSON.parse(keywordIDs)
            : keywordIDs;
        //finding vendor 
        const vendor = await userRepo.findOne({
            where: {id: vendorID} ,
        });

        //if vendor doesnt exist
        if (!vendor) {
            return res.status(404).json({
                message: "Vendor not found",
            });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }
        
        const imagePath = `/Images/${req.file.filename}`;

        //creating venue object
        const venue = venueRepo.create({
            name,
            location,
            capacity,
            price,
            image: imagePath,
            isActive: true,
            isFeatured: false,
            vendor,
        });

        

        //saving into database
        await venueRepo.save(venue);

        // create keyword relationships
        if (Array.isArray(parsedKeywordIDs) && parsedKeywordIDs.length > 0) {

            const keywordRepo = AppDataSource.getRepository(Keyword);

            const keywords = await keywordRepo.findByIds(parsedKeywordIDs);

            const newVenueKeywords = keywords.map((keyword) => {

                const venueKeyword = new VenueKeyword();

                venueKeyword.venue = venue;
                venueKeyword.keyword = keyword;

                return venueKeyword;
            });

            await venueKeywordRepo.save(newVenueKeywords);
        }
        //re-fetching venue with keywors
        const venueWithKeywords = await venueRepo.findOne({
            where: { id: venue.id },
            relations: ["venueKeywords", "venueKeywords.keyword"],
        });

        return res.status(201).json({
            message: "Venue created succesfully", venue: venueWithKeywords, 
        }); 
    } catch (error) {
        console.log(error); 

        return res.status(500).json({
            message: "Failed to create venue", 
        }); 
    }
}; 

//update venue 

export const updateVenue = async (req: Request, res: Response) => {

    try {

        const venueID = Number(req.params.id);

        const {
            name,
            location,
            capacity,
            price,
            keywordIDs,
        } = req.body;

        const venueRepo = AppDataSource.getRepository(Venue);
        const keywordRepo = AppDataSource.getRepository(Keyword);
        const venueKeywordRepo = AppDataSource.getRepository(VenueKeyword);

        // finding venue
        const venue = await venueRepo.findOne({
            where: {
                id: venueID,
            },
            relations: ["venueKeywords"],
        });

        if (!venue) {
            return res.status(404).json({
                message: "Venue not found",
            });
        }

        // updating venue details
        venue.name = name;
        venue.location = location;
        venue.capacity = capacity;
        venue.price = price;

        await venueRepo.save(venue);

        // deleting old keyword relationships
        await venueKeywordRepo.delete({
            venue: {
                id: venueID,
            },
        });

        // creating new keyword relationships
        if (Array.isArray(keywordIDs) && keywordIDs.length > 0) {

            const keywords = await keywordRepo.findByIds(keywordIDs);

            const newVenueKeywords = keywords.map((keyword) => {

                const venueKeyword = new VenueKeyword();

                venueKeyword.venue = venue;
                venueKeyword.keyword = keyword;

                return venueKeyword;
            });

            await venueKeywordRepo.save(newVenueKeywords);
        }

        return res.json({
            message: "Venue updated successfully",
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Failed to update venue",
        });
    }
};

//delete venue 
export const deleteVenue = async ( req: Request, res: Response) => {
    
    try{

        //getting venue id
        const venueID = Number(req.params.id); 

        //finding venue
        const venue = await venueRepo.findOne({
            where: {id: venueID},
        })

        //checking if venue exists
        if(!venue) {
            return res.status(404).json({
                message: "Venue not found",
            })
        }

        //removing from database
        await slotRepo.delete({ venue: { id: venueID } });
        await applicationRepo.delete({ venue: { id: venueID } });
        await previousHireRepo.delete({ venue: { id: venueID } });
        await venueKeywordRepo.delete({ venue: { id: venueID } });

        await venueRepo.delete(venueID);
        


        return res.json({
            message:"Venue deleted successfully",
        }); 
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to delete venue",
        })
    }
}

// getting all venues types/keywords 
export const getAllKeywords = async (req: Request, res: Response) => {
    try {

        const keywordRepo = AppDataSource.getRepository(Keyword);

        const keywords = await keywordRepo.find({
            order: {
                name: "ASC",
            },
        });

        return res.json(keywords);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Failed to fetch keywords",
        });
    }
};

//create application
export const createApplication = async (req: Request, res: Response) => {
  try {
    const {
      hirerID,
      venueID,
      numberOfGuests,
      startDateTime,
      duration,
      comment,
    } = req.body;

    const venue = await venueRepo.findOne({
      where: { id: venueID },
    });

    const hirer = await userRepo.findOne({
      where: { id: hirerID },
    });

    if (!venue || !hirer) {
      return res.status(404).json({
        message: "Venue or Hirer not found",
      });
    }

    const application = applicationRepo.create({
      venue,
      hirer,

      
      numberOfGuests,
      startDateTime: new Date(startDateTime),
      duration,
      comment: comment || null,
    });

    await applicationRepo.save(application);

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to submit application",
    });
  }
};

export const getHirerApplications = async (req: Request, res: Response) => {
  try {
    const hirerID = Number(req.params.hirerID);

    const applications = await applicationRepo.find({
      where: {
        hirer: { id: hirerID },
      },
      relations: ["venue", "venue.vendor", "hirer"],
      order: {
        startDateTime: "DESC",
      },
    });

    return res.json(applications);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};