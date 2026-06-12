jest.mock("../src/data-source", () => ({
    AppDataSource: {
        getRepository: jest.fn(() => ({
            findOne: jest.fn().mockResolvedValue({
                id: 1,
                name: "Alex",
                phoneNumber: "0412345678"
            }),
            save: jest.fn()
        }))
    }
}));

import { updateUserProfile } from "../src/controllers/userController";

describe("Update User Phone Number", () => {
    /*
    TEST PURPOSE:
    This test ensures that the system correctly rejects
    invalid phone numbers.
    The application requires all phone numbers to
    contain exactly 10 digits.

    Input:
    123

    Expected result:
    Profile update is rejected with HTTP 400.
    This prevents invalid contact information from
    being stored in the database.
    */

    test("rejects invalid phone number", async () => {
        
        

        const req: any = {
            params: { id: "1" },
            body: {
                phoneNumber: "123"
            }
        };

        const res: any = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await updateUserProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    })

});