"use client"; 
import { useEffect, useState } from "react";
import axios from "axios";
import { HirerProfileForm } from "@/components/HirerEditProfileComponent/hirerProfileForm";
import { DocumentUpload } from "@/components/HirerEditProfileComponent/documentUpload";
import CredibilityScoreDisplay from "@/components/HirerEditProfileComponent/credibilityScoreDisplay";
import { useAppContext } from "@/context/AppContext";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function HirerProfilePage() {
    //using current user from context 
    const {currentUser} = useAppContext();

    //checking tole 
    const isHirer = currentUser?.role === "hirer"; 

    //local state for storing backened data. 
    const [hirer, setHirer] = useState<any>(null); 
    const [documents, setDocuments] = useState<any>(null); 
    const [bookingHistory, setBookingHistory] = useState<any[]>([]);
    const [scoreRefreshKey, setScoreRefreshKey] = useState(0);
    //loading statr
    const[loading , setLoading] = useState(true); 

    //fetching all hirer related data
    const fetchProfileData = async () => {
        try{
            //fetching hirer profile
            const hirerReponse = await axios.get(
                `http://localhost:3001/users/${currentUser?.id}`
            );

            //fetching upload documents
             const documentsResponse = await axios.get(
                  `http://localhost:3001/users/${currentUser?.id}/documents`
             );

             //fetching booking history
             const historyResponse = await axios.get(
                 `http://localhost:3001/users/${currentUser?.id}/history`
             );

             //setting state
             setHirer(hirerReponse.data);
             setDocuments(documentsResponse.data);
             setBookingHistory(historyResponse.data);


        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);

        }

    };
    //fetching on mount
    useEffect( () => {
        if(currentUser?.id) {
            fetchProfileData(); 
        }
    }, [currentUser]);

    return (
       <>
        <div className="min-h-screen bg-[#F7F5FF] flex flex-col overflow-x-hidden">
            <Header/>
                <main className="flex-grow max-w-5xl mx-auto px-6 pt-24 pb-10 space-y-8 w-full">

                    {/* authentication check */}
                        {!isHirer ? (
                        <div className="flex items-center justify-center min-h-[60vh] text-red-600 font-semibold text-lg text-center">
                            Unauthorized access
                        </div>
                        ) : loading ? (

                        <div className="flex items-center justify-center min-h-[60vh] text-gray-600">
                            Loading profile...
                        </div>

                        ) : !hirer ? (
                        <div className="flex items-center justify-center min-h-[60vh] text-gray-600">
                            Loading profile...
                        </div>
                        ) : (
                        <>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                            <h1 className="text-xl font-bold text-[#3B22A1]">
                                Profile Settings
                            </h1>
                            </div>

                            <HirerProfileForm hirer={hirer} />
                            <DocumentUpload hirerID={hirer.id} existingDocs={documents} refreshDocuments={async () => {
                                await fetchProfileData();
                                setScoreRefreshKey(prev => prev + 1);
                            }} />
                            <CredibilityScoreDisplay hirerID={hirer.id} refreshKey={scoreRefreshKey}/>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                                <h2 className="text-xl font-semibold text-[#3B22A1]">Booking History</h2>
                                {bookingHistory.length === 0 ? (
                                    <p className="text-gray-600">No booking history available yet.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                                            <thead className="bg-[#F7F5FF]">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium text-[#2B0F74]">Event</th>
                                                    <th className="px-4 py-3 font-medium text-[#2B0F74]">Venue</th>
                                                    <th className="px-4 py-3 font-medium text-[#2B0F74]">Location</th>
                                                    <th className="px-4 py-3 font-medium text-[#2B0F74]">Date</th>
                                                    <th className="px-4 py-3 font-medium text-[#2B0F74]">Rating</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {bookingHistory.map((hire) => {
                        
                                                    return (
                                                        <tr key={hire.id}>
                                                            <td className="px-4 py-3 text-gray-700">{hire.eventName}</td>
                                                            <td className="px-4 py-3 text-gray-700">{hire.venue?.name ?? "Unknown"}</td>
                                                            <td className="px-4 py-3 text-gray-700">{hire.venue?.location ?? "Unknown"}</td>
                                                            <td className="px-4 py-3 text-gray-700">{new Date(hire.date).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}</td>
                                                            <td className="px-4 py-3 text-gray-700">{"⭐".repeat(hire.rating)}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                        )}

                </main>

            <Footer/>
        </div>
        </>
    )
}
