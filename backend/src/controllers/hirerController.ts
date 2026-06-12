import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Preference } from "../entity/Preference";
import { User } from "../entity/User";
import { Venue } from "../entity/Venue";

const preferenceRepo = AppDataSource.getRepository(Preference);
const userRepo = AppDataSource.getRepository(User);
const venueRepo = AppDataSource.getRepository(Venue);

// Get all preferences for a hirer
export const getHirerPreferences = async (req: Request, res: Response) => {
    try {
        const hirerID = Number(req.params.hirerID);

        // Verify the hirer exists
        const hirer = await userRepo.findOne({
            where: { id: hirerID },
        });

        if (!hirer) {
            return res.status(404).json({
                message: "Hirer not found",
            });
        }

        // Get all preferences for this hirer, sorted by rank
        const preferences = await preferenceRepo.find({
            where: {
                hirer: {
                    id: hirerID,
                },
            },
            relations: ["venue", "venue.vendor", "venue.venueKeywords", "venue.venueKeywords.keyword"],
            order: {
                rank: "ASC",
            },
        });

        return res.json(preferences);
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to fetch preferences",
        });
    }
};

// Create or update a preference
export const savePreference = async (req: Request, res: Response) => {
    try {
        const { hirerID, venueID, rank } = req.body;

        // Validation
        if (!hirerID || !venueID || !rank) {
            return res.status(400).json({
                message: "hirerID, venueID, and rank are required",
            });
        }

        // Verify hirer exists
        const hirer = await userRepo.findOne({
            where: { id: hirerID },
        });

        if (!hirer) {
            return res.status(404).json({
                message: "Hirer not found",
            });
        }

        // Verify venue exists
        const venue = await venueRepo.findOne({
            where: { id: venueID },
            relations: ["vendor", "venueKeywords", "venueKeywords.keyword"],
        });

        if (!venue) {
            return res.status(404).json({
                message: "Venue not found",
            });
        }

        // Check if preference already exists
        const existingPreference = await preferenceRepo.findOne({
            where: {
                hirer: {
                    id: hirerID,
                },
                venue: {
                    id: venueID,
                },
            },
        });

        let preference: Preference;

        if (existingPreference) {
            // Update existing preference
            existingPreference.rank = rank;
            existingPreference.addedAt = new Date();
            preference = await preferenceRepo.save(existingPreference);
        } else {
            // Create new preference
            preference = preferenceRepo.create({
                hirer,
                venue,
                rank,
                addedAt: new Date(),
            });

            preference = await preferenceRepo.save(preference);
        }

        return res.json({
            message: "Preference saved successfully",
            preference,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to save preference",
        });
    }
};

// Delete a preference
export const deletePreference = async (req: Request, res: Response) => {
    try {
        const preferenceID = Number(req.params.id);

        const preference = await preferenceRepo.findOne({
            where: { id: preferenceID },
        });

        if (!preference) {
            return res.status(404).json({
                message: "Preference not found",
            });
        }

        await preferenceRepo.delete(preferenceID);

        return res.json({
            message: "Preference deleted successfully",
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Failed to delete preference",
        });
    }
};