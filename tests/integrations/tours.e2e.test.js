const HTTPStatusCode = require('http-status-codes');
const request = require('supertest');
const HTMLParser = require('node-html-parser');

const mongoose = require('mongoose');
const app = require('../../app');

const fakeEmail = 'tour@email.com';
const fakeName = 'name';
const fakePassword = '123456';

const flashMessageClassName = '.alert';

const messageUserNotSignedIn = 'Please signin first.';

describe('Tours', () => {
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

    describe('여행 생성', () => {
        it('로그인하지 않은 사용자는 여행 생성 불가', (done) => {
            agent
                .post('/tours')
                .redirects(1)
                .expect(HTTPStatusCode.OK)
                .end((err, res) => {
                    if (err) return done(err);

                    const responseHTML = HTMLParser.parse(res.text);

                    const flashElement = responseHTML.querySelector(flashMessageClassName);

                    expect(res.req.path).toBe('/signin');

                    expect(flashElement.text).toContain(messageUserNotSignedIn);

                    done();

                    return null;
                });
        });

        it('회원가입', (done) => {
            agent
                .post('/users')
                .send({ name: fakeName, email: fakeEmail, password: fakePassword, password_confirmation: fakePassword })
                .expect(HTTPStatusCode.MOVED_TEMPORARILY, done);
        });

        it('로그인', (done) => {
            agent
                .post('/signin')
                .send({ email: fakeEmail, password: fakePassword })
                .expect(HTTPStatusCode.MOVED_TEMPORARILY, done);
        });

        it('가이드가 아닌 사용자 또한 여행 생성 불가', (done) => {
            agent.post('/tours').expect(HTTPStatusCode.INTERNAL_SERVER_ERROR, done);
        });
    });
});
