const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    if (mongoose.connection.readyState) {
        await mongoose.disconnect();
    }
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    // Close the express server if it started via app.js
    // Wait, app.js calls app.listen() if we just require it.
    // I need to ensure app.js doesn't listen in test env.
});

beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

let userToken;
let userId;

describe('FinEdge API Core Endpoints', () => {

    it('POST /users/register - Should register a new user', async () => {
        const res = await request(app)
            .post('/users/register')
            .send({ email: 'test@example.com', password: 'password123', name: 'Test User' });

        expect(res.statusCode).toEqual(201);
        expect(res.body.user).toHaveProperty('_id');
        expect(res.body.user.email).toBe('test@example.com');
    });

    it('POST /users/login - Should login and return token', async () => {
        await request(app)
            .post('/users/register')
            .send({ email: 'test@example.com', password: 'password123', name: 'Test User' });

        const res = await request(app)
            .post('/users/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        userToken = res.body.token;
        userId = res.body.user.id;
    });

    describe('Authenticated Routes', () => {
        beforeEach(async () => {
            // Need to register and login before each test here to get a token
            await request(app).post('/users/register').send({ email: 'auth@example.com', password: 'password', name: 'Auth' });
            const loginRes = await request(app).post('/users/login').send({ email: 'auth@example.com', password: 'password' });
            userToken = loginRes.body.token;
        });

        it('POST /transactions - Should add income transaction', async () => {
            const res = await request(app)
                .post('/transactions')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ type: 'income', amount: 5000, category: 'salary' });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('amount', 5000);
        });

        it('GET /summary - Should return income-expense summary', async () => {
            await request(app).post('/transactions').set('Authorization', `Bearer ${userToken}`).send({ type: 'income', amount: 2000, category: 'salary' });
            await request(app).post('/transactions').set('Authorization', `Bearer ${userToken}`).send({ type: 'expense', amount: 500, category: 'food' });

            const res = await request(app).get('/summary').set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.totalIncome).toBe(2000);
            expect(res.body.totalExpense).toBe(500);
            expect(res.body.balance).toBe(1500);
        });

        it('POST /budgets - Should set and retrieve budget', async () => {
            const setRes = await request(app)
                .post('/budgets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ month: 10, year: 2023, monthlyGoal: 1000, savingsTarget: 200 });

            expect(setRes.statusCode).toEqual(200);
            expect(setRes.body.monthlyGoal).toBe(1000);

            const getRes = await request(app).get('/budgets?month=10&year=2023').set('Authorization', `Bearer ${userToken}`);
            expect(getRes.statusCode).toEqual(200);
            expect(getRes.body.savingsTarget).toBe(200);
        });
    });
});
