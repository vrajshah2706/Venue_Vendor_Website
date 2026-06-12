"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";
import FilterSidebar from "@/components/HirerPageComponent/FilterSidebar";
import VenueDetailsModal from "@/components/HirerPageComponent/VenueDetailsModal";
import HirerVenueCard from "@/components/HirerPageComponent/hirerVenueCard";
import PreferenceList from "@/components/PreferenceListComponent/PreferenceList";
import VenueApplicationForm from "@/components/HirerApplicationComponent/VenueApplicationForm";
import FeaturedVenues from "@/components/FeaturedVenues";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type ApiVendor = {
  id: number;
  name: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
};

export type ApiVenue = {
  id: number;
  name: string;
  type: string;
  location: string;
  capacity: number;
  price: number;
  image: string;
  vendorID?: number;
  vendorId?: number;
  vendor?: ApiVendor;
  venueKeywords?: Array<{
    keyword?: {
      id?: number;
      name?: string;
    };
  }>;
};

type Preference = {
  id: number;
  hirer?: { id: number };
  hirerID?: number;
  venue?: ApiVenue;
  venueID?: number;
  rank: number;
  addedAt: string;
};

type UnavailableSlot = {
  id: number;
  venueID?: number;
  venueId?: number;
  venue?: { id: number };
  from?: string;
  to?: string;
  fromDateTime?: string;
  toDateTime?: string;
};

type ApplicationFormData = {
  eventName: string;
  eventType: string;
  dateTime: string;
  people: number;
  duration: number;
  comment: string;
};


const normaliseVenue = (rawVenue: any): ApiVenue => {
  const keywordType = rawVenue?.venueKeywords?.[0]?.keyword?.name;
  const vendor = rawVenue?.vendor;

  return {
    ...rawVenue,
    type: rawVenue?.type || keywordType || "General",
    price: Number(rawVenue?.price ?? 0),
    vendorID: rawVenue?.vendorID ?? rawVenue?.vendorId ?? vendor?.id,
    vendor,
  };
};

export default function Hirer() {
  const { currentUser } = useAppContext();
  const { showToast } = useToast();

  const [venues, setVenues] = useState<ApiVenue[]>([]);
  const [vendors, setVendors] = useState<ApiVendor[]>([]);
  const [unavailableSlots, setUnavailableSlots] = useState<UnavailableSlot[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [refreshPreferences, setRefreshPreferences] = useState(0);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<ApiVenue | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showApplySuccess, setShowApplySuccess] = useState(false);
  const [showPreferencePopup, setShowPreferencePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [featuredVenues, setFeaturedVenues] = useState<ApiVenue[]>([]);


  // Fetch venues and unavailable slots
  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch all venues
        const venuesResponse = await axios.get(`${API_BASE_URL}/venues`);
        const normalisedVenues = Array.isArray(venuesResponse.data)
          ? venuesResponse.data.map(normaliseVenue)
          : [];

        setVenues(normalisedVenues);

        const featured = normalisedVenues.filter((v: ApiVenue) => (v as any).isFeatured);
        setFeaturedVenues(featured);

        // Extract unique vendors
        const vendorsFromVenues = normalisedVenues
          .map((venue) => venue.vendor)
          .filter(Boolean) as ApiVendor[];

        const uniqueVendors = Array.from(
          new Map(vendorsFromVenues.map((vendor) => [vendor.id, vendor])).values()
        );

        setVendors(uniqueVendors);

        // Fetch unavailable slots from correct endpoint
        try {
          const slotsResponse = await axios.get(`${API_BASE_URL}/slots/unavailable-slots`);
          setUnavailableSlots(Array.isArray(slotsResponse.data) ? slotsResponse.data : []);
        } catch {
          setUnavailableSlots([]);
        }
      } catch (err) {
        console.log(err);
        setError("Failed to load venues from the backend.");
        showToast("Failed to load venues from the backend", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, []);

  // Fetch preferences from backend when user logs in
  useEffect(() => {
    if (!currentUser?.id || currentUser.role !== "hirer") {
      setPreferences([]);
      return;
    }

    const fetchPreferences = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/hirer/${currentUser.id}/preferences`
        );
        setPreferences(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.log(err);
        setPreferences([]);
      }
    };

    fetchPreferences();
  }, [currentUser?.id, currentUser?.role,refreshPreferences ]);

  

  const locations = useMemo(
    () => Array.from(new Set(venues.map((venue) => venue.location).filter(Boolean))),
    [venues]
  );

  const eventTypes = useMemo(
    () => Array.from(new Set(venues.map((venue) => venue.type).filter(Boolean))),
    [venues]
  );

  const capacityOptions = useMemo(
    () => Array.from(new Set(venues.map((venue) => venue.capacity))).sort((a, b) => a - b),
    [venues]
  );

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const matchesLocation = selectedLocation ? venue.location === selectedLocation : true;
      const matchesType = selectedType ? venue.type === selectedType : true;
      const matchesCapacity = selectedCapacity ? venue.capacity >= Number(selectedCapacity) : true;
      const matchesSearch = searchQuery
        ? venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.type.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchesLocation && matchesType && matchesCapacity && matchesSearch;
    });
  }, [venues, selectedLocation, selectedType, selectedCapacity, searchQuery]);

  const hirerPreferences = useMemo(
    () => preferences.sort((a, b) => a.rank - b.rank),
    [preferences]
  );

  const clearFilters = () => {
    setSelectedLocation("");
    setSelectedType("");
    setSelectedCapacity("");
    setSearchQuery("");
  };

  const openVenueDetails = (venue: ApiVenue) => {
    setSelectedVenue(venue);
  };

  const closeVenueDetails = () => {
    setSelectedVenue(null);
  };

  const openApplicationForm = () => {
    if (!currentUser) {
      showToast("Please sign in before applying for a venue", "error");
      window.location.href = "/SignIn";
      return;
    }

    if (currentUser.role !== "hirer") {
      showToast("Only hirers can submit venue applications", "error");
      return;
    }

    setShowApplicationForm(true);
  };

  const closeApplicationForm = () => {
    setShowApplicationForm(false);
  };

  const submitApplication = async (applicationData: ApplicationFormData) => {
    if (!currentUser || currentUser.role !== "hirer" || !selectedVenue) {
      showToast("Please sign in as a hirer before submitting an application", "error");
      return;
    }

    try {
      setSubmitting(true);

      //Convert input times
      const eventStart = new Date(applicationData.dateTime);
      const eventEnd = new Date(
        eventStart.getTime() + Number(applicationData.duration) * 60000
      );

      //Filter only slots for this venue
      const venueSlots = unavailableSlots.filter((slot) => {
        const slotVenueId = slot.venueID ?? slot.venueId ?? slot.venue?.id;
        return slotVenueId === selectedVenue.id;
      });

      // Check overlap
      const isBlocked = venueSlots.some((slot) => {
        const slotStart = new Date(slot.from ?? slot.fromDateTime!);
        const slotEnd = new Date(slot.to ?? slot.toDateTime!);

        if (isNaN(slotStart.getTime()) || isNaN(slotEnd.getTime())) {
          return false;
        }

        return eventStart < slotEnd && eventEnd > slotStart;
      });

      //  STOP if blocked
      if (isBlocked) {
        showToast("The venue is blocked for that time slot", "error");
        setSubmitting(false);
        return;
      }

      // Proceed only if valid
      await axios.post(`${API_BASE_URL}/venues/applications`, {
        hirerID: currentUser.id,
        venueID: selectedVenue.id,
        numberOfGuests: Number(applicationData.people),
        startDateTime: applicationData.dateTime,
        duration: Number(applicationData.duration),
        comment: applicationData.comment,
      });

      setShowApplicationForm(false);
      setShowApplySuccess(true);
      setSelectedVenue(null);
      showToast("Your application has been submitted", "success");
      setTimeout(() => setShowApplySuccess(false), 2500);

    } catch (err: any) {
      console.log(err);
      const message =
        err?.response?.data?.message || "Failed to submit application";
      showToast(message, "error");

    } finally {
      setSubmitting(false);
    }
  };
  const selectedVenueOwner = selectedVenue
    ? vendors.find((vendor) => vendor.id === selectedVenue.vendorID) || selectedVenue.vendor
    : undefined;

  const selectedVenuePreference = selectedVenue && currentUser
    ? preferences.find((preference) => preference.venueID === selectedVenue.id)
    : undefined;

  //handles adding preferences 
  const handleAddPreference = async (venue: ApiVenue, rank: number) => {
    if (!currentUser || currentUser.role !== "hirer") {
      showToast("Please sign in as a hirer", "error");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/preferences`, {
        hirerID: currentUser.id,
        venueID: venue.id,
        rank,
      });

      const savedPreference = response.data.preference;
      setRefreshPreferences((prev) => prev + 1);
      
      setPreferences((prev) => {
        const index = prev.findIndex((p) => p.venueID === venue.id);

        const updated = [...prev];

        if (index !== -1) {
          updated[index] = savedPreference;
        } else {
          updated.push(savedPreference);
        }

        return updated;
      }
      
    
    );

      showToast("Preference saved", "success");
    } catch (err) {
      console.log(err);
      showToast("Failed to save preference", "error");
    }
  };

  const handleRemovePreference = async (preferenceId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/preferences/${preferenceId}`);
      setPreferences((prev) => prev.filter((preference) => preference.id !== preferenceId));
      showToast("Preference removed", "success");
    } catch (err) {
      console.log(err);
      showToast("Failed to remove preference", "error");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F7F5FF] overflow-x-hidden">
        <Header />
        <main className="flex-grow max-w-full mx-auto px-4 sm:px-6 xl:px-6 pt-24 pb-10 overflow-x-hidden">
          <div className="block xl:hidden mb-6">
            <FilterSidebar
              locations={locations}
              eventTypes={eventTypes}
              capacityOptions={capacityOptions}
              selectedLocation={selectedLocation}
              selectedType={selectedType}
              selectedCapacity={selectedCapacity}
              searchQuery={searchQuery}
              onLocationChange={setSelectedLocation}
              onTypeChange={setSelectedType}
              onCapacityChange={setSelectedCapacity}
              onSearchChange={setSearchQuery}
              onClear={clearFilters}
            />
          </div>

          <div className="xl:grid xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-6">
            <div className="hidden xl:block self-start">
              <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
                <FilterSidebar
                  locations={locations}
                  eventTypes={eventTypes}
                  capacityOptions={capacityOptions}
                  selectedLocation={selectedLocation}
                  selectedType={selectedType}
                  selectedCapacity={selectedCapacity}
                  searchQuery={searchQuery}
                  onLocationChange={setSelectedLocation}
                  onTypeChange={setSelectedType}
                  onCapacityChange={setSelectedCapacity}
                  onSearchChange={setSearchQuery}
                  onClear={clearFilters}
                  className="h-full"
                />
              </div>
            </div>

            <div className="w-full">
              <section className="space-y-6 w-full">
                <div className="rounded-[28px] border border-[#E8E5F8] bg-white p-6">
                  <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#6B6B8D]">Suppliers</p>
                      <h1 className="text-3xl font-bold text-[#2B0F74]">Browse supplier venues</h1>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPreferencePopup(true)}
                      className="inline-flex items-center justify-center rounded-2xl border border-[#736CED] bg-[#736CED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6259d9]"
                    >
                      My Preferences ({hirerPreferences.length})
                    </button>
                  </div>
                </div>

                 <FeaturedVenues
                    venues={featuredVenues}
                    vendors={vendors}
                    onViewDetails={openVenueDetails}
                  />

                {loading ? (
                  <div className="rounded-[28px] border border-[#E8E5F8] bg-white p-8 text-center text-[#6B6B8D]">
                    Loading venues...
                  </div>
                ) : error ? (
                  <div className="rounded-[28px] border border-red-100 bg-white p-8 text-center text-red-600">
                    {error}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredVenues.length === 0 ? (
                      <div className="rounded-[28px] border border-[#E8E5F8] bg-white p-8 text-center text-[#6B6B8D]">
                        No venues match your filters. Try a different location or event type.
                      </div>
                    ) : (
                      filteredVenues.map((venue) => {
                        const owner = vendors.find((vendor) => vendor.id === venue.vendorID) || venue.vendor;
                        return (
                          <HirerVenueCard
                            key={venue.id}
                            venue={venue as any}
                            vendor={owner as any}
                            onViewDetails={() => openVenueDetails(venue)}
                          />
                        );
                      })
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>

        {selectedVenue && !showApplicationForm && (
          <VenueDetailsModal
            venue={selectedVenue as any}
            vendor={selectedVenueOwner as any}
            onClose={closeVenueDetails}
            onApply={openApplicationForm}
            onAddPreference={handleAddPreference as any}
            existingPreferenceRank={selectedVenuePreference?.rank}
          />
        )}

        {showApplicationForm && selectedVenue && (
          <VenueApplicationForm
            venue={selectedVenue as any}
            vendor={selectedVenueOwner as any}
            unavailableSlots={unavailableSlots as any}
            onClose={closeApplicationForm}
            onSubmit={submitApplication as any}
          />
        )}

        {submitting && (
          <div className="fixed bottom-20 right-6 z-50 rounded-2xl bg-white px-5 py-3 shadow-xl border text-sm text-[#2B0F74]">
            Submitting application...
          </div>
        )}

        {showApplySuccess && (
          <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-white px-5 py-3 shadow-xl border text-sm text-[#2B0F74]">
            Your application has been submitted.
          </div>
        )}

        {showPreferencePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
            <div className="w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E8E5F8] p-6">
                <div>
                  <p className="text-sm font-medium text-[#6B6B8D]">Preference list</p>
                  <h2 className="text-2xl font-semibold text-[#2B0F74]">Your saved venue preferences</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreferencePopup(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F2F0FF] text-xl text-[#2B0F74] transition hover:bg-[#E9E6FF]"
                  aria-label="Close preference list"
                >
                  ×
                </button>
              </div>
              <div className="max-h-[80vh] overflow-y-auto p-6">
                <PreferenceList
                  preferences={hirerPreferences as any}
                  venues={venues as any}
                  vendors={vendors as any}
                  onViewVenue={(venue: ApiVenue) => {
                    openVenueDetails(venue);
                    setShowPreferencePopup(false);
                  }}
                  onRemovePreference={handleRemovePreference}
                />
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}