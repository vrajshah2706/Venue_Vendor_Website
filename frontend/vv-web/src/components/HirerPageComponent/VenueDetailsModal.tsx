import { useState } from "react";
import { Venue, Vendor } from "@/context/AppContext";
import PreferenceModal from "../PreferenceListComponent/preferenceModal";

// Props interface for VenueDetailsModal component
type VenueDetailsModalProps = {
  venue: Venue;
  vendor?: Vendor;
  onClose: () => void;
  onApply: () => void;
  onAddPreference: (venue: Venue, rank: number) => void;
  existingPreferenceRank?: number;
};

// VenueDetailsModal component displays detailed information about a venue in a modal dialog
export default function VenueDetailsModal(props: VenueDetailsModalProps) {
  const {
    venue,
    vendor,
    onClose,
    onApply,
    onAddPreference,
    existingPreferenceRank,
  } = props;

  // State to control the visibility of the preference modal
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);

  // Determine if the venue is live based on its status
  const isLive = !!venue.isActive; 
  // Get the supplier name from vendor or default to "Unknown Supplier"
  const supplierName = vendor?.name || "Unknown Supplier";

  // Handler to save preference with the selected rank
  const handleSavePreference = (rank: number) => {
    onAddPreference(venue, rank);
    setShowPreferenceModal(false);
  };

  // Handler to open the preference modal
  const handleOpenPreferenceModal = () => {
    setShowPreferenceModal(true);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
          {/* Image section with close button */}
        <div className="relative">
          <img
            src={venue.image}
            alt={venue.name}
            className="h-72 w-full object-cover"
          />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-[#2B0F74] shadow-sm transition hover:bg-[#f5f3ff]"
            aria-label="Close venue details"
          >
            ×
          </button>
        </div>

        {/* Main content section with venue details */}
        <div className="space-y-6 p-6">
          {/* Venue name, type, location, and live status */}
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-[#2B0F74]">
                {venue.name}
              </h2>
              <p className="mt-1 text-sm text-[#6B6B8D]">
                {venue.type} • {venue.location}
              </p>
            </div>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                isLive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isLive ? "Live" : "Not Live"}
            </span>
          </div>

          {/* Grid displaying venue details like capacity, price, supplier, etc. */}
          <div className="grid gap-4 text-sm text-[#4B4B6B] sm:grid-cols-2">
            <div>
              <p className="font-semibold text-[#2B0F74]">Capacity</p>
              <p>{venue.capacity}</p>
            </div>

            <div>
              <p className="font-semibold text-[#2B0F74]">Price</p>
              <p>
                {typeof venue.price === "number"
                  ? `$${venue.price.toLocaleString()}`
                  : "Price unavailable"}
              </p>
            </div>

            <div>
              <p className="font-semibold text-[#2B0F74]">Supplier</p>
              <p>{supplierName}</p>
            </div>

            <div>
              <p className="font-semibold text-[#2B0F74]">Venue ID</p>
              <p>{venue.id}</p>
            </div>

            <div>
              <p className="font-semibold text-[#2B0F74]">Vendor ID</p>
              <p>{venue.vendor.id}</p>
            </div>
          </div>

          {/* Description text explaining the venue and usage */}
          <div className="text-sm leading-6 text-[#4B4B6B]">
            <p>
              This venue can be booked for your event. Review the details here,
              then click the button below to apply for this venue.
            </p>

            <p className="mt-4 text-[#6B6B8D]">
              You can also use the search filters in the sidebar to narrow
              venues by location and type.
            </p>
          </div>

          {/* Action buttons: Add to preference, Close, Apply */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleOpenPreferenceModal}
              className="w-full rounded-2xl border border-[#D4C1EC] bg-[#F7F5FF] px-5 py-3 text-sm font-semibold text-[#2B0F74] transition hover:bg-[#EDEBFF] sm:w-auto"
            >
              {existingPreferenceRank
                ? "Update preference rank"
                : "Add to preference list"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-[#D4C1EC] bg-white px-5 py-3 text-sm font-semibold text-[#2B0F74] transition hover:bg-[#F7F5FF] sm:w-auto"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onApply()}
              className="w-full rounded-2xl bg-[#736CED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6259d9] sm:w-auto"
            >
              Apply for this venue
            </button>
          </div>

          {/* Conditionally render the preference modal */}
          {showPreferenceModal ? (
            <PreferenceModal
              venue={venue}
              onClose={() => setShowPreferenceModal(false)}
              onSave={handleSavePreference}
              initialRank={existingPreferenceRank}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
