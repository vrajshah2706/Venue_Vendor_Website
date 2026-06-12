import express from "express";
import {
    getVendorVenues,
    createVenue,
    updateVenue,
    deleteVenue,
    getAllKeywords, 
    getAllVenues, 
    getHirerApplications
} from "../controllers/venueController";
import { createApplication } from "../controllers/venueController";
import { venueUpload } from "../middleware/addVenueUpload";

const router = express.Router();
// fetch all venue types / keywords
router.get("/keywords/all", getAllKeywords);

//get all vendor venues
// router.get("/vendors/:vendorID/venues", getVendorVenues);
router.get("/:vendorID/venues", getVendorVenues);

//create venue
router.post("/", venueUpload.single("image"), createVenue);

//update venue
router.put("/:id", updateVenue);

//delete venue
router.delete("/:id", deleteVenue);

//get all venues
router.get("/", getAllVenues);

//creating application
router.post("/applications", createApplication);

//getting hirer application
router.get("/hirer/:hirerID", getHirerApplications);

export default router; 
