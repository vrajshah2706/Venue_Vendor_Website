// File: backend/src/graphql/schemas/venueSchema.ts
// Purpose: Define GraphQL types and operations for venue management

import { gql } from "apollo-server-express";

export const venueSchema = gql`
  # User type for vendor information
  type User {
    id: ID!
    name: String!
    email: String!
  }

  # Venue type - main venue information
  type Venue {
    id: ID!
    name: String!
    location: String!
    capacity: Int!
    price: Float!
    isFeatured: Boolean!
    vendor: User # The vendor who owns this venue
  }

  # Response type for venue mutations
  type VenueResponse {
    success: Boolean!
    message: String!
    venue: Venue
  }

  # Response type for bulk operations
  type BulkOperationResponse {
    success: Boolean!
    message: String!
    venues: [Venue!]
  }

  # Query operations for venues
  extend type Query {
    # Get all venues with vendor information
    getAllVenues: [Venue!]!

    # Get all vendors 
    getAllVendors: [User!]!

    # Get a specific venue by ID
    getVenueById(id: ID!): Venue

    # Get all featured venues (for hirer page display)
    getFeaturedVenues: [Venue!]!
  }

  # Mutation operations for venues (CRUD + special operations)
  extend type Mutation {
    # CREATE - Add a new venue
    createVenue(
      name: String!
      location: String!
      capacity: Int!
      price: Float!
      vendorID: Int!
      image: String       
      isActive: Boolean   
    ): VenueResponse!


    # UPDATE - Modify existing venue details
    updateVenue(
      id: Int!
      name: String
      location: String
      capacity: Int
      price: Float
    ): VenueResponse!

    # DELETE - Remove a venue
    deleteVenue(id: Int!): VenueResponse!

    # Assign/swap vendor to a venue
    assignVendorToVenue(
      venueID: Int!
      vendorID: Int!
    ): VenueResponse!

    # Toggle featured status for a single venue
    toggleFeaturedVenue(
      venueID: Int!
      isFeatured: Boolean!
    ): VenueResponse!

    #  Bulk toggle featured status for multiple venues
    bulkToggleFeaturedVenues(
      venueIds: [Int!]!
      isFeatured: Boolean!
    ): BulkOperationResponse!
  }
`;