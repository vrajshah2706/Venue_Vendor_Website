import { Application, Venue, Hirer } from "@/context/AppContext";

type TableRowProps = {
  application: Application;
  venue?: Venue;
  hirer?: Hirer;
  reputationScore?: number | null;
  onViewCredibility:(hirerID : number) => void; 
  onViewHistory: (hirerID: number) => void;
  onAction: (application: Application) => void;
};

export default function TableRow ({application, venue, hirer,reputationScore, onViewCredibility, onViewHistory, onAction} : TableRowProps) {
  
   
   
    // function to show reputation score stars
    const renderStars = (score: number |null | undefined ) => {
        if (score === null || score === undefined) return "No Rating";
        return "⭐".repeat(Math.round(score));
    } 
    //converting ISO format to date and time for data cells 
    const start = new Date(application.startDateTime);

    const date = start.toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    const time = start.toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit"
    });


    return (
        <>
        {/* generating data for each row */}
        <tr className="border-t hover:bg-gray-200 ">
            <td className="p-3 text-center align-middle">{venue?.name}</td>
            <td className="p-3 text-center align-middle">{hirer?.name}</td>
            <td className="p-3 text-center align-middle">{application.numberOfGuests}</td>
            <td className="p-3 text-center align-middle">{date}</td>
            <td className="p-3 text-center align-middle">{time}</td>
            <td className="p-3 text-center align-middle" >{application.duration} min</td>
            <td className="p-3 text-center align-middle">
                {renderStars(reputationScore)}
            </td>
            
            {/* dynamic status */}
            <td className="p-3 text-center align-middle">
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
            </td>
            {/* View Credibility button */}
            <td className="p-3 text-center align-middle">
                <button 
                onClick={ ()=> {console.log("clicked"); onViewCredibility(hirer!.id)}}
                className="bg-blue-500 text-white px-3 py-1 rounded 
                    hover:bg-blue-600 hover:shadow-md hover:-translate-y-0.5 
                    active:scale-95 transition-all duration-150 cursor-pointer "
                > View</button>
            </td>

            {/* View History button */}
            <td className="p-3 text-center align-middle">
                <button 
                onClick={() => onViewHistory(hirer!.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded 
                    hover:bg-blue-600 hover:shadow-md hover:-translate-y-0.5 
                    active:scale-95 transition-all duration-150 cursor-pointer ">
                
                    View</button>
            </td>

            {/* Action */}
            <td className="p-3 text-center align-middle">
                <button 
                onClick={() =>   onAction(application)}
                className="bg-[#736CED] text-white px-3 py-1 rounded 
                    hover:bg-[#5f59d9] hover:shadow-md hover:-translate-y-0.5 
                    active:scale-95 disabled:opacity-50 cursor-pointer transition-all duration-150"
                >
                    Action
                </button>
            </td>

        </tr>

        

       
        </>
    );
}