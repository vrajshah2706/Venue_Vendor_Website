import Header from "../components/header";
import React, { useState } from "react";
import VenueManagement from "../components/venueManagement";
import ReportsTab from "../components/reportsTab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"venues" | "reports">("venues");

  return (
     <div className="min-h-screen bg-[#F7F5FF] flex flex-col"> {/* it will stack header, content, footer vertically */}
          <Header/>
          <main className="flex-grow w-full max-w-8xl mx-auto px-4 pt-12 pb-10 space-y-8">
            
            <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          
        </div>
      

       
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex space-x-8" role="tablist">
              {/* Venue Management */}
              <button
                role="tab"
                aria-selected={activeTab === "venues"}
                onClick={() => setActiveTab("venues")}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === "venues"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Venue Management
              </button>

              {/* Reports */}
              <button
                role="tab"
                aria-selected={activeTab === "reports"}
                onClick={() => setActiveTab("reports")}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === "reports"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reports & Analytics
              </button>
            </nav>
          </div>
        </div>

        </main>

          
          <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Venue Management Tab */}
            {activeTab === "venues" && <VenueManagement />}

            {/* report Tab */}
            {activeTab === "reports" && <ReportsTab />}
          </main>
        </div>
        
          
          
         
  
      
    
  );
}


