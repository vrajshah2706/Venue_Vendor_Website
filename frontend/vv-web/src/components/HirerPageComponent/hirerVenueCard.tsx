import { Vendor, Venue } from "@/context/AppContext";
type HirerVenueCardProps = {
  venue: Venue;
  vendor?: Vendor;
  onViewDetails: () => void;
};

export default function HirerVenueCard(props: HirerVenueCardProps) {
  const { venue, vendor, onViewDetails } = props;

  const supplierName = vendor?.name || "Unknown Vendor";

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg">
      <img
        src={venue.image}
        alt={venue.name}
        className="h-44 w-full object-cover"
      />

      <div className="p-4">
        <h2 className="text-xl font-semibold text-[#736CED]">{venue.name}</h2>

        {/* Venue types/keywords as badges */}
        {venue.venueKeywords && venue.venueKeywords.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {venue.venueKeywords.map((vk: any) => (
              <span
                key={vk.keyword?.id}
                className="inline-block bg-purple-100 text-[#736CED] text-xs px-2 py-1 rounded-full font-medium"
              >
                {vk.keyword?.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-2 text-sm text-gray-500">
          <p>{venue.location}</p>
          <p>Capacity: {venue.capacity}</p>
        </div>

        <p className="mt-2 text-sm text-gray-600">Supplier: {supplierName}</p>

        {/* View details button that will open a modal with more information about the venue */}
        <button
          type="button"
          onClick={() => onViewDetails()}
          className="mt-4 w-full rounded-lg bg-[#736CED] py-2 font-medium text-white transition hover:bg-[#6259d9]"
        >
          View Venue Details
        </button>
      </div>
    </div>
  );
}