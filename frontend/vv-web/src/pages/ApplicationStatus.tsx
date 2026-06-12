import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
///declaring types 
type ApiVendor = {
  id: number;
  name: string;
  email?: string;
};

type ApiVenue = {
  id: number;
  name: string;
  type?: string;
  location: string;
  vendorID?: number;
  vendorId?: number;
  vendor?: ApiVendor;
  venueKeywords?: Array<{
    keyword?: {
      name?: string;
    };
  }>;
};

type ApiApplication = {
  id: number;
  hirerID?: number;
  hirerId?: number;
  hirer?: { id: number; name?: string };
  venueID?: number;
  venueId?: number;
  venue?: ApiVenue;
  eventName?: string;
  numberOfGuests: number;
  startDateTime: string;
  duration: number;
  comment?: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
};

//getting venuetypes 
const getVenueType = (venue?: ApiVenue | null) => {
  return venue?.type || venue?.venueKeywords?.[0]?.keyword?.name || "Venue";
};

export default function ApplicationStatus() {
  const { currentUser } = useAppContext();
  const { showToast } = useToast();

  const [applications, setApplications] = useState<ApiApplication[]>([]);
  const [venues, setVenues] = useState<ApiVenue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    //fetching applications 
    const fetchApplications = async () => {
      if (!currentUser || currentUser.role !== "hirer") {
        setApplications([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

       const [applicationsResponse, venuesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/venues/hirer/${currentUser.id}`),
          axios.get(`${API_BASE_URL}/venues`).catch(() => ({ data: [] })),
        ]);

        setApplications(Array.isArray(applicationsResponse.data) ? applicationsResponse.data : []);
        setVenues(Array.isArray(venuesResponse.data) ? venuesResponse.data : []);
      } catch (err: any) {
        console.log(err);
        const message = err?.response?.data?.message || "Failed to load your applications.";
        setError(message);
        showToast(message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser?.id, currentUser?.role]);

  const userApplications = useMemo(() => {
    if (!currentUser || currentUser.role !== "hirer") return [];

    return applications
      .filter((application) => {
        const hirerID = application.hirerID ?? application.hirerId ?? application.hirer?.id;
        return hirerID === currentUser.id;
      })
      .sort(
        (a, b) =>
          new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
      );
  }, [applications, currentUser]);

  //finding venue based on application 
  const findVenue = (application: ApiApplication) => {
    if (application.venue) return application.venue;

    const venueID = application.venueID ?? application.venueId;
    return venues.find((venue) => venue.id === venueID);
  };

  return (
    
    <div className="min-h-screen bg-[#F7F5FF] overflow-x-hidden">
       {/* Header section with page title and link to browse venues */}

      <Header />
      <main className="flex-grow max-w-full mx-auto px-4 sm:px-6 xl:px-6 pt-24 pb-10">
        <div className="rounded-[28px] border border-[#E8E5F8] bg-white p-6 shadow-sm mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B6B8D]">Application status</p>
              <h1 className="text-3xl font-bold text-[#2B0F74]">My venue applications</h1>
            </div>
            <Link
              href="/Hirer"
              className="inline-flex items-center justify-center rounded-2xl bg-[#736CED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6259d9]"
            >
              Browse venues
            </Link>
          </div>
        </div>
       {/* Main content area that renders based on the user's application status */}

        {!currentUser ? (
          <div className="rounded-[28px] border border-[#E8E5F8] bg-white p-8 text-center text-[#6B6B8D]">
            <p className="text-lg font-semibold">Please sign in as a hirer to see your application status.</p>
            <Link
              href="/SignIn"
              className="mt-4 inline-flex rounded-2xl bg-[#736CED] px-5 py-3 text-sm font-semibold text-white hover:bg-[#6259d9]"
            >
              Sign In
            </Link>
          </div>
        ) : currentUser.role !== "hirer" ? (
          <div className="rounded-[28px] border border-[#E8E5F8] bg-white p-8 text-center text-red-600">
            <p className="text-lg font-semibold">Only hirers can view application status.</p>
          </div>
        ) : loading ? (
          <div className="rounded-[28px] border border-[#E8E5F8] bg-white p-8 text-center text-[#6B6B8D]">
            Loading your applications...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-100 bg-white p-8 text-center text-red-600">
            {error}
          </div>
        ) : userApplications.length === 0 ? (
          <div className="rounded-[28px] border border-[#E8E5F8] bg-white p-8 text-center text-[#6B6B8D]">
            <p className="text-lg font-semibold">No applications submitted yet.</p>
            <p className="mt-2">Submit a request from the Suppliers page to see status updates here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {userApplications.map((application) => {
              const venue = findVenue(application);
              const vendor = venue?.vendor;
              const applicationDate = new Date(application.startDateTime);

              return (
                <div
                  key={application.id}
                  className="rounded-[28px] border border-[#E8E5F8] bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm text-[#6B6B8D]">
                        {getVenueType(venue)} • {venue?.location ?? "Unknown"}
                      </p>
                      <h2 className="text-2xl font-semibold text-[#2B0F74]">
                        {venue?.name ?? "Unknown venue"}
                      </h2>
                      <p className="mt-2 text-sm text-[#4B4B6B]">
                        Supplier: {vendor?.name ?? "Unknown supplier"}
                      </p>
                    </div>

                    <div
                      className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                        application.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : application.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {application.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm text-[#4B4B6B]">
                    <div>
                      <p className="font-semibold text-[#2B0F74]">Event name</p>
                      <p>{application.eventName ?? "Venue booking request"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#2B0F74]">Date & time</p>
                      <p>
                        {applicationDate.toLocaleDateString("en-AU", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        at{" "}
                        {applicationDate.toLocaleTimeString("en-AU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#2B0F74]">Guests</p>
                      <p>{application.numberOfGuests}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#2B0F74]">Duration</p>
                      <p>{application.duration} minutes</p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <p className="font-semibold text-[#2B0F74]">Message</p>
                      <p>{application.comment || "No message provided."}</p>
                    </div>
                    {application.createdAt && (
                      <div>
                        <p className="font-semibold text-[#2B0F74]">Submitted</p>
                        <p>{new Date(application.createdAt).toLocaleDateString("en-AU")}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}