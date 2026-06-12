import React from "react";

type Venue = {
  id: number;
  name: string;
  isFeatured: boolean;
}; 

type FeaturedVenuesSelectorProps =  {
  venues: Venue[];
  onToggle: (venueId: number) => void;
}; 

const FeaturedVenuesSelector = ({venues,onToggle,}: FeaturedVenuesSelectorProps) =>  { 
  const featuredVenues = venues.filter((v) => v.isFeatured);
  const unfeaturedVenues = venues.filter((v) => !v.isFeatured);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Featured Venues Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currently Featured */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Featured ({featuredVenues.length})
          </h3>
          <div className="space-y-2">
            {featuredVenues.length > 0 ? (
              featuredVenues.map((venue) => (
                <div
                  key={venue.id}
                  className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
                >
                  <span className="font-medium text-gray-900">
                    {venue.name}
                  </span>
                  <button
                    onClick={() => onToggle(venue.id)}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No venues featured yet</p>
            )}
          </div>
        </div>

        {/* Available to Feature */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available ({unfeaturedVenues.length})
          </h3>
          <div className="space-y-2">
            {unfeaturedVenues.length > 0 ? (
              unfeaturedVenues.map((venue) => (
                <div
                  key={venue.id}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
                >
                  <span className="font-medium text-gray-900">
                    {venue.name}
                  </span>
                  <button
                    onClick={() => onToggle(venue.id)}
                    className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Feature
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">All venues are already featured</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          Featured venues appear in a special "Featured Venues" section on
          the hirer page.
        </p>
      </div>
    </div>
  );
};

export default FeaturedVenuesSelector; 

