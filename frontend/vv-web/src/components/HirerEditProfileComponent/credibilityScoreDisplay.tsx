import { useEffect, useState } from "react";
import axios from "axios"; 

type CredibilityScoreDisplayProps = {
    hirerID: number;
    refreshKey: number;
};

export default function CredibilityScoreDisplay ( {hirerID, refreshKey} : CredibilityScoreDisplayProps) {
    //local statr for storing score from backend
    const[score, setScore] = useState<number>(0); 

    //fetching credibility score from backend 
    const fetchCredibilityScore = async () => {

        try{
            //getting data thru API
            const response = await axios.get(
                `http://localhost:3001/users/${hirerID}/credibility`
            );

            //setting backend score
            setScore(response.data.credibilityScore);

        } catch(error) {
            console.log(error);
        }

        
    }

    //fetching on component mount
    useEffect(() => {
        if (hirerID) {
            fetchCredibilityScore();
        }
    }, [hirerID, refreshKey]);

    return (
        <>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-xl text-[#3B22A1] font-semibold ">
                Credibility Score
            </h2>
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#736CED]/10 flex items-center justify-center text-[#736CED] font-bold text-lg">
                {score}%
            </div>
        </div>
            <div className="text-sm text-gray-500">
                <p>Click On "Save Document" to Update Credibility Score If any changes were made</p>
            </div>
                
        </div>
        </>
        ); 
    



}