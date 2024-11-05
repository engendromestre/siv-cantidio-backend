import { SymbolOutputMapper } from "@core/symbol/application/use-cases/common/symbol-output";
import { ISymbolRepository } from "@core/symbol/domain/symbol.repository";
import { instanceToPlain } from "class-transformer";
import qs from "qs";
import request from 'supertest';
import { startApp } from "../../src/nest-modules/shared-module/testing/helpers";
import { SymbolsController } from "../../src/nest-modules/symbols-module/symbols.controller";
import { SYMBOL_PROVIDERS } from "../../src/nest-modules/symbols-module/symbols.providers";
import { ListSymbolsFixture } from "../../src/nest-modules/symbols-module/testing/symbol-fixture";

describe('SymbolsController (e2e)', () => {
    describe('/symbols (GET)', () => {
        describe('should return symbols sorted by created_at when request query is empty', () => {
            let symbolRepo: ISymbolRepository;
            const nestApp = startApp();
            const { entitiesMap, arrange } =
                ListSymbolsFixture.arrangeIncrementedWithCreatedAt();

            beforeEach(async () => {
                symbolRepo = nestApp.app.get<ISymbolRepository>(
                    SYMBOL_PROVIDERS.REPOSITORIES.SYMBOL_REPOSITORY.provide,
                );
                await symbolRepo.bulkInsert(Object.values(entitiesMap));
            });

            test.each(arrange)(
                'when query params is $send_data',
                async ({ send_data, expected }) => {
                    const queryParams = new URLSearchParams(send_data as any).toString();
                    return request(nestApp.app.getHttpServer())
                        .get(`/symbols/?${queryParams}`)
                        .authenticate(nestApp.app)
                        .expect(200)
                        .expect({
                            data: expected.entities.map((e) =>
                                instanceToPlain(
                                    SymbolsController.serialize(
                                        SymbolOutputMapper.toOutput(e),
                                    ),
                                ),
                            ),
                            meta: expected.meta,
                        });
                },
            );
        });

        describe('should return symbols using paginate, filter and sort', () => {
            let symbolRepo: ISymbolRepository;
            const nestApp = startApp();
            const { entitiesMap, arrange } = ListSymbolsFixture.arrangeUnsorted();

            beforeEach(async () => {
                symbolRepo = nestApp.app.get<ISymbolRepository>(
                    SYMBOL_PROVIDERS.REPOSITORIES.SYMBOL_REPOSITORY.provide,
                );
                await symbolRepo.bulkInsert(Object.values(entitiesMap));
            });
            
            test.each([arrange])(
                'when query params is $send_data',
                async ({ send_data, expected }) => {
                    const queryParams = qs.stringify(send_data as any);
                    return request(nestApp.app.getHttpServer())
                        .get(`/symbols/?${queryParams}`)
                        .authenticate(nestApp.app)
                        .expect(200)
                        .expect({
                            data: expected.entities.map((e) =>
                                instanceToPlain(
                                    SymbolsController.serialize(
                                        SymbolOutputMapper.toOutput(e),
                                    ),
                                ),
                            ),
                            meta: expected.meta,
                        });
                },
            );
        });
    });
});