import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_ALL_VENUES,
  CREATE_VENUE,
  UPDATE_VENUE,
  DELETE_VENUE,
  ASSIGN_VENDOR_TO_VENUE,
  TOGGLE_FEATURED_VENUE,
} from "../graphql/queries";
import VenueTable from "./venueTable";
import VenueForm from "./venueForm";
import VendorAssignmentModal from "./vendorAssignmentModal";
import FeaturedVenuesSelector from "./featuredVenuesSelector";

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
type GetAllVenuesResponse = {
  getAllVenues: Venue[];
};

//component for all venue-related operations

const VenueManagement: React.FC = () => {
  //declaring steates
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [vendorAssignmentVenue, setVendorAssignmentVenue] = useState<Venue | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  //queries 
  const { data, loading, error, refetch } = useQuery<GetAllVenuesResponse>(GET_ALL_VENUES, {
    fetchPolicy: "network-only"
  });
  const venues: Venue[] = data?.getAllVenues || [];

  //mutations
  const [createVenue] = useMutation(CREATE_VENUE, {
    onCompleted: async () => {
      await refetch();
      setShowCreateForm(false);
    },
    
    refetchQueries: [{ query: GET_ALL_VENUES }],
    awaitRefetchQueries: true,
  });


  const [updateVenue] = useMutation(UPDATE_VENUE, {
  onCompleted: () => {
    refetch();
    setEditingVenue(null);
  },

  onError: (error) => {
    console.error("UPDATE VENUE ERROR");
    console.error(error);
    console.error(error.message);
  }
});

  const [deleteVenue] = useMutation(DELETE_VENUE, {
    onCompleted: () => refetch()
  });

  const [assignVendor] = useMutation(ASSIGN_VENDOR_TO_VENUE, {
    onCompleted: () => {
      refetch();
      setVendorAssignmentVenue(null);
    }
  });

  const [toggleFeatured] = useMutation(TOGGLE_FEATURED_VENUE, {
    onCompleted: () => refetch()
  });


  // filtered venues
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = filterLocation
        ? venue.location === filterLocation
        : true;
      return matchesSearch && matchesLocation;
    });
  }, [venues, searchTerm, filterLocation]);

  //unique location for filter
  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(venues.map((v) => v.location)));
  }, [venues]);

  //handles creating venues and others 
  const handleCreateVenue = async (formData: any) => {
    await createVenue({
      variables: {
        ...formData,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
        vendorID: parseInt(formData.vendorID)
      }
    });
  };

  const handleUpdateVenue = async (formData: any) => {
    if (!editingVenue) return;
    await updateVenue({
      variables: {
        id: parseInt(String(editingVenue.id)), 
        name: formData.name || undefined,
        location: formData.location || undefined,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined
      }
    });
  };

  const handleDeleteVenue = (id: number) => {
    if (confirm("Are you sure you want to delete this venue?")) {
      deleteVenue({ variables: { id: parseInt(String(id)) } });
    }
  };

  const handleToggleFeatured = async (venueId: number, currentStatus: boolean) => {
    await toggleFeatured({
      variables: {
        venueID: parseInt(String(venueId)),
        isFeatured: !currentStatus
      }
    });
  };

  

 

  // errors states and loadin g
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading venues: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Venues</h2>
          <p className="text-gray-600 mt-1">
            {filteredVenues.length} venue(s) found
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          + Add New Venue
        </button>
      </div>

      {/* filter section*/}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* search by name */}
          <input
            type="text"
            placeholder="Search by venue name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* filter by location */}
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>


       

      {/* venues table*/}
      <VenueTable
        venues={filteredVenues}
        onEditVenue={setEditingVenue}
        onDeleteVenue={handleDeleteVenue}
        onToggleFeatured={handleToggleFeatured}
        onAssignVendor={setVendorAssignmentVenue}
      />

    

      {/* Create/Edit Venue Modal */}
      {(showCreateForm || editingVenue) && (
        <VenueForm
          venue={editingVenue}
          onSubmit={editingVenue ? handleUpdateVenue : handleCreateVenue}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingVenue(null);
          }}
        />
      )}

      {/* Vendor Assignment Modal */}
      {vendorAssignmentVenue && (
        <VendorAssignmentModal
          venue={vendorAssignmentVenue}
          onAssign={(vendorId) => {
            assignVendor({
              variables: {
                venueID: parseInt(String(vendorAssignmentVenue.id)),
                vendorID: parseInt(String(vendorId))
              }
            });
          }}
          onClose={() => setVendorAssignmentVenue(null)}
        />
      )}
    </div>
  );
};

export default VenueManagement;