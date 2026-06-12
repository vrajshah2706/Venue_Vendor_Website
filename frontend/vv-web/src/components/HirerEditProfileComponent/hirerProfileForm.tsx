import { useAppContext } from "@/context/AppContext";
import { Hirer } from "@/context/AppContext";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import axios from "axios";

type HirerProfileFormProps = {
    hirer: Hirer;
}

export function HirerProfileForm( {hirer} : HirerProfileFormProps) {
    
    const { showToast } = useToast();
    //declaring states for fields and error  
    const [name, setName] = useState(hirer.name); 
    const [phone, setPhone] = useState(hirer.phoneNumber || "");
    const [error, setError] = useState("");


    //validating user inputs
    const validate = () => {
        //empty name validation 
        if(!name.trim()) {
            return "Name cannot be empty";
        }

        //only letter/spaced - validation 
        if (!/^[A-Za-z\s]+$/.test(name)) {
            return "Name can only contain letters";
        }

        // phone validation
        // only validate phone if user actually typed something different
        if (phone && phone.trim() !== "") {
            if (!/^\d{10}$/.test(phone.trim())) {
                return "Phone must be 10 digits";
            }
        }

        return "";


    }; 
    //function for handling save button 
   const handleSave = async () => {

    const err = validate(); 

    if(err) {
        setError(err);
        showToast("Please fix the errors before saving", "error");
        return;
    }

    try {
        
        const payload: any = { name };

        //only sending phonenumber if its not an empty string 
        if (phone.trim() !== "") {
            payload.phoneNumber = phone;
        }
        await axios.put(
             `http://localhost:3001/users/${hirer.id}`,
            payload
        );

        setError("");

        showToast("Profile updated successfully!", "success");
    } catch(error) {
        console.log(error);

        showToast("Something went wrong while saving profile.", "error");
    }
    
   };



    return (
        <>

         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">

            <h2 className="text-xl font-semibold text-[#3B22A1]">
                Personal Information
            </h2>

            {/* Email */}
            <div>
                <label className="text-sm font-medium  text-gray-500">Email</label>
                <input
                    value={hirer.email}
                    disabled
                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500"
                />
            </div>

            {/* Name */}
            <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#736CED] focus:border-transparent transition"

                />
            </div>

            {/* Phone Number */}
            <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#736CED] focus:border-transparent transition"
                />
            </div>

            {/* Date joined */}
            <div>
                <label className="text-sm font-medium  text-gray-500">Date Joined</label>
                <input
                    value={hirer.createdAt ? new Date(hirer.createdAt).toLocaleDateString(
                        "en-AU", {day: "2-digit", month: "short", year: "numeric"}
                    ) : ""}
                    disabled
                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500"
                />
            </div>

            {error && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                </p>
            )}

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="bg-[#736CED] text-white px-6 py-2.5 rounded-xl shadow-sm hover:bg-[#5f59d9] hover:shadow-md transition-all"
                >
                    Save Changes
                </button>
            </div>

        </div>
        </>
    )
}