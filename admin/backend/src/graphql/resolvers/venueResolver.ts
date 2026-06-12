// Handle all venue operations - CRUD and assign vendor
import { AppDataSource } from "../../data-source";
import { Venue } from "../../entity/Venue";
import { Application } from "../../entity/Application";
import { User, UserRole } from "../../entity/User";
import { PreviousHire } from "../../entity/PreviousHire";

export const venueResolver = {
  Query: {
   
    //reading data 
    //Get all venues with vendor information
    getAllVenues: async () => {
      try {
        const venues = await AppDataSource.getRepository(Venue).find({
          relations: ["vendor"],
          order: {
            id: "ASC"
          }
        });
        return venues;
      } catch (error) {
        console.error("Error fetching venues:", error);
        throw new Error("Failed to fetch venues");
      }
    },

    //Get all vendors 
    getAllVendors: async () => {

        const userRepo =
            AppDataSource.getRepository(User);

        return userRepo.find({
            where: {
            role: UserRole.VENDOR
            },
            order: {
            name: "ASC"
            }
        });
    },
 
    //Get a specific venue by ID
    getVenueById: async (_: any, { id }: { id: string }) => {
      try {
        const venue = await AppDataSource.getRepository(Venue).findOne({
          where: { id: parseInt(id) },
          relations: ["vendor"]
        });

        if (!venue) {
          throw new Error(`Venue with ID ${id} not found`);
        }

        return venue;
      } catch (error) {
        console.error("Error fetching venue:", error);
        throw error;
      }
    },

 
    //Get all featured venues
    getFeaturedVenues: async () => {
      try {
        const venues = await AppDataSource.getRepository(Venue).find({
          where: { isFeatured: true },
          relations: ["vendor"],
          order: {
            id: "ASC"
          }
        });
        return venues;
      } catch (error) {
        console.error("Error fetching featured venues:", error);
        throw new Error("Failed to fetch featured venues");
      }
    }
  },

  Mutation: {
    
    //creating 

    //creating a new venue
    createVenue: async (
      _: any,
      {
        name,
        location,
        capacity,
        price,
        vendorID,
        image = "",
        isActive = true,
      }: {
        name: string;
        location: string;
        capacity: number;
        price: number;
        vendorID: number;
        image?: string;
        isActive?: boolean;

      }
    ) => {
      try {
        // Validate inputs
        if (!name || !location || capacity <= 0 || price <= 0) {
          return {
            success: false,
            message: "Invalid venue details. All fields are required and must be valid.",
            venue: null
          };
        }

        const venueRepo = AppDataSource.getRepository(Venue);
        const userRepo = AppDataSource.getRepository(User);

        // Check if vendor exists and is actually a vendor
        const vendor = await userRepo.findOne({
          where: { id: vendorID }
        });

        if (!vendor) {
          return {
            success: false,
            message: `Vendor with ID ${vendorID} not found`,
            venue: null
          };
        }

        if (vendor.role !== UserRole.VENDOR) {
          return {
            success: false,
            message: `User with ID ${vendorID} is not a vendor`,
            venue: null
          };
        }

        // Create new venue
        const venue = venueRepo.create({
          name,
          location,
          capacity,
          price: parseFloat(price.toString()),
          image: "",       
          isActive: true,  // new venues are active by default
          isFeatured: false,  
          vendor
        });

        const savedVenue = await venueRepo.save(venue);

        // Fetch the saved venue with vendor info
        const venueWithVendor = await venueRepo.findOne({
          where: { id: savedVenue.id },
          relations: ["vendor"]
        });

        return {
          success: true,
          message: "Venue created successfully",
          venue: venueWithVendor
        };
      } catch (error) {
        console.error("Error creating venue:", error);
        return {
          success: false,
          message: "Failed to create venue",
          venue: null
        };
      }
    },

   //updating venues 

   
    //Update an existing venue's details
    updateVenue: async (
      _: any,
      {
        id,
        name,
        location,
        capacity,
        price
      }: {
        id: number;
        name?: string;
        location?: string;
        capacity?: number;
        price?: number;
      }
    ) => {
      try {
        const venueRepo = AppDataSource.getRepository(Venue);

        // Find the venue to update
        const venue = await venueRepo.findOne({
          where: { id },
          relations: ["vendor"]
        });

        if (!venue) {
          return {
            success: false,
            message: `Venue with ID ${id} not found`,
            venue: null
          };
        }

        // Update only provided fields
        if (name) venue.name = name;
        if (location) venue.location = location;
        if (capacity && capacity > 0) venue.capacity = capacity;
        if (price && price > 0) venue.price = parseFloat(price.toString());

        const updatedVenue = await venueRepo.save(venue);

        return {
          success: true,
          message: "Venue updated successfully",
          venue: updatedVenue
        };
      } catch (error) {
        console.error("Error updating venue:", error);
        return {
          success: false,
          message: "Failed to update venue",
          venue: null
        };
      }
    },

    //deleting venues


    //Delete a venue
    deleteVenue: async (_: any, { id }: { id: number }) => {
      try {
        const venueRepo = AppDataSource.getRepository(Venue);

        // Find the venue first to confirm it exists
        const venue = await venueRepo.findOne({
          where: { id }
        });

        if (!venue) {
          return {
            success: false,
            message: `Venue with ID ${id} not found`,
            venue: null
          };
        }

        // Delete the venue 

        await AppDataSource.getRepository(Application).delete({venue: { id }});
        await AppDataSource.getRepository(PreviousHire).delete({venue: { id }});
        await venueRepo.delete(id);

        return {
          success: true,
          message: `Venue "${venue.name}" deleted successfully`,
          venue: null
        };
      } catch (error) {
        console.error("Error deleting venue:", error);
        return {
          success: false,
          message: "Failed to delete venue",
          venue: null
        };
      }
    },

  
    //Assign or swap vendor for a venue
    assignVendorToVenue: async (
      _: any,
      { venueID, vendorID }: { venueID: number; vendorID: number }
    ) => {
      try {
        const venueRepo = AppDataSource.getRepository(Venue);
        const userRepo = AppDataSource.getRepository(User);

        // Find the venue
        const venue = await venueRepo.findOne({
          where: { id: venueID },
          relations: ["vendor"]
        });

        if (!venue) {
          return {
            success: false,
            message: `Venue with ID ${venueID} not found`,
            venue: null
          };
        }

        // Find the new vendor
        const newVendor = await userRepo.findOne({
          where: { id: vendorID }
        });

        if (!newVendor) {
          return {
            success: false,
            message: `Vendor with ID ${vendorID} not found`,
            venue: null
          };
        }

        if (newVendor.role !== UserRole.VENDOR) {
          return {
            success: false,
            message: `User with ID ${vendorID} is not a vendor`,
            venue: null
          };
        }

        // Store old vendor name for message
        const oldVendorName = venue.vendor?.name || "None";

        // Assign new vendor
        venue.vendor = newVendor;
        const updatedVenue = await venueRepo.save(venue);

        // Fetch with vendor info
        const venueWithVendor = await venueRepo.findOne({
          where: { id: updatedVenue.id },
          relations: ["vendor"]
        });

        return {
          success: true,
          message: `Venue vendor changed from "${oldVendorName}" to "${newVendor.name}"`,
          venue: venueWithVendor
        };
      } catch (error) {
        console.error("Error assigning vendor:", error);
        return {
          success: false,
          message: "Failed to assign vendor to venue",
          venue: null
        };
      }
    },

   

    
     //Toggle featured status for a single venue
     
    toggleFeaturedVenue: async (
      _: any,
      { venueID, isFeatured }: { venueID: number; isFeatured: boolean }
    ) => {
      try {
        const venueRepo = AppDataSource.getRepository(Venue);

        const venue = await venueRepo.findOne({
          where: { id: venueID },
          relations: ["vendor"]
        });

        if (!venue) {
          return {
            success: false,
            message: `Venue with ID ${venueID} not found`,
            venue: null
          };
        }

        // Update featured status
        venue.isFeatured = isFeatured;
        const updatedVenue = await venueRepo.save(venue);

        const status = isFeatured ? "featured" : "unfeatured";

        return {
          success: true,
          message: `Venue "${venue.name}" is now ${status}`,
          venue: updatedVenue
        };
      } catch (error) {
        console.error("Error toggling featured status:", error);
        return {
          success: false,
          message: "Failed to toggle featured status",
          venue: null
        };
      }
    },



    
    //  toggle featured status for multiple venues
    bulkToggleFeaturedVenues: async (_: any,{ venueIds, isFeatured }: { venueIds: number[]; isFeatured: boolean } ) => {
      try {
        const venueRepo = AppDataSource.getRepository(Venue);

        if (!venueIds || venueIds.length === 0) {
          return {
            success: false,
            message: "No venues selected",
            venues: []
          };
        }

        // Update all selected venues
        for (const id of venueIds) {
            await venueRepo.update(
                { id },
                { isFeatured }
            );
        }

        // Fetch updated venues
        const updatedVenues = await venueRepo.find({
          where: venueIds.map(id => ({ id })),
          relations: ["vendor"]
        });

        const status = isFeatured ? "featured" : "unfeatured";

        return {
          success: true,
          message: `${updatedVenues.length} venue(s) are now ${status}`,
          venues: updatedVenues
        };
      } catch (error) {
        console.error("Error bulk toggling featured status:", error);
        return {
          success: false,
          message: "Failed to bulk toggle featured status",
          venues: []
        };
      }
    }
  }
};