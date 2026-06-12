

import { gql } from "apollo-server-express";

export const reportSchema = gql`
  
  # Shows top 3 most popular venues based on number of bookings
  type PopularVenueReport {
    # Venue name
    venueName: String!
    
    # Venue ID (for linking back to venue management if needed)
    venueId: ID
    
    # Total number of successful bookings for this venue
    totalBookings: Int!
    
    # Most popular day (e.g., "Monday", "Tuesday", "Wednesday")
    popularDay: String!
    
    # Most popular time slot (e.g., "9pm-11pm", "2pm-4pm")
    # Calculated based on booking start times
    popularTimeSlot: String!
    
    # Number of bookings in the most popular time slot
    bookingsInTopSlot: Int
  }

  
  # Shows top 3 most active hirers based on application submissions
  
  type ActiveApplicantReport {
    # Hirer name
    hirerName: String!
    
    # Hirer ID (for future enhancements like viewing applicant details)
    hirerId: ID
    
    # Hirer email (for contact if needed)
    hirerEmail: String
    
    # Total number of venue applications submitted
    applicationsSubmitted: Int!
    
    # Number of successful bookings (completed events)
    successfulBookings: Int!
    
    # Success rate as percentage (0-100)
    # Calculated as: (successfulBookings / applicationsSubmitted) * 100
    successRate: Float!
  }

  # Extend Query type to add report queries
  extend type Query {
    # Get top 3 most popular venues with their most popular day and time slot
  
    topPopularVenues: [PopularVenueReport!]!

    # Get top 3 most active applicants with success rates
    topActiveApplicants: [ActiveApplicantReport!]!
  }
`;