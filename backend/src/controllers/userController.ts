//moght have:
/*
credibility score calulcation for header 
vendor & hirer edit profile CRUD operations 
 */ 
import {Request, Response} from "express"; 
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { HirerDocument } from "../entity/HirerDocument";
import { PreviousHire } from "../entity/PreviousHire";
import { deleteFile } from "./utils";
import { calculateReputationScore, calculateCredibilityScore } from "./utils";
import fs from "fs"; 

//repositories
const userRepo = AppDataSource.getRepository(User); 
const documentRepo = AppDataSource.getRepository(HirerDocument); 
const previousHireRepo = AppDataSource.getRepository(PreviousHire);

//Get User Profile
export const getUserProfile = async (req: Request, res:Response) => {

    try{
        //getting userID 
        const userID = Number(req.params.id); 
        //getting user info based on userID from DB
        const user = await userRepo.findOne({
            where: {
                id:userID
            }
        });

        //if user not found ->return error
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json(user); 
    } catch (error) {
        console.log(error); 

        return res.status(500).json({
            message: "Server error"
        });
    }
};

//Updating User Profile
export const updateUserProfile = async (req:Request, res:Response) => {
    
    try {
        //getting userID 
        const userID = Number(req.params.id); 
        //getting fileds that can be updates
        const {name, phoneNumber} = req.body;

        //getting user info from DB based on userID
        const user = await userRepo.findOne({
            where:{
                id:userID   
            }
        })

        //if user not found -> return error
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }; 

        //validating 
        //validating name
        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    message: "Name cannot be empty"
                });
            }

            if (!/^[A-Za-z\s]+$/.test(name)) {
                return res.status(400).json({
                    message: "Name can only contain letters"
            });
        }
}       //validating phone number
        if (phoneNumber !== undefined) {
            if (phoneNumber === "") {
                return res.status(400).json({
                    message: "Phone number cannot be empty"
                });
            }

            if (!/^\d{10}$/.test(phoneNumber)) {
                return res.status(400).json({
                    message: "Phone must be 10 digits"
                });
            }
        }

        //updating fields (if new exist change to that or else keep old )
        if (name !== undefined) {
            user.name = name;
        }

        if (phoneNumber !== undefined) {
            user.phoneNumber = phoneNumber;
        }

        
        //saving into database
        await userRepo.save(user); 

        return res.status(200).json({
            message: "Profile updated",
            user
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server error"
        }); 
    } 
};

//Uploading Document
export const uploadDocuments = async ( req: Request,res: Response ) => {
    
    try {
        //getting user id
        const userID = Number(req.params.id);
        const { isBusiness } = req.body;
        
        //getting user info from DB 
        const user = await userRepo.findOne({
            where: {
                id: userID
            }
        }); 

        //if no user -> return error
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

     
        const files = (req.files as {[fieldName: string]: Express.Multer.File[];}) || {};

        //checking exisiting document record
        let documents = await documentRepo.findOne({
            where: {
                hirer: {
                    id: userID
                }
            },
            relations: ["hirer"]
        })

        //create if doesnt exist
        if(!documents){
            documents = documentRepo.create({
                hirer: user, isBusiness: false
            });
        }

        //saving file paths 
        if (files.driversLicense) {

            const newFile = files.driversLicense[0];

            // prevent duplicate upload
            if (
                documents.driversLicense &&
                documents.driversLicense.includes(newFile.originalname)
            ) {
                // delete newly uploaded duplicate file
                fs.unlinkSync(newFile.path);
            } else {

                // delete old file if replacing
                if (documents.driversLicense) {
                    deleteFile(documents.driversLicense);
                }

                documents.driversLicense = `/uploads/${newFile.filename}`;
            }
        }
        if (files.insuranceCertificate) {

            const newFile = files.insuranceCertificate[0];

            if (
                documents.insuranceCertificate &&
                documents.insuranceCertificate.includes(newFile.originalname)
            ) {
                fs.unlinkSync(newFile.path);
            } else {

                if (documents.insuranceCertificate) {
                    deleteFile(documents.insuranceCertificate);
                }

                documents.insuranceCertificate =
                    `/uploads/${newFile.filename}`;
            }
        }

        if (files.businessRegistration) {

            const newFile = files.businessRegistration[0];

            if (
                documents.businessRegistration &&
                documents.businessRegistration.includes(newFile.originalname)
            ) {
                fs.unlinkSync(newFile.path);
            } else {

                if (documents.businessRegistration) {
                    deleteFile(documents.businessRegistration);
                }

                documents.businessRegistration =
                    `/uploads/${newFile.filename}`;
            }
        }

        //saving to database 
        documents.isBusiness = isBusiness === "true";
        await documentRepo.save(documents); 

        return res.status(200).json({
            message: "Documents uploaded",
            documents
        })
    } catch(error) {
        console.log(error); 

        return res.status(500).json({
            message: "Server error"
        });
    }
}; 

//Get Documents
export const getUserDocuments = async ( req: Request, res:Response ) => {
    try {
        //getting user id
        const userID = Number(req.params.id); 
        //getting documents from DB 
        const documents = await documentRepo.findOne({
            where: {
                hirer:{
                    id: userID
                }
            },
            relations: ["hirer"]
        });

        return res.status(200).json(documents);

    } catch(error) {
        console.log(error); 

        return res.status(500).json({
            message: "Sever error"
        })

    }
}

//getting credibilkity score 
export const getCredibilityScore = async (req: Request, res: Response) => {
    try {
        //getting user id 
        const userID = Number(req.params.id);
        //calculating score 
        const score = await calculateCredibilityScore(userID);

        return res.status(200).json({
            credibilityScore: score
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};
//get reputation score
export const getReputationScore = async (req: Request, res: Response) => {
    try {
        //getting user id 
        const userID = Number(req.params.id);
        //calculating  reputation score 
        const reputationScore = await calculateReputationScore(userID);

        return res.status(200).json({
            reputationScore
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

//get user history 
export const getUserHistory = async (req: Request, res: Response) => {
    try {
        const userID = Number(req.params.id);

        const history = await previousHireRepo.find({
            where: {
                hirer: { id: userID }
            },
            relations: ["venue"]
        });

        return res.status(200).json(history);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};