import request from 'supertest';

import {app} from "../src/app";

describe('/courses', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/')
    });

    it('should return 200 and some data', async () => {
        await request(app)
            .get('/courses')
            .expect(200, []);
    });

    it('should return 404 when course not exist', async () => {
        await request(app)
            .get('/courses/7')
            .expect(404);
    });

    it('should create correct data', async () => {
        const createResponse = await request(app)
            .post('/courses')
            .send({ title: 'some text'})
            .expect(201);

        const createdCourses = createResponse.body;

        expect(createdCourses).toEqual({
            id: expect.any(Number),
            title: 'some text',
        });

        await request(app)
            .get('/courses')
            .expect(200, [createdCourses]);
    });

    it('shouldn`t create correct data', async () => {
        await request(app)
            .post('/courses')
            .send()
            .expect(400);
    });

})