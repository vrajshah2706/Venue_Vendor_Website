import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

// Query to fetch all vendors
const GET_ALL_VENDORS = gql`
  query GetAllVendors {
    getAllVendors {
      id
      name
      email
    }
  }
`;

type Venue  = {
  id: number;
  name: string;
  vendor: {
    id: number;
    name: string;
  };
}

type VendorAssignmentModalProps =  {
  venue: Venue;
  onAssign: (vendorId: number) => void;
  onClose: () => void;
}

type GetAllVendorsResponse = {
  getAllVendors: {
    id: number;
    name: string;
    email: string;
  }[];
};

const VendorAssignmentModal = ({venue,onAssign,onClose,}: VendorAssignmentModalProps) => {
  //state
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  // queries
  const { data: vendorData, loading: vendorLoading } = useQuery<GetAllVendorsResponse>(GET_ALL_VENDORS);

  const vendors = vendorData?.getAllVendors || [];
  
  //handlers
  const handleAssign = () => {
    if (selectedVendorId === null) {
      alert("Please select a vendor");
      return;
    }

    if (String(selectedVendorId) === String(venue.vendor.id)) {
      alert("Please select a different vendor");
      return;
    }

    // confirm message before making change
    const selectedVendor = vendors.find((v) => String(v.id) === String(selectedVendorId));
    const confirmMessage = `Are you sure you want to assign "${selectedVendor?.name}" to "${venue.name}"? This will swap the current vendor.`;

    if (confirm(confirmMessage)) {
      onAssign(parseInt(String(selectedVendorId)));

    }
  };

  return (
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Assign Vendor to Venue
        </h2>

        {/* current vendor info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Current Venue:</p>
          <p className="font-semibold text-gray-900">{venue.name}</p>
          <p className="text-sm text-gray-600 mt-3 mb-1">Current Vendor:</p>
          <p className="font-semibold text-gray-900">
            {venue.vendor.name}
          </p>
        </div>

        {/* vendor selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select New Vendor *
          </label>

          {vendorLoading ? (
            <p className="text-gray-500">Loading vendors...</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {vendors.map((vendor: any) => (
                <label
                  key={vendor.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                    selectedVendorId === vendor.id
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="vendor"
                    value={vendor.id}
                    checked={selectedVendorId === vendor.id}
                    onChange={(e) => setSelectedVendorId(e.target.value as any)}
                    disabled={String(vendor.id) === String(venue.vendor.id)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{vendor.name}</p>
                    <p className="text-xs text-gray-600">{vendor.email}</p>
                  </div>
                  {String(vendor.id) === String(venue.vendor.id) && (
                    <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* showing warning*/}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <p className="text-xs text-yellow-800">
             <strong>Note:</strong> This action will swap the vendor for this
            venue. The old vendor will no longer own this venue.
          </p>
        </div>

        {/* action button */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAssign}
            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            Assign Vendor
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default VendorAssignmentModal; 


