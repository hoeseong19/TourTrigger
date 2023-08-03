const HTTPStatusCode = require("http-status-codes");
const request = require("supertest");
const HTMLParser = require("node-html-parser");

const app = require("../../app");

const fakeEmail = "email@email.com";
const fakeName = "name";
const fakePassword = "123456";

// 길이가 6자 미만인 비밀번호
const fakeShortPassword = "12345";
// 설정한 비밀번호와 다른 비밀번호
const fakeInCorrectPassword = "654321";

const flashMessageClassName = ".alert";

const messageUserNameMissing = "Name is required.";
const messageEmailMissing = "Email is required.";
const messagePasswordMissing = "Password is required.";
const messagePasswordsNotTheSame = "Passsword do not match.";
const messagePasswordTooShort = "Password must be at least 6 characters.";

describe("Auth", () => {
    describe("회원가입 요청", () => {
        const agent = request.agent(app);

        it("회원가입 페이지 내용 확인", (done) => {
            agent
                .get("/users/new")
                .expect(HTTPStatusCode.OK)
                .end(function (err, res) {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const emailElement = responseHTML.querySelector("input[name=email]");
                    const nameElement = responseHTML.querySelector("input[name=name]");
                    const passwordElement = responseHTML.querySelector("input[name=password]");

                    expect(emailElement).not.toBeNull();
                    expect(nameElement).not.toBeNull();
                    expect(passwordElement).not.toBeNull();

                    done();
                });
        });

        it("name 누락 확인", (done) => {
            agent
                .post("/users")
                .redirects(1)
                .expect(HTTPStatusCode.OK)
                .end(function (err, res) {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const flashElement = responseHTML.querySelector(flashMessageClassName);

                    expect(flashElement.text).toContain(messageUserNameMissing);

                    done();
                });
        });

        it("email 누락 확인", (done) => {
            agent
                .post("/users")
                .send({ name: fakeName })
                .redirects(1)
                .expect(HTTPStatusCode.OK)
                .end(function (err, res) {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const flashElement = responseHTML.querySelector(flashMessageClassName);

                    expect(flashElement.text).toContain(messageEmailMissing);

                    done();
                });
        });

        it("password 누락 확인", (done) => {
            agent
                .post("/users")
                .send({ name: fakeName, email: fakeEmail })
                .redirects(1)
                .expect(HTTPStatusCode.OK)
                .end(function (err, res) {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const flashElement = responseHTML.querySelector(flashMessageClassName);

                    expect(flashElement.text).toContain(messagePasswordMissing);

                    done();
                });
        });

        it("password 와 password_confirmation 불일치", (done) => {
            agent
                .post("/users")
                .send({ name: fakeName, email: fakeEmail, password: fakePassword, password: fakeInCorrectPassword })
                .redirects(1)
                .expect(HTTPStatusCode.OK)
                .end(function (err, res) {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const flashElement = responseHTML.querySelector(flashMessageClassName);

                    expect(flashElement.text).toContain(messagePasswordsNotTheSame);

                    done();
                });
        });

        it("password 길이 6자 미만 에러", (done) => {
            agent
                .post("/users")
                .send({
                    name: fakeName,
                    email: fakeEmail,
                    password: fakeShortPassword,
                    password_confirmation: fakeShortPassword,
                })
                .redirects(1)
                .expect(HTTPStatusCode.OK)
                .end(function (err, res) {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const flashElement = responseHTML.querySelector(flashMessageClassName);

                    expect(flashElement.text).toContain(messagePasswordTooShort);

                    done();
                });
        });

        it("회원가입 완료", (done) => {
            agent
                .post("/users")
                .send({ name: fakeName, email: fakeEmail, password: fakePassword, password_confirmation: fakePassword })
                .redirects(1)
                .expect(HTTPStatusCode.OK)
                .end(function (err, res) {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const flashElement = responseHTML.querySelector(flashMessageClassName);

                    expect(flashElement.text).toContain("Registered successfully. Please sign in.");

                    done();
                });
        });

        it("등록된 이메일 에러 처리", (done) => {
            agent
                .post("/users")
                .send({ name: fakeName, email: fakeEmail, password: fakePassword, password_confirmation: fakePassword })
                .redirects(1)
                .expect(HTTPStatusCode.OK)
                .end(function (err, res) {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const flashElement = responseHTML.querySelector(flashMessageClassName);

                    expect(flashElement.text).toContain("Email address already exists.");

                    done();
                });
        });
    });

    describe("로그인 요청", () => {
        const agent = request.agent(app);

        it("로그인 페이지 내용 확인", (done) => {
            agent
                .get("/signin")
                .expect(HTTPStatusCode.OK)
                .end(function (err, res) {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const emailElement = responseHTML.querySelector("input[name=email]");
                    const passwordElement = responseHTML.querySelector("input[name=password]");

                    expect(emailElement).not.toBeNull();
                    expect(passwordElement).not.toBeNull();

                    done();
                });
        });

        it("비밀번호 불일치", (done) => {
            agent
                .post("/signin")
                .send({ email: fakeEmail, password: fakeInCorrectPassword })
                .redirects(1)
                .expect(HTTPStatusCode.OK)
                .end(function (err, res) {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const flashElement = responseHTML.querySelector(flashMessageClassName);

                    expect(flashElement.text).toContain("Invalid email or password");

                    done();
                });
        });

        it("로그인 성공", (done) => {
            agent
                .post("/signin")
                .send({ email: fakeEmail, password: fakePassword })
                .redirects(1)
                .expect(HTTPStatusCode.OK)
                .end(function (err, res) {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const flashElement = responseHTML.querySelector(flashMessageClassName);

                    expect(flashElement.text).toContain("Welcome!");

                    done();
                });
        });
    });
});
