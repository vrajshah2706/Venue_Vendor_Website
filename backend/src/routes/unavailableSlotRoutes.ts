import express from "express";
import {addUnavailableSlot,deleteUnavailableSlot, getAllUnavailableSlots } from "../controllers/unavailableSlotController";
import { getUnavailableSlots } from "../controllers/unavailableSlotController";

const router = express.Router();

//adding unavailable slots
router.post("/vendors/venues/:venueID/unavailable", addUnavailableSlot);
//getting unavailable slots
router.get("/vendors/venues/:venueID/unavailable", getUnavailableSlots);
//deleting unavailabel slots
router.delete("/vendors/unavailable/:slotID", deleteUnavailableSlot);
// Get ALL unavailable slots across all venues (for hirer page)
router.get("/unavailable-slots", getAllUnavailableSlots);
export default router;