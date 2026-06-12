"use client"; 
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/header";

import Footer from "@/components/footer";
import VendorProfileForm from "@/components/VendorEditProfileComponent/vendorProfileForm";
import { useAppContext } from "@/context/AppContext";

export default function VendorProfilePage() {

    //getting current session user
    const {currentUser} = useAppContext();
    //role checking
    const isVendor  = currentUser?.role === "vendor";

    //local backend vendor state
    const [vendor, setVendor] = useState<any>(null);
    //loading state
    const [loading, setLoading] = useState(true);

    //fetching vendor profile 
    const fetchVendorProfile = async () => {

        try {
            
            const response = await axios.get (
                 `http://localhost:3001/users/${currentUser?.id}`
            );

            //storing vendor data
            setVendor(response.data);

        } catch(error) {
            console.log(error);
        } finally {
            setLoading(false);

        }
    };

    //fetching on mount
    useEffect( () => {
        if(currentUser?.id) {
            fetchVendorProfile();

        }
    }, [currentUser]);


    return (
         <>
        <div className="min-h-screen bg-[#F7F5FF] overflow-x-hidden">
            <Header/>
                    <main className="max-w-5xl mx-auto px-6 pt-24 pb-10 space-y-8">
                        {!isVendor ? (
                            <div className="text-center text-red-600 font-semibold text-lg">
                                Unauthorized access
                            </div>
                            ) :loading ?  (
                                <div className="text-center text-gray-600">
                                    Loading profile...
                                </div>
                            ): !vendor ? (

                                <div className="text-center text-red-600">
                                    Failed to load profile
                                </div>

                            )  : (
                            <>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                                <h1 className="text-xl font-bold text-[#3B22A1]">
                                     Profile Settings 
                                </h1>
                            </div>

                            <VendorProfileForm vendor={vendor}/>
                            </>
                        )}
                    </main>
            <Footer/>
        </div>
        </>
    )
}
