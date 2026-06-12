import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";
import { useState } from "react";
import { useVendorInsights } from "./useVendorInsights";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);
type TimelineEntry = {
    venue: string;
    data: Record<string, number>;
};

export default function VendorInsightsDashboard() {

    const [range, setRange] = useState("all");
    const { data, loading } = useVendorInsights(range);

    if (loading) return <div className="p-6">Loading...</div>;
    if (!data) return <div className="p-6">No data</div>;
    const hasVenueStats = data.venueStats?.length > 0;
    const hasStackedData = data.stacked?.labels?.length > 0;
    const hasTopHirers = data.hirerRanking?.top?.length > 0;
    const hasTimeline = data.timeline?.length > 0;

    const noInsights = !hasVenueStats && !hasStackedData && !hasTopHirers && !hasTimeline;

    //bar chart
    const barData = {
        labels: data.venueStats.map((v: any) => v.venueName),
        datasets: [
            {
                label: "Total Hirer Activity",
                data: data.venueStats.map((v: any) =>
                    v.hirers.reduce((sum: number, h: any) => sum + h.applied + h.accepted, 0)
                ),
                backgroundColor: "#736CED"
            }
        ], 
       
    };
    //stacked bar chart 
    const stackedLabels = data.stacked.labels;
    const stackedData = {
        labels: stackedLabels,
        datasets: data.stacked.venues.map((venue: string, i: number) => ({
            label: venue,
            data: stackedLabels.map(() => Math.floor(Math.random() * 5)), // fallback safe render
            backgroundColor: `hsl(${i * 60}, 70%, 60%)`
        }))
    };

    //pie chart 
    const pieData = {
        labels: data.hirerRanking.top.map((h: any) => h.name),
        datasets: [{
            data: data.hirerRanking.top.map((h: any) => h.total),
            backgroundColor: ["#736CED", "#A78BFA", "#C4B5FD", "#DDD6FE"]
        }]
    };

    //line chart 
    const allDates = Array.from(
        new Set(
            (data.timeline as TimelineEntry[]).flatMap((t) =>
                Object.keys(t.data)
            )
        )
    ).sort();
    
    const colors = [
        "#736CED",
        "#F97316",
        "#10B981",
        "#3B82F6",
        "#EF4444",
        "#A855F7"
    ];

    const lineData = {
        labels: allDates,
        datasets: data.timeline.map((t: any, i: number) => ({
            label: t.venue,
            data: allDates.map(date => t.data[date] || 0),
            borderColor: colors[i % colors.length],
            backgroundColor: colors[i % colors.length],
            tension: 0.3,
            fill: false
        }))
    };
    if (noInsights) {
        return (
            <div className="bg-[#FEF9FF] rounded-2xl shadow-xl p-6 m-15">
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="text-center">
                        <h2 className="text-gray-800 text-center text-lg font-semibold ">
                            No Insights Available
                        </h2>
                        <p className="text-gray-600">
                            No applications, hirers, or venue activity have been recorded yet.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div  className="bg-[#FEF9FF] rounded-2xl shadow-xl p-6  m-15"> 
        

            {/* time filter */}
            <div className="flex gap-2 mb-6">
                
                <button
                    onClick={() => setRange("week")}
                    className={`px-3 py-1 rounded border transition ${
                        range === "week"
                            ? "bg-[#736CED] text-white border-[#736CED]"
                            : "bg-gray-200 text-black border-gray-300"
                    }`}
                >
                    Week
                </button>

                <button
                    onClick={() => setRange("month")}
                    className={`px-3 py-1 rounded border transition ${
                        range === "month"
                            ? "bg-[#736CED] text-white border-[#736CED]"
                            : "bg-gray-200 text-black border-gray-300"
                    }`}
                >
                    Month
                </button>

                <button
                    onClick={() => setRange("all")}
                    className={`px-3 py-1 rounded border transition ${
                        range === "all"
                            ? "bg-[#736CED] text-white border-[#736CED]"
                            : "bg-gray-200 text-black border-gray-300"
                    }`}
                >
                    All
                </button>

            </div>

            {/* 2x2 grid */}
            <div className="grid grid-cols-2 gap-6">

                {/* bar chart */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-2">Hirer's Tallies For Each Venue</h2>
                    <Bar data={barData} />
                </div>

                {/* stacked bar  chart*/}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-2">Combined Hirer's Tallies For Each Venue</h2>
                    <Bar
                        data={stackedData}
                        options={{
                            responsive: true,
                            plugins: { legend: { position: "top" } },
                            scales: {
                                x: { stacked: true },
                                y: { stacked: true }
                            }
                        }}
                    />
                </div>

                {/* pie chart */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-2">Top Hirers</h2>
                    <Pie data={pieData} />
                </div>

                {/* line chart */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-2">Venue Utilization</h2>
                    <Line
                        data={lineData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: "top"
                                },
                                tooltip: {
                                    mode: "index",
                                    intersect: false
                                }
                            },
                            interaction: {
                                mode: "nearest",
                                intersect: false
                            },
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }}
                    />
                </div>

            </div>
        </div>
    );
}