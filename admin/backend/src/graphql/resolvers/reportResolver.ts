import { AppDataSource } from "../../data-source";
import { PreviousHire } from "../../entity/PreviousHire";
import { Application } from "../../entity/Application";

export const reportResolver = {
  Query: {
    
    //top 3 Most Popular Venues
    topPopularVenues: async () => {
      try {
        const previousHireRepo = AppDataSource.getRepository(PreviousHire);

        // fetching all previous hires (completed bookings) with venue info
        const hires = await previousHireRepo.find({
          relations: ["venue"]
        });

        // handling case where there are no hires
        if (hires.length === 0) {
          return [];
        }

        // grouping data by venue ID 
        const venueMap: Record<
          string,
          {
            venueId: number;
            venueName: string;
            totalBookings: number;
            days: Record<string, number>; 
            times: Record<string, number>; 
          }
        > = {};

        // processing each hire to aggregate data
        for (const hire of hires) {
          const venueId = hire.venue.id;
          const venueName = hire.venue.name;

          // intialising venue data if first time seeing this venue
          if (!venueMap[venueId]) {
            venueMap[venueId] = {
              venueId,
              venueName,
              totalBookings: 0,
              days: {},
              times: {}
            };
          }

          // incrementing total bookings for this venue
          venueMap[venueId].totalBookings++;

          // extracting day of week from booking date
          const date = new Date(hire.date);
          const day = date.toLocaleDateString("en-AU", {
            weekday: "long" // Returns full day name like "Monday"
          });

          // tracking day frequency
          venueMap[venueId].days[day] =
            (venueMap[venueId].days[day] || 0) + 1;

          // extaracting hour and creating 2-hour time slot
          const hour = date.getHours();
          
          // Cconvert to 12 hor format
          let displayHour = hour % 12;
          displayHour = displayHour === 0 ? 12 : displayHour;
          const period = hour < 12 ? "am" : "pm";
          
          const endHour = (displayHour % 12) + 1;
          const endPeriod = (hour + 2 < 12 || hour + 2 >= 24) ? "am" : "pm";
          
          const slot = `${displayHour}${period}-${endHour % 12 === 0 ? 12 : endHour % 12}${endPeriod}`;

          // tracking time slot frequency
          venueMap[venueId].times[slot] =
            (venueMap[venueId].times[slot] || 0) + 1;
        }

        // transforming venue map into report format
        const reports = Object.values(venueMap).map((stats) => {
          // finding most popular day
          const daysEntries = Object.entries(stats.days);
          let popularDay = "N/A";
          let daysCount = 0;

          if (daysEntries.length > 0) {
            const [day, count] = daysEntries.reduce((max, current) =>
              current[1] > max[1] ? current : max
            );
            popularDay = day;
            daysCount = count as number;
          }

          // find most popular time slot
          const timesEntries = Object.entries(stats.times);
          let popularTimeSlot = "N/A";
          let timesCount = 0;

          if (timesEntries.length > 0) {
            const [slot, count] = timesEntries.reduce((max, current) =>
              current[1] > max[1] ? current : max
            );
            popularTimeSlot = slot;
            timesCount = count as number;
          }

          return {
            venueName: stats.venueName,
            venueId: stats.venueId,
            totalBookings: stats.totalBookings,
            popularDay,
            popularTimeSlot,
            bookingsInTopSlot: timesCount
          };
        });

        // sorting by total bookings by decending order  and return top 3
        return reports
          .sort((a, b) => b.totalBookings - a.totalBookings)
          .slice(0, 3);
      } catch (error) {
        console.error("Error generating popular venues report:", error);
        throw new Error("Failed to generate popular venues report");
      }
    },

    
    //top 3 Most Active Applicants 
    topActiveApplicants: async () => {
      try {
        const applicationRepo = AppDataSource.getRepository(Application);
        const previousHireRepo = AppDataSource.getRepository(PreviousHire);

        // fetching all applications with hirer info
        const applications = await applicationRepo.find({
          relations: ["hirer"]
        });

        // fetching all successful bookings with hirer info
        const hires = await previousHireRepo.find({
          relations: ["hirer"]
        });

        // handle case where there are no applications
        if (applications.length === 0) {
          return [];
        }

        // create map to aggregate hirer statistics
        const hirerMap: Record<
          string,
          {
            hirerId: number;
            hirerName: string;
            hirerEmail: string;
            applications: number;
            successful: number;
          }
        > = {};

        // count applications per hirer
        for (const app of applications) {
          const hirerId = app.hirer.id;
          const hirerName = app.hirer.name;
          const hirerEmail = app.hirer.email;

          // initialize hirer data if first time
          if (!hirerMap[hirerId]) {
            hirerMap[hirerId] = {
              hirerId,
              hirerName,
              hirerEmail,
              applications: 0,
              successful: 0
            };
          }

          // incrementing application count
          hirerMap[hirerId].applications++;
        }

        // count successful bookings per hirer
        for (const hire of hires) {
          const hirerId = hire.hirer.id;
          const hirerName = hire.hirer.name;
          const hirerEmail = hire.hirer.email;

          // initialize hirer data if not already in map
          if (!hirerMap[hirerId]) {
            hirerMap[hirerId] = {
              hirerId,
              hirerName,
              hirerEmail,
              applications: 0,
              successful: 0
            };
          }

          // incrementing successful booking count
          hirerMap[hirerId].successful++;
        }

        // Transform hirer map into report format with success rate
        const report = Object.values(hirerMap).map((stats) => {
          // Calculate success rate as percentage
          const successRate =
            stats.applications === 0
              ? 0
              : Number(
                  ((stats.successful / stats.applications) * 100).toFixed(2)
                );

          return {
            hirerName: stats.hirerName,
            hirerId: stats.hirerId,
            hirerEmail: stats.hirerEmail,
            applicationsSubmitted: stats.applications,
            successfulBookings: stats.successful,
            successRate // percentage (0-100)
          };
        });

        // Sort by applications submitted (descending) and return top 3
        return report
          .sort(
            (a, b) =>
              b.applicationsSubmitted - a.applicationsSubmitted
          )
          .slice(0, 3);
      } catch (error) {
        console.error("Error generating active applicants report:", error);
        throw new Error("Failed to generate active applicants report");
      }
    }
  }
};