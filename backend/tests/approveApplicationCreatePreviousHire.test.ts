const saveMock = jest.fn();
const findOneMock = jest.fn();
//mock data 
jest.mock("../src/data-source", () => ({
    AppDataSource: {
        getRepository: jest.fn((entity) => {
            if (entity.name === "Application") {
                return {
                    findOne: findOneMock,
                    save: jest.fn()
                };
            }

            if (entity.name === "PreviousHire") {
                return {
                    findOne: jest.fn().mockResolvedValue(null), // ✅ FIX ADDED
                    create: jest.fn((data) => data),
                    save: saveMock
                };
            }
        })
    }
}));

import { approveApplication } from "../src/controllers/vendorController";
import { ApplicationStatus } from "../src/entity/Application";

describe("Approve Application Creates Previous Hire", () => {
    /*
    TEST PURPOSE:
    This test verifies the booking workflow.
    When a vendor approves a pending application, a
    PreviousHire record should automatically be created.

    Expected result:
    A PreviousHire record is created and persisted to the database.
    */

    test("creates previous hire when application approved", async () => {

         // mock application returned from DB
        findOneMock.mockResolvedValue({
            id: 1,
            status: ApplicationStatus.PENDING,
            startDateTime: new Date(),
            hirer: { id: 10 },
            venue: { id: 20, name: "Test Venue" }
        });

        const req: any = {
            params: {
                id: "1"
            }
        };

        const res: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await approveApplication(req, res);

        expect(saveMock).toHaveBeenCalled();
    });

}); 