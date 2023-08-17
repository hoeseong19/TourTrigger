const HTMLParser = require("node-html-parser");
const HTTPStatusCode = require("http-status-codes");
const request = require("supertest");

const mongoose = require('mongoose');
const app = require("../../app");

const fakeEmail = "guide@email.com";
const fakeName = "name";
const fakePassword = "123456";

const flashMessageClassName = ".alert";

const messageUserNotSignedIn = "Please signin first.";

describe("Guide", () => {
    const agent = request.agent(app);

    beforeAll(async () => {
        const connStr = `${process.env.MONGODB_PROTOCOL}://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_URL}`;
        await mongoose.connect(connStr, {useNewUrlParser: true});
        await mongoose.connection.dropDatabase();
        mongoose.connection.on('error', console.error);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    })

    describe("가이드 생성", () => {
        it("로그인하지 않은 사용자는 가이드 생성 화면 접근 불가", (done) => {
            agent
                .get("/guides/new")
                .redirects(1)
                .expect(HTTPStatusCode.OK)
                .end(function (err, res) {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const flashElement = responseHTML.querySelector(flashMessageClassName);

                    expect(res.req.path).toBe("/signin");

                    expect(flashElement.text).toContain(messageUserNotSignedIn);

                    done();
                });
        });

        it("회원가입", (done) => {
            agent
                .post("/users")
                .send({ name: fakeName, email: fakeEmail, password: fakePassword, password_confirmation: fakePassword })
                .expect(HTTPStatusCode.MOVED_TEMPORARILY, done);
        });
        
        it("로그인", (done) => {
            agent
                .post("/signin")
                .send({ email: fakeEmail, password: fakePassword })
                .expect(HTTPStatusCode.MOVED_TEMPORARILY, done);
        });

        it("로그인한 사용자는 가이드 생성 화면 접근 가능", (done) => {
            agent
                .get("/guides/new")
                .expect(HTTPStatusCode.OK)
                .end(function (err, res) {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const imageElement = responseHTML.querySelector("input[name=image]");
                    const nameElement = responseHTML.querySelector("input[name=name]");
                    const descriptionElement = responseHTML.querySelector("textarea[name=description]");
                    const cityElement = responseHTML.querySelector("input[name=city]");

                    expect(imageElement).not.toBeNull();
                    expect(nameElement).not.toBeNull();
                    expect(descriptionElement).not.toBeNull();
                    expect(cityElement).not.toBeNull();

                    done();
                });
        });

        it("가이드 생성", (done) => {
            agent
                .post("/guides")
                .expect(HTTPStatusCode.MOVED_TEMPORARILY)
                .end(function (err, res) {
                    if (err) return done(err);

                    expect(res.headers["location"]).toBe("/");

                    done();
                });
        });
    });
});
