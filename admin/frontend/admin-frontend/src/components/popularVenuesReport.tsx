import React from "react";

type PopularVenue =  {
  venueName: string;
  venueId: number;
  totalBookings: number;
  popularDay: string;
  popularTimeSlot: string;
  bookingsInTopSlot: number;
}; 

type  PopularVenuesReportProps =  {
  venues: PopularVenue[];
}; 

const PopularVenuesReport = ({venues,}: PopularVenuesReportProps) => {  
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
        
        <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Top 3 Most Popular Venues
            </h3>
            <p className="text-gray-600 text-sm mt-1">
            Based on total number of successful bookings
            </p>
        </div>

        {/* venue card */}
        {venues.length > 0 ? (
            <div className="space-y-4">
            {venues.map((venue, index) => {
                
               
                const bgColors = [
                "bg-yellow-50 border-yellow-200",
                "bg-gray-50 border-gray-200",
                "bg-orange-50 border-orange-200"
                ];

                return (
                <div
                    key={venue.venueId}
                    className={`border-2 rounded-lg p-4 ${bgColors[index]}`}
                >
                    {/* Rank and Name */}
                    <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                     
                        <div>
                        <p className="text-xs text-gray-600">
                            Rank {index + 1}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                            {venue.venueName}
                        </p>
                        </div>
                    </div>
                    
                    </div>

                
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-300">
                    {/* Most Popular Day */}
                    <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                        Busiest Day
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                        {venue.popularDay}
                        </p>
                    </div>

                    {/* Most Popular Time Slot */}
                    <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                        Busiest Time
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                        {venue.popularTimeSlot}
                        </p>
                    </div>
                    </div>

                    {/* Bookings in Top Slot */}
                    <div className="mt-3 bg-white rounded p-3">
                    <p className="text-xs text-gray-600 mb-1">
                        Bookings
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                        {venue.bookingsInTopSlot} booking(s)
                    </p>
                    </div>
                </div>
                );
            })}
            </div>
        ) : (
            // Empty State
            <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
                📭 No venue data available yet
            </p>
            <p className="text-gray-400 text-sm mt-2">
                Reports will appear once venues have bookings
            </p>
            </div>
        )}

        
        {venues.length > 0 && (
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-900">
                <strong>Insight:</strong> The most popular venue had{" "}
                <strong>{venues[0]?.totalBookings}</strong> bookings, with peak
                demand on <strong>{venues[0]?.popularDay}s</strong> during{" "}
                <strong>{venues[0]?.popularTimeSlot}</strong>.
            </p>
            </div>
        )}
        </div>
    );
};
export default PopularVenuesReport;

