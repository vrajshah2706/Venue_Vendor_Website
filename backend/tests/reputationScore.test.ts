import { calculateReputationScore } from "../src/controllers/utils";
import { PreviousHire } from "../src/entity/PreviousHire";
import { AppDataSource } from "../src/data-source";



describe("Reputation Score", () => {

    /*
    TEST PURPOSE:
    This test validates the reputation score algorithm.
    A hirer's reputation score is calculated from
    ratings received from previous venue hires.
    Ratings:5,4,3
    Average:
    (5 + 4 + 3) / 3 = 4.0
    Expected result:
    calculateReputationScore() returns 4.0.
    */

    const previousHireRepo = AppDataSource.getRepository(PreviousHire);

    test("calculates average reputation score correctly", async () => {

        jest.spyOn(previousHireRepo, "find").mockResolvedValue([
                { rating: 5 },
                { rating: 4 },
                { rating: 3 }
            ] as any);

        const score = await calculateReputationScore(1);

        expect(score).toBe(4);
    })
});