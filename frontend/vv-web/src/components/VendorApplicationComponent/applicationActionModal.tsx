"use client"; 
import { Application, Venue, Hirer } from "@/context/AppContext";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import axios from "axios"; 

type ActionModalProps = {
    application : Application
    venue? : Venue;
    hirer?: Hirer;
    date: Date; 
    onClose(): void; 
    onRefresh(): void; 
}

export default function ActionModal({application,venue,hirer, date, onClose, onRefresh}: ActionModalProps) {

    const {showToast} = useToast(); 
    //local state for comment 
    const [comment, setComment] = useState(application.comment || ""); 
    //loading state 
    const [loading, setLoading] = useState(false); 

    //handling accept 
    const handleAccept = async () => {
        
        try {
            setLoading(true); 
            //call api to approve application 
            await axios.put(
                 `http://localhost:3001/vendors/application/${application.id}/approve`,
                {comment}
            );
            //showing toast upon success
            showToast("Application Has Been Accepted", "success"); 

            //refreshing parent data
            onRefresh();

            onClose();

        } catch(error) {
            console.log(error);
            //showing toast upon error
            showToast("Failed to approve application", "error"); 

        } finally {
            setLoading(false); 
        }
    }

    //handling reject
    const handleReject = async () => {
        
        try {
            setLoading(true); 

            await axios.put(
                `http://localhost:3001/vendors/application/${application.id}/reject`,
                {comment}
            );
            //showing toast upon success
            showToast("Application Has Been Rejected", "info"); 
            //refreshing parent data
            onRefresh(); 

            onClose(); 

        } catch (error) {
            console.log(error); 
            //showing toast upon error
            showToast("Failed to reject application", "error"); 
        } finally {
            setLoading(false); 

        }
    }; 

    //handlign save comment 
    const handleSaveComment = async() => {

        try {
            setLoading(true); 
            //api call
            await axios.patch(
                `http://localhost:3001/vendors/application/${application.id}/comment`,
                { comment }
            );
            //showing toast upon success
            showToast("Comment Saved Successfully", "success");
            //refreshing parent data 
            onRefresh();

            onClose(); 

        } catch(error) {
            console.log(error);
            //showing toast upon error
            showToast("Failed to save comment", "error"); 

            setLoading(false); 
            
        }
    }

    return (
        <>
    
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            {/* the box */}
            <div className="bg-[#FEF9FF] rounded-2xl p-6 w-[520px] shandow-2xl animate-in fade-in zoom-in-95">
                {/* header of the box */}
                <div className="flex justify-between items-center mb-5 ">
                    
                    <h2 className="text-2xl font-semibold mb-4 text-[#736CED]">
                        Application Details
                    </h2>
                     {/* clossing the modal */}
                    <button
                        onClick={onClose}
                        className="mb-4 text-black hover:text-red-500 text-xl transition"
                    >
                         ✕
                    </button>
                </div>
                

                
                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                        <p className="text-[#2B0F74]">Venue</p>
                        <p className="font-medium">{venue?.name}</p>
                    </div>

                    <div>
                        <p className="text-[#2B0F74]">Applicant</p>
                        <p className="font-medium">{hirer?.name}</p>
                    </div>

                    <div>
                        <p className="text-[#2B0F74]">Guests</p>
                        <p className="font-medium">{application.numberOfGuests}</p>
                    </div>

                    <div>
                        <p className="text-[#2B0F74]">Duration</p>
                        <p className="font-medium">{application.duration} min</p>
                    </div>

                    <div>
                        <p className="text-[#2B0F74]">Date</p>
                        <p className="font-medium">
                            {date.toLocaleDateString("en-AU", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                    </div>

                    <div>
                        <p className="text-[#2B0F74]">Time</p>
                        <p className="font-medium">
                            {date.toLocaleTimeString("en-AU", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                </div>
                {/* dynamic status */}
                <div className="mb-5">
                    <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                            application.status === "approved"
                                ? "bg-green-100 text-green-600"
                                : application.status === "rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-yellow-100 text-yellow-600"
                        }`}
                    >
                        {application.status.toUpperCase()}
                    </span>
                </div>
                {/* Comment Section */}
                <div className="mb-6"> 
                    <label className="block text-sm font-medium mb-2 text-[#2B0F74]">
                        Comment
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#736CED] outline-none transition"
                        placeholder="Add notes/comment about this applicant"
                    />
                </div>

                {/* Adding buttons */}
                <div className="flex justify-between items-center">
                    <button 
                        onClick={handleReject}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-40 transition cursor-pointer"
                        disabled={application.status !== "pending" || loading}
                    >
                        Reject
                    </button>

                    <div className="flex gap-3">
                        <button 
                            onClick={handleSaveComment}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
                            >
                            Save Comment
                            
                        </button>
                        

                        <button
                            onClick={handleAccept}
                            className="px-4 py-2 rounded-lg bg-[#736CED] text-white hover:bg-[#5f59d9] disabled:opacity-40 transition cursor-pointer"
                            disabled={application.status !== "pending" || loading}
                            >
                                Accept
                            </button>
                    </div>
                </div>
               

            </div>
        
        
        
        
        </div>
        
        </>
    )
    

}
