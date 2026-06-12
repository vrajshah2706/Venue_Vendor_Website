import { Application } from "../src/entity/Application";
import { rejectApplication } from "../src/controllers/vendorController";
import { AppDataSource } from "../src/data-source";
import { ApplicationStatus } from "../src/entity/Application";

describe("Rejecting Already Approved Application", () => {
    /*
    TEST PURPOSE:
    This test ensures that applications cannot be
    processed multiple times.
    If an application has already been approved,
    it should not be possible to reject it afterwards.
    This prevents inconsistent booking states
    inside the system.

    Expected result:
    HTTP 400 is returned.
    */

    test("cannot reject already approved application", async () => {

    const applicationRepo = AppDataSource.getRepository(Application);
    
    jest.spyOn(applicationRepo, "findOne").mockResolvedValue({
        status: ApplicationStatus.APPROVED
        } as any);

        const req: any = {
            params: { id: "1" }
        };

        const res: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await rejectApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });
}); 
