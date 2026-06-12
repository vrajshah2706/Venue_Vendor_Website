"use client";

import { Venue } from "@/context/AppContext";

type VenueCardProps = {
    venue: Venue;

    //function passed from parent
    onActionClick: (venue: Venue) => void;
};



export default function VendorVenuesCard({venue,onActionClick}: VenueCardProps) {

    

    return (

        <div className="min-w-[250px] max-w-[250px] bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">

            {/* image */}
            <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-40 object-cover rounded-md mb-2"
            />

            {/* venue name */}
            <h3 className="text-lg text-[#736CED] font-semibold mb-2">
                {venue.name}
            </h3>

            {/* venue info */}
            <div className="text-sm text-[#2B0F74] space-y-1">

            {/* venue types/keywords */}
            
            {venue.venueKeywords && venue.venueKeywords.length > 0 && (
                    <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Types:</p>
                        <div className="flex flex-wrap gap-1">
                            {venue.venueKeywords.map((vk: any) => (
                                <span
                                    key={vk.keyword?.id}
                                    className="inline-block bg-purple-100 text-[#736CED] text-xs px-2 py-1 rounded-full font-medium"
                                >
                                    {vk.keyword?.name}
                                </span>
                            ))}
                        </div>
                    </div>
            )}

                <p>Location: {venue.location}</p>

                <p>Capacity: {venue.capacity}</p>

                <p>Price: ${venue.price}</p>

                {/* perfrom action button */}
                <button
                    onClick={() => onActionClick(venue)}
                    className="bg-[#736CED] text-white px-3 py-2 rounded-lg w-full mt-3 hover:bg-[#5f59d9] transition cursor-pointer"
                >
                    Perform Action
                </button>

            </div>

        </div>
    );
}