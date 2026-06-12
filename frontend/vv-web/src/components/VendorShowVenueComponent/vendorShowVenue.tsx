"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { useAppContext, Venue } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";

import VendorVenuesCard from "./vendorVenueCard";
import VenueActionModal from "./venueActionModal";
import AddVenueModal from "./addVenueModal";

export default function ShowVendorVenues() {

    const { currentUser } = useAppContext();
    const { showToast } = useToast();

    //all vendor venues
    const [venues, setVenues] = useState<Venue[]>([]);

    //selected venue for modal
    const [selectedVenue, setSelectedVenue] =
        useState<Venue | null>(null);

    //show/hide action modal
    const [showActionModal, setShowActionModal] =
        useState(false);

    //show/hide add venue modal
    const [showAddModal, setShowAddModal] =
        useState(false);

    const vendorID = currentUser?.id;


    //fetching venues from backend
    const fetchVenues = async () => {

        if (!vendorID) return;

        try {

            const response = await axios.get(
                `http://localhost:3001/vendors/${vendorID}/venues`
            );

            console.log("VENUES DATA:", JSON.stringify(response.data, null, 2));

            setVenues(response.data);


        } catch (error) {

            console.log(error);

            showToast("Failed to load venues", "error");
        }
    };


    //runs once when component loads
    useEffect(() => {

        fetchVenues();

    }, [vendorID]);


    return (
        <>
            <div className="bg-[#FEF9FF] rounded-2xl shadow-xl p-4  m-15">

                {/* header */}
                <div className="flex justify-between items-center mb-5">

                    <h2 className="font-semibold text-[#736CED] text-2xl">
                        Your Venues
                    </h2>

                    {/* add venue button */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-[#736CED] text-white px-4 py-2 rounded-lg hover:bg-[#5f59d9] transition cursor-pointer"
                    >
                        + Add Venue
                    </button>

                </div>

                {/* no venues */}
                {venues.length === 0 ? (

                    <p className="text-center font-semibold">
                        No Venues Yet
                    </p>

                ) : (
                     <div className="overflow-x-auto">
                        <div className="flex gap-4 min-w-max">

                            {venues.map((venue) => (

                                <VendorVenuesCard
                                    key={venue.id}
                                    venue={venue}

                                    //opens modal
                                    onActionClick={(venue) => {

                                        setSelectedVenue(venue);

                                        setShowActionModal(true);
                                    }}
                                />

                            ))}

                        </div>
                    </div>

                )}

            </div>


            {/* action modal */}
            {showActionModal && selectedVenue && (

                <VenueActionModal
                    venue={selectedVenue}

                    //close modal
                    onClose={() => setShowActionModal(false)}

                    //refresh venues after CRUD
                    refreshVenues={fetchVenues}
                />

            )}


            {/* add venue modal */}
            {showAddModal && (

                <AddVenueModal
                    vendorID={vendorID!}

                    onClose={() => setShowAddModal(false)}

                    refreshVenues={fetchVenues}
                />

            )}

        </>
    );
}