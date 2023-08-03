const HTTPStatusCode = require("http-status-codes");
const request = require("supertest");
const app = require("../../app");

describe("Index", () => {
    // 첫 페이지
    it("GET /", (done) => {
        request(app).get("/").expect(HTTPStatusCode.OK, done);
    });
});
