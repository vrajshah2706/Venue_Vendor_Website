import React, { useState, useEffect } from "react";
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

type Venue = {
  id?: number;
  name: string;
  location: string;
  capacity: number;
  price: number;
  vendor: {
    id: number;
    name: string;
  };
}

type VenueFormProps = {
  venue?: Venue | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

type GetAllVendorsResponse = {
  getAllVendors: {
    id: number;
    name: string;
    email: string;
  }[];
};

const VenueForm = ({venue,onSubmit,onCancel,}: VenueFormProps) => {
  // form state
  const [formData, setFormData] = useState({
    name: venue?.name || "",
    location: venue?.location || "",
    capacity: venue?.capacity?.toString() || "",
    price: venue?.price?.toString() || "",
    vendorID: venue?.vendor?.id?.toString() || ""
   });

  const [errors, setErrors] = useState<Record<string, string>>({});

  //queries
  const { data: vendorData, loading: vendorLoading } = useQuery<GetAllVendorsResponse>(GET_ALL_VENDORS);
  const vendors = vendorData?.getAllVendors || [];

  // input handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // validating
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Venue name is required";
    if (!formData.location.trim())
      newErrors.location = "Location is required";
    if (!formData.capacity || parseInt(formData.capacity) <= 0)
      newErrors.capacity = "Capacity must be greater than 0";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!formData.vendorID) newErrors.vendorID = "Vendor is required";
    
    if (!venue && !formData.vendorID) 
      newErrors.vendorID = "Vendor is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {venue ? "Edit Venue" : "Create New Venue"}
        </h2>

        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Venue Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter venue name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* location Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter location"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>

          {/* capacity Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.capacity ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter capacity"
            />
            {errors.capacity && (
              <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>
            )}
          </div>

          {/* price Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          {/* vendor Field — only show when creating, not editing */}
          {!venue && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor *
              </label>
              {vendorLoading ? (
                <p className="text-gray-500">Loading vendors...</p>
              ) : (
                <select
                  name="vendorID"
                  value={formData.vendorID}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.vendorID ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a vendor</option>
                  {vendors.map((vendor: any) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.vendorID && (
                <p className="text-red-500 text-xs mt-1">{errors.vendorID}</p>
              )}
            </div>
          )}

          {/* Show current vendor info when editing (read-only) */}
          {venue && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Vendor
              </label>
              <p className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                {venue.vendor?.name || "None"}{" "}
                <span className="text-xs text-gray-400">
                  (use "Vendor" button in table to change)
                </span>
              </p>
            </div>
          )}

          {/* action button */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              {venue ? "Update Venue" : "Create Venue"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default VenueForm;

