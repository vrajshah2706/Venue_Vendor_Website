"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Venue } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";


type Props = {
    venue: Venue;
    onClose: () => void;
    refreshVenues: () => void;
};

export default function VenueActionModal({ venue, onClose, refreshVenues }: Props) {
    const { showToast } = useToast();

    // Edit venue states
    const [name, setName] = useState(venue.name);
    // all available keywords/types
    const [allKeywords, setAllKeywords] = useState<any[]>([]);

    // selected keyword ids
    const [selectedKeywordIDs, setSelectedKeywordIDs] = useState<number[]>(
        venue.venueKeywords?.map(
            (vk: any) => vk.keyword.id
        ) || []
    );

    const [location, setLocation] = useState(venue.location);
    const [capacity, setCapacity] = useState(String(venue.capacity));
    const [price, setPrice] = useState(String(venue.price)); 
    //venue type state
    const [venueTypes, setVenueTypes] = useState<string[]>([]);
       
    // Timeslot states
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    // All unavailable slots
    const [slots, setSlots] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"details" | "schedule">("details");

    // Fetching unavailable slots
    const fetchSlots = async () => {
        try {
            const response =  await axios.get(
                `http://localhost:3001/slots/vendors/venues/${venue.id}/unavailable`
            );
            setSlots(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    // fetch all venue types / keywords
    const fetchKeywords = async () => {

        try {

            const response = await axios.get(
                "http://localhost:3001/venues/keywords/all"
            );

            setAllKeywords(response.data);

        } catch (error) {

            console.log(error);
        }
    }; 

    useEffect(() => {
        fetchSlots();
        fetchKeywords();
    }, []);

   

    // Updating venue
    const handleUpdateVenue = async () => {
        const nameRegex = /^[A-Za-z\s'-]+$/;

        if (!name.trim()) {
        showToast("Venue name is required", "error");
        return;
        }

        if (!nameRegex.test(name)) {
            showToast("Venue name cannot contain numbers or symbols", "error");
            return;
        }

        if (!location.trim()) {
            showToast("Location is required", "error");
            return;
        }

        const capacityNumber = Number(capacity);

        if (capacityNumber < 1) {
            showToast("Capacity must be greater than 0", "error");
            return;
        }

        const priceNumber = Number(price);

        if (priceNumber <= 0) {
            showToast("Price must be greater than 0", "error");
            return;
        }
        setIsLoading(true);
        try {
           await axios.put(
            `http://localhost:3001/venues/${venue.id}`,
                {
                    name,
                    location,
                    capacity: capacityNumber,
                    price: priceNumber,
                    keywordIDs: selectedKeywordIDs,
                }
            );

            showToast("Venue updated successfully", "success");
            refreshVenues();
        } catch (error) {
            console.log(error);
            showToast("Failed to update venue", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Deleting venue
    const handleDeleteVenue = async () => {
        if (!window.confirm("Are you sure you want to delete this venue? This action cannot be undone.")) {
            return;
        }

        setIsLoading(true);
        try {
            await axios.delete(
                `http://localhost:3001/venues/${venue.id}`
            );

            showToast("Venue deleted successfully", "success");
            refreshVenues();
            onClose();
        } catch (error) {
            console.log(error);
            showToast("Failed to delete venue", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Blocking timeslot
    const handleBlockSlot = async () => {
        if (!from || !to) {
            showToast("Please select both start and end times", "error");
            return;
        }

        if (new Date(from) >= new Date(to)) {
            showToast("End time must be after start time", "error");
            return;
        }

        setIsLoading(true);
        try {
            await axios.post(
                `http://localhost:3001/slots/vendors/venues/${venue.id}/unavailable`,
                { from, to }
            );

            showToast("Timeslot blocked", "success");
            setFrom("");
            setTo("");
            fetchSlots();
        } catch (error) {
            console.log(error);
            showToast("Failed to block timeslot", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Unblocking slot
    const handleDeleteSlot = async (slotID: number) => {
        setIsLoading(true);
        try {
            await axios.delete(
                `http://localhost:3001/slots/vendors/unavailable/${slotID}`
            );

            showToast("Timeslot unblocked", "success");
            fetchSlots();
        } catch (error) {
            console.log(error);
            showToast("Failed to unblock slot", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                
                {/* Header */}
                <div className="sticky top-0 bg-[#736CED] px-8 py-6 flex items-center justify-between border-b border-purple-800/20">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1">
                            Manage Venue
                        </h2>
                        
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-light leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b bg-gray-50 px-8">
                    <button
                        onClick={() => setActiveTab("details")}
                        className={`px-6 py-4 font-semibold text-sm transition-all border-b-2 ${
                            activeTab === "details"
                                ? "border-purple-600 text-purple-600 bg-white"
                                : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Venue Details
                    </button>
                    <button
                        onClick={() => setActiveTab("schedule")}
                        className={`px-6 py-4 font-semibold text-sm transition-all border-b-2 ${
                            activeTab === "schedule"
                                ? "border-purple-600 text-purple-600 bg-white"
                                : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Schedule
                    </button>
                </div>

                <div className="p-8 max-h-[65vh] overflow-y-auto">
                    {/* Venue Details Tab */}
                    {activeTab === "details" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Venue Name
                                    </label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Grand Ballroom"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Type */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Venue Type
                                    </label>
                                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
    
                                    {allKeywords.length > 0 ? (
                                        <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                                            <div className="max-h-20 overflow-y-auto">
                                                {allKeywords.map((keyword) => {
                                                    const isSelected = selectedKeywordIDs.includes(keyword.id);
 
                                                    return (
                                                        <label
                                                            key={keyword.id}
                                                            className={`flex items-center gap-3 cursor-pointer px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                                                                isSelected ? "bg-purple-50" : ""
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => {
                                                                    if (isSelected) {
                                                                        setSelectedKeywordIDs((prev) =>
                                                                            prev.filter((id) => id !== keyword.id)
                                                                        );
                                                                    } else {
                                                                        setSelectedKeywordIDs((prev) => [
                                                                            ...prev,
                                                                            keyword.id,
                                                                        ]);
                                                                    }
                                                                }}
                                                                className="w-4 h-4 rounded accent-[#736CED] cursor-pointer"
                                                            />
                                                            <span className={`text-sm ${
                                                                isSelected ? "text-[#736CED] font-semibold" : "text-gray-700"
                                                            }`}>
                                                                {keyword.name}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 text-center text-gray-500">
                                            <p className="text-sm">Loading venue types...</p>
                                        </div>
                                    )}
                                    {selectedKeywordIDs.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            {selectedKeywordIDs.length} type(s) selected
                                        </p>
                                    )}
                                </div>
                            </div>

                                {/* Location */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Location
                                    </label>
                                    <input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g., 123 Main Street, City, State"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Capacity */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Capacity
                                    </label>
                                    <input
                                        type="text"
                                        value={capacity}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                             setCapacity(value.replace(/^0+(?!$)/, ""));
                                        }}
                                        placeholder="Number of guests"
                
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Price */}
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Price per Event
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
                                        <input
                                            type="text"
                                            value={price}
                                            onChange={(e) => {
                                                let value = e.target.value;

                                                // allow digits + one decimal point
                                                value = value.replace(/[^0-9.]/g, "");

                                                // prevent multiple decimals
                                                const parts = value.split(".");
                                                if (parts.length > 2) {
                                                    value = parts[0] + "." + parts.slice(1).join("");
                                                }

                                                // remove leading zeros
                                                if (!value.startsWith("0.")) {
                                                    value = value.replace(/^0+(?!$)/, "");
                                                }

                                                setPrice(value);
                                            }}
                                            placeholder="0.00"
                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="pt-6 border-t">
                                <button
                                    onClick={handleUpdateVenue}
                                    disabled={isLoading}
                                    className="w-full bg-[#736CED] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg   hover:bg-[#5f59d9] transition cursor-pointer"
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Schedule Tab */}
                    {activeTab === "schedule" && (
                        <div className="space-y-6">
                            {/* Block Slot Section */}
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Block New Timeslot
                                </h3>

                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Start Date & Time
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={from}
                                                onChange={(e) => setFrom(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                End Date & Time
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={to}
                                                onChange={(e) => setTo(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleBlockSlot}
                                        disabled={isLoading}
                                        className="w-full bg-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Block Timeslot
                                    </button>
                                </div>
                            </div>

                            {/* Existing Blocked Slots */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Blocked Timeslots ({slots.length})
                                </h3>

                                <div className="space-y-3">
                                    {slots.length === 0 ? (
                                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                                            <p className="text-gray-500 font-medium">
                                                No blocked timeslots
                                            </p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                All time slots are available for booking
                                            </p>
                                        </div>
                                    ) : (
                                        slots.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all flex items-center justify-between group"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-600">
                                                        {new Date(slot.fromDateTime).toLocaleDateString("en-AU", {
                                                            weekday: "short",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </p>
                                                    <p className="text-gray-900 font-semibold mt-1">
                                                        {new Date(slot.fromDateTime).toLocaleTimeString("en-AU", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                        {" — "}
                                                        {new Date(slot.toDateTime).toLocaleTimeString("en-AU", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteSlot(slot.id)}
                                                    disabled={isLoading}
                                                    className="ml-4 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed font-medium text-sm"
                                                    title="Unblock this timeslot"
                                                >
                                                    Unblock
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-8 py-4 flex justify-between items-center">
                    <button
                        onClick={handleDeleteVenue}
                        disabled={isLoading}
                        className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Delete Venue
                    </button>

                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}