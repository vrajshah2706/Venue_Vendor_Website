import  { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Application, ApplicationStatus } from "../entity/Application";
import { Venue } from "../entity/Venue";
import { PreviousHire } from "../entity/PreviousHire";
import { UnavailableSlot } from "../entity/UnavailableSlot";
import { calculateCredibilityScore } from "./utils";
import { calculateReputationScore } from "./utils";
import { getVendorInsightsService } from "./utils";
import { In } from "typeorm";

//repository for database operations
const applicationRepo = AppDataSource.getRepository(Application);
const venueRepo = AppDataSource.getRepository(Venue);
const previousHireRepo = AppDataSource.getRepository(PreviousHire);
const unavailableSlotRepo = AppDataSource.getRepository(UnavailableSlot);  

export const getVendorApplications = async (req: Request, res:Response) => {

    try {
        //getting vendor id
        const vendorID = Number(req.params.vendorID); 
        
        //finding all venues owned by vendor 
        const vendorVenues = await venueRepo.find({
            where: {
                vendor: {
                    id: vendorID
                }
            }
        }); 

        //extracting venue ids
        const venueIDs = vendorVenues.map(v => v.id); 

        //getting applications for those venues 
        // const applications = await applicationRepo.find({
        //     where: venueIDs.map(id => ({
        //         venue: {id}
        //     })),

        //     relations: ["hirer", "venue"], 

        //     order: {createdAt: "DESC"}
        // });
        const applications = await applicationRepo.find({
            where: {
                venue: {
                    id: In(venueIDs)
                }
            },
            relations: ["hirer", "venue"],
            order: { createdAt: "DESC" }
        });
        
        if (venueIDs.length === 0) {
                return res.status(200).json([]);
        }
            const formattedApplications = await Promise.all(
            //for each application calculating repuationScore & credibilityScore
            applications.map(async (app) => {

                const reputationScore = await calculateReputationScore(app.hirer.id); 

                const credibilityScore = await calculateCredibilityScore(app.hirer.id); 

                return {
                    ...app,
                    hirer: app.hirer,
                    reputationScore,
                    credibilityScore }
            })
        );
            


        return res.status(200).json(formattedApplications);

    } catch (error) {
        console.log(error); 

        return res.status(500).json({
            message: "Server error"
        }); 
    }

}; 

//Approve applications
export const approveApplication = async (req: Request, res: Response) => {

    try {
        //getting application id 
        const applicationID = Number(req.params.id); 

        //finding applications
        const application = await applicationRepo.findOne({
            where: {
                id:applicationID
            },
            relations: ["hirer", "venue"]
        }); 

        //if application not found 
        if(!application) {
            return res.status(404).json({
                message: "Application not found"
            }); 
        }

        //preventing already processed application 
        if(application.status !== ApplicationStatus.PENDING){
            return res.status(400).json({
                message: "Application already processed"
            })
        }

        //updating status 
        application.status = ApplicationStatus.APPROVED; 
        //saving to database
        await applicationRepo.save(application);

        //adding to previous hire history 
        //checking if its already there 
        const existingHire = await previousHireRepo.findOne({
            where: {
                hirer: {id: application.hirer.id},
                venue: {id: application.venue.id},
                date: application.startDateTime
            }
        })

        //if not found then only add it to previous hire - prevents duplicates
        if(!existingHire){
                const previousHire = previousHireRepo.create({
                hirer: application.hirer,
                venue: application.venue,
                eventName: application.venue.name,
                date: application.startDateTime,
                rating: 0
            }); 

            //saving it to previous hire table
            await previousHireRepo.save(previousHire); 

        }
        

        return res.status(200).json({
            message: "Application approved"
        }); 

    } catch (error) {
        console.log(error); 

        return res.status(500).json({
            message: "Server error"
        }); 
    }
}; 

//Reject application 
export const rejectApplication = async (req: Request, res:Response) => {
    try{
        //getting application id
        const applicationID = Number(req.params.id);

        //getting application that equal to the applicationID
        const application = await applicationRepo.findOne({
            where: {
                id: applicationID
            }
        });

        //if application not found
        if(!application){
            return res.status(404).json({
                message: "Application not found"
            });
        }

        //preventing already processed application 
        if(application.status !== ApplicationStatus.PENDING){
            return res.status(400).json({
                message: "Application already processed"
            })
        }

        //changing status
        application.status = ApplicationStatus.REJECTED;
        //saving into database
        await applicationRepo.save(application);

        
        return res.status(200).json({
            message: "Application rejected"
        });
    } catch (error) {
        
        console.log(error); 
        return res.status(500).json({
            message: "Server error"
        });
    }
};

//saving comment 
export const saveApplicationComment = async ( req: Request, res: Response) => {

    try{ 
        //getting application id 
        const applicationID = Number(req.params.id); 
        //getting comment 
        const {comment} = req.body;
        //getting the application  
        const application = await applicationRepo.findOne({
            where:{
                id: applicationID
            }
        });

        //if application not found return
        if(!application){
            return res.status(404).json({
                message: "Application not found"
            });
        }

        application.comment = comment; 
        //saving application commnent into database
        await applicationRepo.save(application); 

        return res.status(200).json({
            message: "comment saved successfully"
        })

    } catch(error){

        console.log(error); 

        return res.status(500).json({
            message: "Server error"
        })
    }
}   

//Getting Vendor Venues 
export const getVendorVenues = async ( req: Request, res:Response) => {

    try {
        //gettng vendor id 
        const vendorID = Number(req.params.vendorID);
        //getting venues from the vendor
        const venues = await venueRepo.find({
            where: {
                vendor: {
                    id: vendorID
                }
            },
            relations: ["venueKeywords", "venueKeywords.keyword"],
        });
        //returing the venues
        return res.status(200).json(venues);

    } catch (error){
        console.log(error); 

        return res.status(500).json({
            message: "Server error"
        })

    }
}; 



export const getVendorInsights = async (req: Request, res: Response) => {
    try {
        const vendorID = Number(req.params.vendorID);
        const range = (req.query.range as string) || "all";

        const data = await getVendorInsightsService(vendorID, range);

        return res.status(200).json(data);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
};