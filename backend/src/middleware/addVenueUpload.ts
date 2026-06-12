import multer from "multer";
import path from "path";
import { Request } from "express";
import { FileFilterCallback } from "multer";

const projectRoot = path.resolve(__dirname, "../../../");

const uploadPath = path.join(
    projectRoot,
    "frontend/vv-web/public/Images"
);

const venueStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); 
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + file.originalname.replace(/\s+/g, "");

        cb(null, uniqueName);
    },
});

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (file.fieldname === "image") {
        if (file.mimetype !== "image/png") {
            return cb(new Error("Only PNG images are allowed"));
        }
    }

    cb(null, true);
};

export const venueUpload = multer({
    storage: venueStorage,
    fileFilter,
});