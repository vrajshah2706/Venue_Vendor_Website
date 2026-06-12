import express from "express";
import{getUserProfile, updateUserProfile, uploadDocuments, getUserDocuments,getReputationScore, getCredibilityScore} from "../controllers/userController";
import upload from "../middleware/uploadMiddleware";
import { getUserHistory } from "../controllers/userController";

const router = express.Router();

//get profile
router.get("/:id", getUserProfile);

//update profile
router.put("/:id", updateUserProfile);

//upload documents
router.post(
    "/:id/documents",
    upload.fields([
        { name: "driversLicense", maxCount: 1 },
        { name: "insuranceCertificate", maxCount: 1 },
        { name: "businessRegistration", maxCount: 1 },
    ]),
    uploadDocuments
);

//get documents
router.get("/:id/documents", getUserDocuments); 

//get credibility score
router.get("/:id/credibility", getCredibilityScore);

//get reputation score
router.get("/:id/reputation", getReputationScore);

//get user history 
router.get("/:id/history", getUserHistory);

export default router; 
