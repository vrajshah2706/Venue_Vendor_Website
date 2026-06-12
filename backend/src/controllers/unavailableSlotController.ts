import {Request, Response} from "express"; 
import { AppDataSource } from "../data-source";
import { UnavailableSlot } from "../entity/UnavailableSlot";
import { Venue } from "../entity/Venue";


//getting repositories from  database
const slotRepo = AppDataSource.getRepository(UnavailableSlot);
const venueRepo = AppDataSource.getRepository(Venue); 


//adding Unavailable slots
export const addUnavailableSlot = async ( req: Request, res:Response) => {
    try {
        //getting venueID 
        const venueID = Number(req.params.venueID); 
        //getting from and to date
        const {from, to} = req.body;

        //validating 
        if(!from || !to){
            return res.status(400).json({
                message: "From and to dates required"
            });
        }

        const fromDate = new Date(from);
        const toDate = new Date(to); 

        //if from >= to -> invalid 
        if(isNaN(fromDate.getTime()) || isNaN(toDate.getTime())){
            return res.status(400).json({
                message: "Invalid data range"
            }); 
        }
        //finding venue
        const venue = await venueRepo.findOne({
            where: {
                id: venueID
            }
        });
        
        if(!venue){
            return res.status(404).json({
                message: "Venue not found"
            });
        }

        //creating slot
        const slot = slotRepo.create({
            venue, 
            fromDateTime: fromDate, 
            toDateTime: toDate 
        }); 

        //saving to database
        await slotRepo.save(slot); 
        
        return res.status(201).json({
            message: "Unavailable slot added"
        })

    } catch (error){
        console.log(error);
        
        return res.status(500).json({
            message:"Server error"
        });
    }
}

//getting unavialble slot 
export const getUnavailableSlots = async (req: Request, res: Response) => {
    try {
        const venueID = Number(req.params.venueID);

        const slots = await slotRepo.find({
            where: {
                venue: { id: venueID }
            },
            order: {
                fromDateTime: "ASC"
            }
        });

        return res.json(slots);

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to fetch slots"
        });
    }
};

//delete unavailable slot
export const deleteUnavailableSlot = async (req:Request, res:Response) => {

    try {
        
        //getting slot id
        const slotID = Number(req.params.slotID);

        //finding slot 
        const slot = await slotRepo.findOne({
            where: {id: slotID},
        }); 

        if(!slot) {
            return res.status(404).json({
                message: "Slot not found",
            })
        }

        //deleting slot 
        await slotRepo.remove(slot);

        return res.json({
            message: "Slot removed successfully",
        })
    } catch(error) {
        console.log(error) ;

        return res.status(500).json({
            message: "Failed to remove slot", 
        })
    }
}


// Get all unavailable slots (for all venues) - for hirer page
export const getAllUnavailableSlots = async (req: Request, res: Response) => {
    try {
        const slots = await slotRepo.find({
            relations: ["venue"],
            order: {
                fromDateTime: "ASC"
            }
        });
 
        return res.json(slots);
 
    } catch (error) {
        console.log(error);
 
        return res.status(500).json({
            message: "Failed to fetch slots"
        });
    }
};
 