//File content: Credibility & Reputation Score, Delete File
//reputation score
import { AppDataSource } from "../data-source";
import { PreviousHire } from "../entity/PreviousHire";
import { HirerDocument } from "../entity/HirerDocument";
import { MoreThan } from "typeorm";
import { Application } from "../entity/Application";
import { Venue } from "../entity/Venue";

import fs from "fs"; 

const previousHireRepo = AppDataSource.getRepository(PreviousHire); 
const hirerDocumentRepo = AppDataSource.getRepository(HirerDocument);
const venueRepo = AppDataSource.getRepository(Venue);
const applicationRepo = AppDataSource.getRepository(Application);

export const calculateReputationScore = async ( hirerID: number): Promise<number | null> => {

    //getting previous hires where it equals hirerID 
    const hires = await previousHireRepo.find({
        where: {
            hirer: {
                id: hirerID
            }
        }
    }); 

    //no prev hires => no ratings
    if( hires.length === 0){
        return null;
    }

    const total = hires.reduce( (sum,hire) => sum + hire.rating, 0); 

    const average = total/hires.length;

    //1 decimal place
    return Number(average.toFixed(1));
}

//credibility score 
export const calculateCredibilityScore = async (hirerID: number) : Promise<number> => {
    //finding the hirer document record
    const doc = await hirerDocumentRepo.findOne({
        where:{
            hirer:{
                id:hirerID
            }
        }
    })
    //if not document 
    if(!doc){
        return 0;
    }

    let uploaedCount = 0;

    const totalRequired = doc.isBusiness ? 3 : 2;

    //check uploaded documents
    if(doc.driversLicense){
        uploaedCount += 1;
    }
    if(doc.insuranceCertificate){
        uploaedCount += 1;
    }

    //only counting business registration if the user is actually business
    if(doc.isBusiness && doc.businessRegistration){
        uploaedCount +=1; 
    }

    //converting to percentage 
    return Math.round((uploaedCount/totalRequired) * 100); 


}

//deleting files from upload file 
export const deleteFile = (path: string) => {
    if(fs.existsSync(path)){
        fs.unlinkSync(path);
    }
}; 

export const getVendorInsightsService = async (
    vendorID: number,
    range: string
) => {

    const now = new Date();

    let fromDate: Date | undefined;

    if (range === "week") {
        fromDate = new Date();
        fromDate.setDate(now.getDate() - 7);
    }

    if (range === "month") {
        fromDate = new Date();
        fromDate.setMonth(now.getMonth() - 1);
    }

    const days = range === "month" ? 30 : 7;

    const vendorVenues = await venueRepo.find({
        where: { vendor: { id: vendorID } }
    });

    //aggregating 

    const venueStats: any[] = [];
    const hirerTotals: Record<string, number> = {};
    const timelineMap: Record<string, Record<string, number>> = {};

    for (const venue of vendorVenues) {

        const applications = await applicationRepo.find({
            where: {
                venue: { id: venue.id },
                ...(fromDate && { createdAt: MoreThan(fromDate) })
            },
            relations: ["hirer"]
        });

        const previousHires = await previousHireRepo.find({
            where: {
                venue: { id: venue.id },
                ...(fromDate && { date: MoreThan(fromDate) })
            },
            relations: ["hirer"]
        });

        const hirerMap: Record<string, {
            name: string;
            applied: number;
            accepted: number;
        }> = {};

        //application
        for (const app of applications) {

            const h = app.hirer;
            const id = h.id;

            if (!hirerMap[id]) {
                hirerMap[id] = {
                    name: h.name,
                    applied: 0,
                    accepted: 0
                };
            }

            hirerMap[id].applied++;

            hirerTotals[h.name] = (hirerTotals[h.name] || 0) + 1;

            const date = app.createdAt.toISOString().split("T")[0];

            if (!timelineMap[venue.name]) {
                timelineMap[venue.name] = {};
            }

            timelineMap[venue.name][date] =
                (timelineMap[venue.name][date] || 0) + 1;
        }

        //previosu hire 
        for (const hire of previousHires) {

            const h = hire.hirer;
            const id = h.id;

            if (!hirerMap[id]) {
                hirerMap[id] = {
                    name: h.name,
                    applied: 0,
                    accepted: 0
                };
            }

            hirerMap[id].accepted++;

            hirerTotals[h.name] =
                (hirerTotals[h.name] || 0) + 1;
        }

        venueStats.push({
            venueName: venue.name,
            hirers: Object.values(hirerMap)
        });
    }

   //pie chart
    const sortedHirers = Object.entries(hirerTotals)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total);

    const topHirers = sortedHirers.slice(0, 5);
    const leastHirers = sortedHirers.slice(-5);

    //stacked bar chart

    const allHirers = Array.from(
        new Set(sortedHirers.map(h => h.name))
    );

    const stacked = {
        labels: allHirers,
        venues: vendorVenues.map(v => v.name)
    };

    

    const today = new Date();

    const filledTimeline: Record<string, Record<string, number>> = {};

    for (const venue of vendorVenues) {

        filledTimeline[venue.name] = {};

        // STEP 1: create last N days skeleton
        for (let i = days - 1; i >= 0; i--) {

            const d = new Date();
            d.setDate(today.getDate() - i);

            const key = d.toISOString().split("T")[0];

            filledTimeline[venue.name][key] =
                timelineMap[venue.name]?.[key] || 0;
        }
    }

 

    const timeline = Object.entries(filledTimeline).map(
        ([venue, data]) => ({
            venue,
            data
        })
    );

    return {
        venueStats,
        stacked,
        hirerRanking: {
            top: topHirers,
            least: leastHirers
        },
        timeline
    };
};