module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",

    roots: ["<rootDir>/tests"],

    collectCoverage: true,
    testMatch: ["**/tests/**/*.test.ts"],

    coverageDirectory: "coverage"
};