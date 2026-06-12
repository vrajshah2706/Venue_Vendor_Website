import express from "express";

import {
    getVendorApplications,
    approveApplication,
    rejectApplication,
    saveApplicationComment,
    
    getVendorVenues,
    getVendorInsights
} from "../controllers/vendorController";

const router = express.Router(); 

//get all applications for vendor venues 
router.get("/:vendorID/applications", getVendorApplications); 

//approve application 
router.put("/application/:id/approve", approveApplication); 

//reject application 
router.put("/application/:id/reject", rejectApplication); 

//save comment 
router.patch("/application/:id/comment", saveApplicationComment);

//get vendor venues
router.get("/:vendorID/venues", getVendorVenues);



//get vendor Insights
router.get("/:vendorID/insights", getVendorInsights); 

export default router; 
