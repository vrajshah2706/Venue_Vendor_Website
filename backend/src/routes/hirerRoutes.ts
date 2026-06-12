import express from "express";
import {
    getHirerPreferences,
    savePreference,
    deletePreference,
} from "../controllers/hirerController";
 
const router = express.Router();
 
// Get all preferences for a hirer
router.get("/hirer/:hirerID/preferences", getHirerPreferences);
 
// Save or update a preference
router.post("/preferences", savePreference);
 
// Delete a preference
router.delete("/preferences/:id", deletePreference);
 
export default router;
 