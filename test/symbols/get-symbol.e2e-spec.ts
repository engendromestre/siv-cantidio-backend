import request from 'supertest';
import { startApp } from "../../src/nest-modules/shared-module/testing/helpers";

describe('SymbolsController (e2e)', () => {
    const nestApp = startApp();

    describe('/symbols/:id (GET)', () => {
        describe('should a response error when id is invalid or not found', () => {
            const arrange = [
                {
                    id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
                    expected: {
                        message:
                            'Symbol Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
                        statusCode: 404,
                        error: 'Not Found',
                    },
                },
                {
                    id: 'fake id',
                    expected: {
                        statusCode: 422,
                        message: 'Validation failed (uuid is expected)',
                        error: 'Unprocessable Entity',
                    },
                },
            ];

            test.each(arrange)('when id is $id', async ({ id, expected }) => {
                return request(nestApp.app.getHttpServer())
                    .get(`/symbols/${id}`)
                    .authenticate(nestApp.app)
                    .expect(expected.statusCode)
                    .expect(expected);
            });
        });
    });
});