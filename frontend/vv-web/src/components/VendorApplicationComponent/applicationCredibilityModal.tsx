"use client";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { Documents } from "@/context/AppContext";

type CredibilityModalProps = {
    hirerID : number; 
    onClose(): void; 
}

export default function CredibilityModal ({hirerID, onClose}: CredibilityModalProps) {

    //storing documents from backend
    const [documents, setDocuments] = useState<Documents | null>(null); 

    //storing score 
    const [score, setScore] = useState(0); 
    //local state for loading
    const [loading, setLoading] = useState(true); 

    //fetching documents 
    const fetchData = async () => {
        
        try {
            //api call to fetch documents 
            const documentsResponse = await axios.get (
                 `http://localhost:3001/users/${hirerID}/documents`
            ); 

            //api call to fetch credibility score
            const scoreResponse = await axios.get(
                `http://localhost:3001/users/${hirerID}/credibility`
            )

            //setting local state
            setDocuments(documentsResponse.data); 

            

            setScore(scoreResponse.data.credibilityScore); 

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    //fetching data upon loading of the modal 
    useEffect( () => {
        fetchData();
    }, [hirerID])

    if(loading) {
        return <p>Loading...</p>
    }

    return (
         <>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-[#FEF9FF] rounded-2xl w-[600px] p-6 shadow-2xl">

                {/* Header */}
               <h2 className="text-2xl font-semibold text-[#736CED] mb-4">
                    Credibility Overview
               </h2>

               {/* displaying score */}
               <div className="bg-white rounded-xl p-4 shadow mb-5 text-center">
                    <p className="text-sm text-black">Credibility Score</p>

                    <p className="text-3xl font-bold text-[#736CED]">
                        {score}%
                    </p>

                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <div
                            className="bg-[#736CED] h-2 rounded-full"
                            style={{ width: `${score}%` }} 
                        />
                    </div>
               </div>

                
               {/* Documents */}
               <div className="space-y-4">
                    {/* Driver License */}
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h3 className="font-semibold text-[#2B0F74] mb-2">Driver's License</h3>
                        {/* shows driver license image when clicking link */}
                        
                        {documents?.driversLicense ? (
                            <a
                                href={`http://localhost:3001${documents.driversLicense}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={`http://localhost:3001${documents.driversLicense}`}
                                    alt="Driver License"
                                    className="h-32 object-contain border rounded cursor-pointer hover:opacity-80 transition"
                                />
                            </a>
                            
                        ) : (
                            <p className="text-gray-500">No document</p>
                        )}

                    </div>

                    {/* Insurance */}
                    <div className="bg-white p-4 rounded-xl shaodw">
                        <h3 className="font-semibold  text-[#2B0F74] mb-2">Insurance Certificate</h3>
                            {/* insurance certificate link*/}
                             {documents?.insuranceCertificate ? (

                            <a
                                href={`http://localhost:3001${documents.insuranceCertificate}`}
                                target="_blank"
                                className="text-blue-500 underline"
                            >
                                View PDF
                            </a>

                            ) : (

                                <p>No document</p>
                            )}

                    </div>

                    {/*if Business is provided then only it will show this cuz not everyone owns a business */}
                    {documents?.isBusiness && (
                        <div className="bg-white p-4 rounded-xl shadow">
                            <h3 className="font-semibold  text-[#2B0F74] mb-2">Business Registration</h3>

                            {documents?.businessRegistration ? (
                                <a
                                    href={`http://localhost:3001${documents.businessRegistration}`}
                                    target="_blank"
                                    className="text-blue-500 underline"
                                >
                                    View PDF
                                </a>
                                ) : (
                                <p className="text-gray-500">No document</p>
                                )}
                        </div>
                    )}
                    
                    
                    {/* close */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="bg-[#736CED] text-white px-4 py-2 rounded hover:bg-purple-700"
                        >
                            Close
                        </button>
                    </div>
               </div>
            </div>
        </div>
        </>

    ); 

}

