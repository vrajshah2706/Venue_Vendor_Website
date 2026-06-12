import React from "react";
import { useQuery } from "@apollo/client/react";
import {GET_TOP_POPULAR_VENUES,GET_TOP_ACTIVE_APPLICANTS} from "../graphql/queries";
import PopularVenuesReport from "./popularVenuesReport";
import ActiveApplicantsReport from "./activeApplicantsReport";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type TopVenue = {
  venueId: number;
  venueName: string;
  totalBookings: number;
  popularDay: string;
  popularTimeSlot: string;
  bookingsInTopSlot: number;
};

type TopApplicant = {
  hirerId: number;
  hirerName: string;
  hirerEmail: string;
  applicationsSubmitted: number;
  successfulBookings: number;
  successRate: number;
};

type GetTopPopularVenuesResponse = {
  topPopularVenues: TopVenue[];
};

type GetTopActiveApplicantsResponse = {
  topActiveApplicants: TopApplicant[];
};

const ReportsTab = () => {
  // queries
  const { data: venuesData, loading: venuesLoading, error: venuesError } = useQuery<GetTopPopularVenuesResponse>(GET_TOP_POPULAR_VENUES);

  const { data: applicantsData, loading: applicantsLoading, error: applicantsError } = useQuery<GetTopActiveApplicantsResponse>(GET_TOP_ACTIVE_APPLICANTS);
  
  const topVenues = venuesData?.topPopularVenues || [];
  const topApplicants = applicantsData?.topActiveApplicants || [];

  //loading state
  if (venuesLoading || applicantsLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const hasData = topVenues.length > 0 || topApplicants.length > 0;



  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Admin Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-AU")}`, 14, 28);

    doc.setFontSize(13);
    doc.text("Top 3 Most Popular Venues", 14, 42);
    autoTable(doc, {
      startY: 48,
      head: [["Rank", "Venue", "Total Bookings", "Busiest Day", "Busiest Time"]],
      body: topVenues.map((v, i) => [i + 1, v.venueName, v.totalBookings, v.popularDay, v.popularTimeSlot]),
      headStyles: { fillColor: [115, 108, 237] }
    });

    const afterVenues = (doc as any).lastAutoTable.finalY + 14;
    doc.setFontSize(13);
    doc.text("Top 3 Most Active Applicants", 14, afterVenues);
    autoTable(doc, {
      startY: afterVenues + 6,
      head: [["Rank", "Name", "Email", "Applications", "Successful", "Success Rate"]],
      body: topApplicants.map((a, i) => [i + 1, a.hirerName, a.hirerEmail, a.applicationsSubmitted, a.successfulBookings, `${a.successRate.toFixed(1)}%`]),
      headStyles: { fillColor: [115, 108, 237] }
    });

    doc.save(`report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };
  
  return (
    <div className="space-y-8">
      
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">
            View key metrics and insights about venue popularity and applicant activity
          </p>
        </div>

          <button
            onClick={generatePDF}
            disabled={!hasData}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Download PDF
          </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/*top popular venues */}
        <div>
          {venuesError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                Error loading venues report: {venuesError.message}
              </p>
            </div>
          ) : (
            <PopularVenuesReport venues={topVenues} />
          )}
        </div>

        {/* top active applicants */}
        <div>
          {applicantsError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                Error loading applicants report: {applicantsError.message}
              </p>
            </div>
          ) : (
            <ActiveApplicantsReport applicants={topApplicants} />
          )}
        </div>
      </div>

      {/* empty state */}
      {topVenues.length === 0 && topApplicants.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-800">
            No data available yet. Reports will appear once you have applications
            and bookings in the system.
          </p>
        </div>
      )}
    </div>
  );
};
export default ReportsTab;

