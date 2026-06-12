import { calculateCredibilityScore } from "../src/controllers/utils";
import { HirerDocument } from "../src/entity/HirerDocument";
import { AppDataSource } from "../src/data-source";

describe("Credibility Score", () => {

    /*
    TEST PURPOSE: 
    This test verifies that a business hirer receives a
    100% credibility score when all required documents
    have been uploaded.

    The credibility score is used to indicate how
    trustworthy a hirer is to venue vendors.

    hirers are required to upload:
    1. Driver's licence
    2. Insurance certificate
    3. Business registration

    If all three exist, the score should be 100%.

    Expected result:
    calculateCredibilityScore() returns 100.
    */

    test("returns 100 when business user uploaded all documents", async () => {

        const hirerDocumentRepo = AppDataSource.getRepository(HirerDocument);

        jest.spyOn(hirerDocumentRepo, "findOne").mockResolvedValue({
                isBusiness: true,

                driversLicense: "license.pdf",

                insuranceCertificate: "insurance.pdf",

                businessRegistration: "business.pdf"
        } as any);

        const score = await calculateCredibilityScore(1);

        expect(score).toBe(100);
    });
});