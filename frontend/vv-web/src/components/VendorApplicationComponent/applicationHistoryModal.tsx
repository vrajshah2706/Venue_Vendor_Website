"use client";
import { useEffect, useState } from "react";
import { PreviousHire } from "@/context/AppContext";
import axios from "axios";

type HistoryModalProps = {
    hirerID : number;
    onClose(): void; 
};

export default function HistoryModal( {hirerID, onClose}: HistoryModalProps) {

    //state for storing history fetched from backend
    const [history, setHistory] = useState<PreviousHire[]>([]); 

    //loading state
    const [loading, setLoading] = useState(true); 

    //fetching history 
    const fetchHistory = async () => {

        try {
            //api call
            const response = await axios.get(
                `http://localhost:3001/users/${hirerID}/history`
            ); 

            //putting it into local state 
            setHistory(response.data); 

        } catch (error ) {
            console.log(error);
        } finally {
            setLoading(false); 

        }
    };

    //fetching when modal opens 
    useEffect( () => {
        fetchHistory();
    }, [hirerID]);

    //summary calculations 
    const totalEvents = history.length;

    const uniqueLocations = new Set (
        history.map(h => h.venue?.location)
    ).size; 

    const avgRating = totalEvents === 0 ? 0 : 
        ( history.reduce((sum, h) => sum + h.rating, 0) / totalEvents
    ).toFixed(1);

    return (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

            {/* Box */}
            <div className="bg-[#FEF9FF] rounded-2xl p-6 w-[700px] shadow-2xl">

                <h2 className="text-2xl font-semibold text-[#736CED] mb-4">
                    Hirer History
                </h2>

                {loading ? (

                    <p>Loading...</p>

                ) : (

                    <div className="overflow-x-auto">
                         {/* table */}
                        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">

                            <thead className="bg-[#736CED] text-white">
                                <tr>
                                    <th className="p-3 text-center">Venue</th>
                                    <th className="p-3 text-center">Location</th>
                                    <th className="p-3 text-center">Event</th>
                                    <th className="p-3 text-center">Date</th>
                                    <th className="p-3 text-center">Rating</th>
                                </tr>
                            </thead>
                              {/* body of the history table. */}
                            <tbody>

                                {history.length === 0 ? (

                                    <tr>
                                        <td colSpan={5} className="text-center p-5">
                                            No history available
                                        </td>
                                    </tr>

                                ) : (

                                    history.map((h) => {

                                        const date = new Date(h.date);

                                        return (
                                            <tr
                                                key={h.id}
                                                className="border-t hover:bg-gray-200"
                                            >

                                                <td className="p-3 text-center">
                                                    {h.venue?.name}
                                                </td>

                                                <td className="p-3 text-center">
                                                    {h.venue?.location}
                                                </td>

                                                <td className="p-3 text-center">
                                                    {h.eventName}
                                                </td>

                                                <td className="p-3 text-center">
                                                    {date.toLocaleDateString("en-AU")}
                                                </td>

                                                <td className="p-3 text-center">
                                                    {"⭐".repeat(Math.round(h.rating))}
                                                </td>

                                            </tr>
                                        );
                                    })
                                )}

                                {/* Summary Row */}
                                {history.length > 0 && (
                                    <tr className="bg-gray-100 font-semibold">

                                        <td colSpan={5} className="p-3">

                                            <div className="grid grid-cols-3 text-center">

                                                <span>
                                                    Total Events: {totalEvents}
                                                </span>

                                                <span>
                                                    Unique Locations: {uniqueLocations}
                                                </span>

                                                <span>
                                                    Avg Rating: {avgRating}
                                                </span>

                                            </div>

                                        </td>

                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

                {/* Close Button */}
                <div className="flex justify-end mt-4">

                    <button
                        onClick={onClose}
                        className="bg-[#736CED] text-white px-4 py-2 rounded"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
        </>
    );
        

    
}