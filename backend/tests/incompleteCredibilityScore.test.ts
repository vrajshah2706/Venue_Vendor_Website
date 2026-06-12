import { calculateCredibilityScore } from "../src/controllers/utils";
import { HirerDocument } from "../src/entity/HirerDocument";
import { AppDataSource } from "../src/data-source";


describe("Credibility Score", () => {
    /*
    TEST PURPOSE:
    This test verifies that a non-busines hirer only
    receives partial credibility when some documents
    are missing.

    Non-business hirers only require:

    1. Driver's licence
    2. Insurance certificate

    If only one document is uploaded, the score should
    be 50%.

    Expected result:
    calculateCredibilityScore() returns 50.
    */

    test("returns 50 when non business uploaded only one document", async () => {

        const hirerDocumentRepo = AppDataSource.getRepository(HirerDocument);

        jest.spyOn(hirerDocumentRepo, "findOne").mockResolvedValue({
                isBusiness: false,

                driversLicense: "license.pdf",

                insuranceCertificate: null
        } as any);

        const score = await calculateCredibilityScore(1);

        expect(score).toBe(50);
    }) 
}) ;