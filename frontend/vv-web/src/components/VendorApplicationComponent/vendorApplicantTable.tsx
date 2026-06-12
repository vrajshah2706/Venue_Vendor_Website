import { useEffect, useState } from "react";
import axios from "axios" ;
import { useAppContext } from "@/context/AppContext";
import TableRow from "./applicationsTableRow";
import ActionModal from "./applicationActionModal";
import HistoryModal from "./applicationHistoryModal";
import CredibilityModal from "./applicationCredibilityModal";


export default function VendorApplicationTable() {

    //getting current user 
    const {currentUser} = useAppContext();

    //local state for storing applications from backend
    const [applications, setApplications] = useState<any[]>([]);
    const [reputationScores, setReputationScores] = useState<Record<number, number>>({}); 


    //sorting
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    //selected states
    const [selectedHirerID, setSelectedHirerID] = useState<number | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

    //modals
    const [openCredibilityModal, setOpenCredibilityModal] = useState(false);
    const [openHistoryModal, setOpenHistoryModal] = useState(false);
    const [openActionModal, setOpenActionModal] = useState(false);

    //fetching application 
    const fetchApplications = async () =>{
        try {   
           

            //api call
            const response = await axios.get(
                 `http://localhost:3001/vendors/${currentUser?.id}/applications`
            );
            const data = response.data; 
            //setting data to local state
            setApplications(data);

            fetchReputationScores(data) //fetch reputation scores
            
        } catch (error) {
            console.log(error);
        }
    }

    //fetching/calling function on mount
   useEffect(() => {
        if (!currentUser?.id || currentUser.role !== "vendor") return;

        fetchApplications();
    }, [currentUser?.id]);

    //fetching reputation score for hirers
    const fetchReputationScores = async (applications: any[]) => {

        try{
            //getting unique hirer ids 
           const hirerIDs = [
            ...new Set(
                applications.map(app => app.hirer.id)
                )
            ];

            //calling api for each hirer
            const responses = await Promise.all(
                hirerIDs.map(id =>axios.get(`http://localhost:3001/users/${id}/reputation`))
            );

            //building object
            const scores: Record<number, number> = {};

            responses.forEach((res, index) => {
                const id = hirerIDs[index];
                scores[id] = res.data.reputationScore;
            });

            //saving into local state
            setReputationScores(scores);
        } catch (error) {
            console.log(error);
        }
    }
    

    //unauthorised checking
    if(!currentUser || currentUser.role !== "vendor") {
       return (
            <p className="text-center mt-10">
                Unauthorized
            </p>
        );
    }

    //sorting 
    const sortedApplications = [...applications].sort((a, b) => {

        const scoreA = reputationScores[a.hirer.id] ?? -Infinity;

        const scoreB = reputationScores[b.hirer.id] ?? -Infinity;

        return sortDirection === "asc"
            ? scoreA - scoreB
            : scoreB - scoreA;
    });

    return (
        <>
        <div className="bg-[#FEF9FF] rounded-2xl shadow-xl p-4  m-15"> 
            <div className="flex justify-between items-center mb-3 ">
                <h2 className="font-semibold text-[#736CED] text-2xl mb-3 ml-2"> Current Applications</h2> 
                <button onClick={ () => {
                    setSortDirection( prev => (prev === "desc" ? "asc" : "desc"))
                }}
                className="bg-white border border-[#736CED] text-[#736CED] px-4 py-1 rounded-lg hover:bg-[#736CED] hover:text-white transition"
                > 
                    Sort By Reputation ({sortDirection === "desc" ? "↓" : "↑"})
                </button>
            </div>
            {/* checking if vendor has any applications or not */ }
            {applications.length === 0 ? (<p className="text-gray-800 text-center text-lg font-semibold ">No Applications Yet</p>
            ): (
                <div className="overflow-x-auto"> 
                    <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                        {/*Table Headers*/}
                        <thead className="bg-[#736CED] text-white">
                            <tr>
                                <th className="p-3 text-center">Venue</th>
                                <th className="p-3 text-center">Applicant</th>
                                <th className="p-3 text-center">Guests</th>
                                <th className="p-3 text-center">Date</th>
                                <th className="p-3 text-center">Time</th>
                                <th className="p-3 text-center">Duration</th>
                                <th className="p-3 text-center">Reputation</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Credibility</th>
                                <th className="p-3 text-center">History</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>

                        {/*body/rows */}
                        <tbody className="divide-y divide-gray-300">
                            {sortedApplications.map( application => {
                               
                                return (
                                    <TableRow
                                        key = {application.id}
                                        application={application}
                                        venue={application.venue}
                                        hirer = {application.hirer}
                                        reputationScore={reputationScores[application.hirer.id]}
                                        onViewCredibility={(hirerID : any) =>{
                                            setSelectedHirerID(hirerID);
                                            setOpenCredibilityModal(true);
                                        }}
                                        onViewHistory={(hirerID: any) => {
                                            setSelectedHirerID(hirerID);
                                            setOpenHistoryModal(true);
                                        }}
                                        onAction={(application: any) => {
                                            setSelectedApplication(application);
                                            setOpenActionModal(true);
                                        }}
                                        />
                                );
                            })}
                        </tbody>

                    </table>
                </div> 

             
            )}

        </div>
        {/* Credibility Modal */}
        {openCredibilityModal && selectedHirerID !== null &&  (
            <CredibilityModal
                hirerID = {selectedHirerID}
                onClose={ () => setOpenCredibilityModal(false)}
            />
        )
        }

        {/* History Modal */}
        {openHistoryModal && selectedHirerID !== null && (
        <HistoryModal
            hirerID={selectedHirerID}
            onClose={() => setOpenHistoryModal(false)}
        />
        )}

        {/* Action Modal */}
        {openActionModal && selectedApplication && (
        <ActionModal
            application={selectedApplication}
            venue={selectedApplication.venue}
            hirer={selectedApplication.hirer}
            date={new Date(selectedApplication.startDateTime)}
             // refreshes table after approve/reject
            onRefresh={fetchApplications}
            onClose={() => setOpenActionModal(false)}
        />
        )}
        </>

    );
}