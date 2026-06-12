"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/context/ToastContext";

type AddVenueModalProps = {
    vendorID: number;
    onClose: () => void;
    refreshVenues: () => void;
};

export default function AddVenueModal({vendorID,onClose,refreshVenues}: AddVenueModalProps) {

    const { showToast } = useToast();

    // Form states
    const [name, setName] = useState("");
    // all available keywords
    const [allKeywords, setAllKeywords] = useState<any[]>([]);

    // selected keyword ids
    const [selectedKeywordIDs, setSelectedKeywordIDs] = useState<number[]>([]);
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");
    const [price, setPrice] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    
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

    // Creating venue
    const handleCreateVenue = async () => {
        

        // Validation
        if (!name.trim()) {
            showToast("Please enter a venue name", "error");
            return;
        }
        const nameRegex = /^[A-Za-z\s'-]+$/;

        if (!nameRegex.test(name)) {
            showToast("Venue name cannot contain numbers or symbols", "error");
            return;
        }

        if (selectedKeywordIDs.length === 0) {
            showToast("Please select at least one venue type", "error");
            return;
        }
        if (!location.trim()) {
            showToast("Please enter a location", "error");
            return;
        }
        if (!capacity || Number(capacity) < 1) {
            showToast("Please enter a valid capacity", "error");
            return;
        }
        if (!price || Number(price) <= 0) {
            showToast("Please enter a valid price", "error");
            return;
        }
        if (!imageFile) {
            showToast("Please upload an image", "error");
            return;
        }
        //png only image 
        if (imageFile && imageFile.type !== "image/png") {
            showToast("Only PNG images are allowed", "error");
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();

            formData.append("vendorID", String(vendorID));
            formData.append("name", name);
            formData.append("location", location);
            formData.append("capacity", String(Number(capacity)));
            formData.append("price", String(Number(price)));
            formData.append("keywordIDs", JSON.stringify(selectedKeywordIDs));

            if (imageFile) {
                formData.append("image", imageFile);
            }

            await axios.post("http://localhost:3001/venues", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            showToast("Venue created successfully", "success");

            // Refreshing UI
            refreshVenues();

            // Closing modal
            onClose();

        } catch (error) {
            console.log(error);
            showToast("Failed to create venue", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKeywords();
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className=" px-8 py-6 bg-[#736CED] flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-white">
                        Add New Venue
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white text-2xl font-light leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-8 space-y-4">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Venue Name
                        </label>
                        <input
                            type="text"
                            placeholder="Grand Ballroom"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Venue Type */}
                    <div>

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Type
                        </label>

                        <div className="space-y-2">

                            {allKeywords.length > 0 ? (

                                <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">

                                    <div className="max-h-40 overflow-y-auto">

                                        {allKeywords.map((keyword) => {

                                            const isSelected =
                                                selectedKeywordIDs.includes(keyword.id);

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
                                                                    prev.filter(
                                                                        (id) => id !== keyword.id
                                                                    )
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

                                                    <span
                                                        className={`text-sm ${
                                                            isSelected
                                                                ? "text-[#736CED] font-semibold"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        {keyword.name}
                                                    </span>

                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                            ) : (

                                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 text-center text-gray-500">

                                    <p className="text-sm">
                                        Loading venue types...
                                    </p>

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
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            placeholder="123 Main Street,City, State"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Capacity */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Capacity
                        </label>
                        <input
                            type="number"
                            placeholder="Number of guests"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            min="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Price per Event
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                min="0"
                                step="0.01"
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Image URL 
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setImageFile(e.target.files[0]);
                                }
                            }}
                            className="w-full px-4 py-3 border rounded-lg"
                        />
                    </div>

                </div>

                {/* Footer Buttons */}
                <div className="border-t bg-white px-8 py-4 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleCreateVenue}
                        disabled={isLoading}
                        className="px-6 py-3 bg-[#736CED] text-white rounded-lg font-semibold hover:shadow-lg  hover:bg-[#5f59d9] transition cursor-pointer "
                    >
                        {isLoading ? "Creating..." : "Create Venue"}
                    </button>
                </div>

            </div>
        </div>
    );
}