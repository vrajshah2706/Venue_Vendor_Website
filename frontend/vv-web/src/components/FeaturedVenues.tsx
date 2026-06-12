import { ApiVenue,ApiVendor } from "@/pages/Hirer";

type FeaturedVenuesProps = {
  venues: ApiVenue[];
  vendors: ApiVendor[];
  onViewDetails: (venue: ApiVenue) => void;
};

export default function FeaturedVenues({ venues, vendors, onViewDetails }: FeaturedVenuesProps) {
  return (
    <div className="rounded-[28px] border border-[#E8E5F8] bg-white p-6 mb-6">
      <div className="mb-4">
      
        <h2 className="text-2xl font-bold text-[#2B0F74]">Featured Venues</h2>
      </div>

      {venues.length === 0 ? (
        <div className="rounded-2xl border border-[#E8E5F8] bg-[#F9F7FF] px-6 py-5 text-sm text-[#6B6B8D]">
          No featured venues at the moment — check back soon.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-2" style={{ minWidth: "max-content" }}>
            {venues.map((venue) => {
              const owner =
                vendors.find((v) => v.id === venue.vendorID) || venue.vendor;

              return (
                <div
                  key={venue.id}
                  className="min-w-[220px] max-w-[220px] overflow-hidden rounded-2xl bg-white border border-[#E8E5F8] shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="h-36 w-full object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-base font-semibold text-[#736CED] truncate">
                      {venue.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">{venue.location}</p>
                    <p className="text-xs text-gray-500">Capacity: {venue.capacity}</p>
                    {owner && (
                      <p className="text-xs text-gray-500 truncate">
                        Supplier: {owner.name}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => onViewDetails(venue)}
                      className="mt-3 w-full rounded-lg bg-[#736CED] py-1.5 text-xs font-semibold text-white hover:bg-[#6259d9] transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}