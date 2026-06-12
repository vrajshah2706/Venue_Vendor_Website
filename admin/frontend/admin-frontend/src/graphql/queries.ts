
//defining all GraphQL queries and mutations for admin operations

import { gql } from "@apollo/client";
// ============ QUERIES ============


//Query to fetch all venues with vendor information
export const GET_ALL_VENUES = gql`
  query GetAllVenues {
    getAllVenues {
      id
      name
      location
      capacity
      price
      isFeatured
      vendor {
        id
        name
        email
      }
    }
  }
`;

//Query to fetch all vendors 
export const GET_ALL_VENDORS = gql`
  query GetAllVendors {
    getAllVendors {
      id
      name
      email
    }
  }
`;

//Query to fetch featured venues
export const GET_FEATURED_VENUES = gql`
  query GetFeaturedVenues {
    getFeaturedVenues {
      id
      name
      location
      capacity
      price
      vendor {
        id
        name
      }
    }
  }
`;


//Query to get top 3 most popular venues
export const GET_TOP_POPULAR_VENUES = gql`
  query TopPopularVenues {
    topPopularVenues {
      venueName
      venueId
      totalBookings
      popularDay
      popularTimeSlot
      bookingsInTopSlot
    }
  }
`;


//Query to get top 3 most active applicants
export const GET_TOP_ACTIVE_APPLICANTS = gql`
  query TopActiveApplicants {
    topActiveApplicants {
      hirerName
      hirerId
      hirerEmail
      applicationsSubmitted
      successfulBookings
      successRate
    }
  }
`;

//mutations
//mutation to create a new venue
export const CREATE_VENUE = gql`
  mutation CreateVenue(
    $name: String!
    $location: String!
    $capacity: Int!
    $price: Float!
    $vendorID: Int!
  ) {
    createVenue(
      name: $name
      location: $location
      capacity: $capacity
      price: $price
      vendorID: $vendorID
    ) {
      success
      message
      venue {
        id
        name
        location
        capacity
        price
        isFeatured
        vendor {
          id
          name
          email
        }
      }
    }
  }
`;


//mutation to update an existing venue
export const UPDATE_VENUE = gql`
  mutation UpdateVenue(
    $id: Int!
    $name: String
    $location: String
    $capacity: Int
    $price: Float
  ) {
    updateVenue(
      id: $id
      name: $name
      location: $location
      capacity: $capacity
      price: $price
    ) {
      success
      message
      venue {
        id
        name
        location
        capacity
        price
        isFeatured
        vendor {
          id
          name
          email
        }
      }
    }
  }
`;


//mutation to delete a venue
export const DELETE_VENUE = gql`
  mutation DeleteVenue($id: Int!) {
    deleteVenue(id: $id) {
      success
      message
    }
  }
`;


//mutation to assign/swap vendor for a venue
export const ASSIGN_VENDOR_TO_VENUE = gql`
  mutation AssignVendorToVenue($venueID: Int!, $vendorID: Int!) {
    assignVendorToVenue(venueID: $venueID, vendorID: $vendorID) {
      success
      message
      venue {
        id
        name
        location
        capacity
        price
        isFeatured
        vendor {
          id
          name
          email
        }
      }
    }
  }
`;


//mutation to toggle featured status for a single venue

export const TOGGLE_FEATURED_VENUE = gql`
  mutation ToggleFeaturedVenue($venueID: Int!, $isFeatured: Boolean!) {
    toggleFeaturedVenue(venueID: $venueID, isFeatured: $isFeatured) {
      success
      message
      venue {
        id
        name
        isFeatured
      }
    }
  }
`;



