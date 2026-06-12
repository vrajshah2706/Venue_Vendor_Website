import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAppContext } from "@/context/AppContext";
import ShowVendorVenues from "@/components/VendorShowVenueComponent/vendorShowVenue"
import VendorInfographic from "@/components/VendorInfographicComponent/VendorInfographic";
import VendorApplicantTable from "@/components/VendorApplicationComponent/vendorApplicantTable"
export default function Vendor() {
  //getting current logged in user
  const { currentUser } = useAppContext();

  //checking if current user if vendor
  const isVendor = currentUser?.role === "vendor";


  return (
    <>
    <div className="min-h-screen bg-[#F7F5FF] flex flex-col"> {/* it will stack header, content, footer vertically */}
      <Header/>
      <main className="flex-grow w-full max-w-8xl mx-auto px-4 pt-12 pb-10 space-y-8">
        
        {!isVendor ? (
          <div className="text-center text-red-600 text-lg font-semibold mt-10">
            Unauthorized access
          </div>
        ) : (
          <>
            {/*Vendor Glance of their Venues (component) */}
            <ShowVendorVenues />
            {/* Vendor View of Inforaphic display (component) */}
            <VendorInfographic />
            {/*Vendor's View of applications (component) */}
            <VendorApplicantTable />
          </>
        )}

    
      </main>
      <Footer/>
    </div>
    </>
  )
 

}