import React from "react";

type Venue =  {
  id: number;
  name: string;
  location: string;
  capacity: number;
  price: number;
  isFeatured: boolean;
  vendor: {
    id: number;
    name: string;
    email: string;
  };
}

type VenueTableProps =  {
  venues: Venue[];
  onEditVenue: (venue: Venue) => void;
  onDeleteVenue: (id: number) => void;
  onToggleFeatured: (id: number, currentStatus: boolean) => void;
  onAssignVendor: (venue: Venue) => void;
}

const VenueTable = ({venues,onEditVenue,onDeleteVenue,onToggleFeatured,onAssignVendor,}: VenueTableProps) => {
      return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
            
            <thead className="bg-gray-50">
            <tr>
                {/* checkbox column */}
                
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
                </th>
            </tr>
            </thead>

        
            <tbody className="bg-white divide-y divide-gray-200">
            {venues.map((venue) => (
                <tr key={venue.id} className="hover:bg-gray-50">
                

                {/* name */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                    {venue.name}
                    </div>
                </td>

                {/* location */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{venue.location}</div>
                </td>

                {/* capacity */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{venue.capacity}</div>
                </td>

                {/* price */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                    ${venue.price.toFixed(2)}
                    </div>
                </td>

                {/* vendor */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                    {venue.vendor.name}
                    </div>
                    <div className="text-xs text-gray-400">
                    {venue.vendor.email}
                    </div>
                </td>

                {/* featured Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                    <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        venue.isFeatured
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    >
                    {venue.isFeatured ? "✓ Featured" : "Not Featured"}
                    </span>
                </td>

                {/* actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {/* edit Button */}
                    <button
                    onClick={() => onEditVenue(venue)}
                    className="text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded cursor-pointer "
                    >
                    Edit
                    </button>

                    {/* assign Vendor Button */}
                    <button
                    onClick={() => onAssignVendor(venue)}
                    className="text-purple-600 hover:text-purple-900 bg-purple-50 px-2 py-1 rounded cursor-pointer "
                    >
                    Vendor
                    </button>

                    {/* toggle Featured Button */}
                    <button
                    onClick={() =>
                        onToggleFeatured(venue.id, venue.isFeatured)
                    }
                    className={`px-2 py-1 rounded cursor-pointer  ${
                        venue.isFeatured
                        ? "text-gray-600 hover:text-gray-900 bg-gray-50"
                        : "text-green-600 hover:text-green-900 bg-green-50"
                    }`}
                    >
                    {venue.isFeatured ? "⭐ Unfeature" : "☆ Feature"}
                    </button>

                    {/* delete Button */}
                    <button
                    onClick={() => onDeleteVenue(venue.id)}
                    className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded cursor-pointer "
                    >
                    Delete
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {/* empty State */}
        {venues.length === 0 && (
            <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No venues found</p>
            </div>
        )}
        </div>
    );
};

export default VenueTable; 
