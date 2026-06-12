import React from "react";

type ActiveApplicant = {
  hirerName: string;
  hirerId: number;
  hirerEmail: string;
  applicationsSubmitted: number;
  successfulBookings: number;
  successRate: number;
}; 

type ActiveApplicantsReportProps =  {
  applicants: ActiveApplicant[];
}; 

const ActiveApplicantsReport = ({applicants,}: ActiveApplicantsReportProps) => {
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 70) return "bg-green-100 text-green-800";
    if (rate >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
    
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
           Top 3 Most Active Applicants
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          Based on total applications submitted and success rate
        </p>
      </div>

      {/* applicant cards */}
      {applicants.length > 0 ? (
        <div className="space-y-4">
          {applicants.map((applicant, index) => {

            const bgColors = [
              "bg-yellow-50 border-yellow-200",
              "bg-gray-50 border-gray-200",
              "bg-orange-50 border-orange-200"
            ];

            return (
              <div
                key={applicant.hirerId}
                className={`border-2 rounded-lg p-4 ${bgColors[index]}`}
              >
                {/* Rank and Name */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">
                        Rank {index + 1}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {applicant.hirerName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {applicant.hirerEmail}
                      </p>
                    </div>
                  </div>
                  
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-300">
                  {/* Total Applications */}
                  <div className="text-center">
                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                      Applications
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {applicant.applicationsSubmitted}
                    </p>
                  </div>

                  {/* Successful Bookings */}
                  <div className="text-center">
                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                      Successful
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {applicant.successfulBookings}
                    </p>
                  </div>

                  {/* Success Rate */}
                  <div className="text-center">
                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                      Success Rate
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {applicant.successRate.toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(applicant.successRate, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Status  */}
                <div className="mt-3">
                  {applicant.successRate >= 70 && (
                    <p className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-block">
                      High-performing applicant
                    </p>
                  )}
                  {applicant.successRate >= 40 &&
                    applicant.successRate < 70 && (
                      <p className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded inline-block">
                        Moderate success rate
                      </p>
                    )}
                  {applicant.successRate < 40 && (
                    <p className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded inline-block">
                      Low success rate
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Empty State
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No applicant data available yet
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Reports will appear once hirers have submitted applications
          </p>
        </div>
      )}

      {/* insights*/}
      {applicants.length > 0 && (
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-900">
             <strong>Insight:</strong> The most active applicant has submitted{" "}
            <strong>{applicants[0]?.applicationsSubmitted}</strong> applications
            with a <strong>{applicants[0]?.successRate.toFixed(1)}%</strong>{" "}
            success rate, resulting in{" "}
            <strong>{applicants[0]?.successfulBookings}</strong> successful
            bookings.
          </p>
        </div>
      )}
    </div>
  );
};
export default ActiveApplicantsReport; 

