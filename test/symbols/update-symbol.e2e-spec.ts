import { Symbol } from "@core/symbol/domain/symbol.aggregate";
import request from 'supertest';
import { startApp } from "../../src/nest-modules/shared-module/testing/helpers";
import { UpdateSymbolFixture } from "../../src/nest-modules/symbols-module/testing/symbol-fixture";

describe('SymbolsController (e2e)', () => {
    const uuid = '9366b7dc-2d71-4799-b91c-c64adb205104';

    describe('/symbols/:id (PATCH)', () => {
        describe('should a response error when id is invalid or not found', () => {
            const nestApp = startApp();
            const faker = Symbol.fake().anIcon();
            const arrange = [
                {
                    id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
                    send_data: { description: faker.description },
                    expected: {
                        message:
                            'Symbol Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
                        statusCode: 404,
                        error: 'Not Found',
                    },
                },
                {
                    id: 'fake id',
                    send_data: { description: faker.description },
                    expected: {
                        statusCode: 422,
                        message: 'Validation failed (uuid is expected)',
                        error: 'Unprocessable Entity',
                    },
                },
            ];

            test.each(arrange)(
                'when id is $id',
                async ({ id, send_data, expected }) => {
                    return request(nestApp.app.getHttpServer())
                        .patch(`/symbols/${id}`)
                        .authenticate(nestApp.app)
                        .send(send_data)
                        .expect(expected.statusCode)
                        .expect(expected);
                },
            );
        })

        describe('should a response error with 422 when request body is invalid', () => {
            const nestApp = startApp();
            const invalidRequest = UpdateSymbolFixture.arrangeInvalidRequest();
            const arrange = Object.keys(invalidRequest).map((key) => ({
                label: key,
                value: invalidRequest[key],
            }));
            test.each(arrange)('when body is $label', ({ value }) => {
                return request(nestApp.app.getHttpServer())
                    .patch(`/symbols/${uuid}`)
                    .authenticate(nestApp.app)
                    .send(value.send_data)
                    .expect(422)
                    .expect(value.expected);
            });

        });
    })
})