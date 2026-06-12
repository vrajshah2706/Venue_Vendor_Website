//using multer to upload files 
import multer, { FileFilterCallback } from "multer"; 
import { Request } from "express";

const storage = multer.diskStorage({
    //save file into uploads folder
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
       
        const uniqueName = Date.now() + "-" + file.originalname; 

        cb(null, uniqueName); 
    }
}); 

//validating file
const fileFilter = (req: Request, file: Express.Multer.File , cb: FileFilterCallback) => {
    //pdf validation 
    if(file.fieldname ===  "insuranceCertificate"  || file.fieldname === "businessRegistration"){
        if(file.mimetype !== "application/pdf"){
            return cb(new Error("Only PDF files allowed"));
        }
    }
    //drivers license validation 
    if(file.fieldname === "driversLicense"){
        if(file.mimetype !== "image/jpeg"){
            return cb(new Error("Only JPG allowed"));
        }
    }

    cb(null, true);

}   

 //max 5MB for fileSize 
const upload = multer ({storage, fileFilter, limits:{fileSize: 5 * 1024 * 1024 }}); 

export default upload; 
