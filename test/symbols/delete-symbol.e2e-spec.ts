import { Symbol } from "@core/symbol/domain/symbol.aggregate";
import { ISymbolRepository } from '@core/symbol/domain/symbol.repository';
import request from 'supertest';
import { startApp } from "../../src/nest-modules/shared-module/testing/helpers";
import { SYMBOL_PROVIDERS } from '../../src/nest-modules/symbols-module/symbols.providers';


describe('SymbolsController (e2e)', () => {
    describe('SymbolsController (e2e)', () => {
        const appHelper = startApp();
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
                return request(appHelper.app.getHttpServer())
                    .delete(`/symbols/${id}`)
                    .authenticate(appHelper.app)
                    .expect(expected.statusCode)
                    .expect(expected);
            });
        });

        it('should delete a symbol response with status 204', async () => {
            const symbolRepo = appHelper.app.get<ISymbolRepository>(
                SYMBOL_PROVIDERS.REPOSITORIES.SYMBOL_REPOSITORY.provide,
            );
            const symbol = Symbol.fake().anIcon().build();
            await symbolRepo.insert(symbol);

            await request(appHelper.app.getHttpServer())
                .delete(`/symbols/${symbol.symbol_id.id}`)
                .authenticate(appHelper.app)
                .expect(204);

            await expect(
                symbolRepo.findById(symbol.symbol_id),
            ).resolves.toBeNull();
        });
    });
});