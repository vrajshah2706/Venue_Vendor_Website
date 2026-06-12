import { useState } from "react";
import axios from "axios";
import { useAppContext, Vendor } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";


//declaring type
type VendorProfileFormProps = {
    vendor: Vendor;
}

export default function VendorProfileForm( {vendor}: VendorProfileFormProps) {

    //getting current logged in user 
    const {currentUser, setCurrentUser } = useAppContext();
    const {showToast} = useToast();

    //local state for form field
    const [name, setName] =  useState(vendor.name)
    const[phone, setPhone] = useState(vendor.phoneNumber || "" ); 
    
    //error state
    const [error, setError] = useState(""); 
    //loading state while saving
    const [loading, setLoading] = useState(false);
    
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

        //running validation 
        const err = validate(); 

        //blocking save if validation errors exist
        if(err) {
            setError(err); 

            //showing toast
            showToast(
                "Please fix the errors before saving" , "error"
            );

            return ; 
        }
        //safety check
        if(!currentUser) return; 

        try{

            //start loading
            setLoading(true); 
            
            const payload: any = { name };

            //only sending phonenumber if its not an empty string 
            if (phone.trim() !== "") {
                payload.phoneNumber = phone;
            }

            //calling api - inserting payload
            await axios.put(
                `http://localhost:3001/users/${currentUser.id}`,
                payload
            );
            
            
            //syncing into AppContext
            setCurrentUser(prev =>
                prev
                ? { ...prev, name: name }
                : null
            );

            //clearing error state
            setError("");

            //showing toast upon sucess
            showToast(
                "Profile Updated Successfully!", "success"
            );


        } catch(error){
            console.log(error);
            //showing toast upon error
            showToast(
                "Something went wrong while saving profile", "error"
            ); 
        } finally {
            //stop loading
            setLoading(false);
        }
    }

    return(
        <>
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-xl font-semibold text-[#3B22A1]">
                Personal Information
            </h2>

            {/* Email */}
            <div>
                <label className="text-sm font-medium  text-gray-500">Email</label>
                <input
                    value={vendor.email}
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
             
             {/* display error if any */}
             {error && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                </p>
            )}

            {/* save button */}

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-[#736CED] text-white px-6 py-2.5 rounded-xl shadow-sm hover:bg-[#5f59d9] hover:shadow-md transition-all"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>

        </div>
        </>
    )

}