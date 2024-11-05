import { SymbolOutputMapper } from "@core/symbol/application/use-cases/common/symbol-output";
import { SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { ISymbolRepository } from "@core/symbol/domain/symbol.repository";
import { instanceToPlain } from "class-transformer";
import { SymbolsController } from "../../src/nest-modules/symbols-module/symbols.controller";
import request from 'supertest';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { SYMBOL_PROVIDERS } from "../../src/nest-modules/symbols-module/symbols.providers";
import { CreateSymbolFixture } from "../../src/nest-modules/symbols-module/testing/symbol-fixture";



describe('SymbolsController (e2e)', () => {
    const appHelper = startApp();
    let symbolRepo: ISymbolRepository;

    beforeEach(async () => {
        symbolRepo = appHelper.app.get<ISymbolRepository>(
            SYMBOL_PROVIDERS.REPOSITORIES.SYMBOL_REPOSITORY.provide,
        );
    });

    describe('/symbols (POST)', () => {
        describe('unauthenticated', () => {
            const app = startApp();

            test('should return 401 when not authenticated', () => {
                return request(app.app.getHttpServer())
                    .post('/symbols')
                    .send({})
                    .expect(401);
            });

            test('should return 403 when not authenticated as admin', () => {
                return request(app.app.getHttpServer())
                    .post('/symbols')
                    .authenticate(app.app, false)
                    .send({})
                    .expect(403);
            });
        });

        describe('should return a response error with 422 status code when request body is invalid', () => {
            const invalidRequest = CreateSymbolFixture.arrangeInvalidRequest();
            const arrange = Object.keys(invalidRequest).map((key) => ({
                label: key,
                value: invalidRequest[key],
            }));

            test.each(arrange)('when body is $label', ({ value }) => {
                return request(appHelper.app.getHttpServer())
                    .post('/symbols')
                    .authenticate(appHelper.app)
                    .send(value.send_data)
                    .expect(422)
                    .expect(value.expected);
            });

        });

        describe('should return a response error with 422 status code when throw EntityValidationError', () => {
            const invalidRequest =
                CreateSymbolFixture.arrangeForEntityValidationError();

            const arrange = Object.keys(invalidRequest).map((key) => ({
                label: key,
                value: invalidRequest[key],
            }));

            test.each(arrange)('when body is $label', ({ value }) => {
                return request(appHelper.app.getHttpServer())
                    .post('/symbols')
                    .authenticate(appHelper.app)
                    .send(value.send_data)
                    .expect(422)
                    .expect(value.expected);
            });
        });

        describe('should create a symbol', () => {
            const app = startApp();
            const arrange = CreateSymbolFixture.arrangeForCreate();
            let symbolRepo: ISymbolRepository;
            beforeEach(async () => {
                symbolRepo = app.app.get<ISymbolRepository>(
                    SYMBOL_PROVIDERS.REPOSITORIES.SYMBOL_REPOSITORY.provide,
                );
            });
            test.each(arrange)(
                'when body is $send_data',
                async ({ send_data, expected }) => {
                    const res = await request(app.app.getHttpServer())
                        .post('/symbols')
                        .authenticate(appHelper.app)
                        .send(send_data)
                        .expect(201);

                    const keyInResponse = CreateSymbolFixture.keysInResponse;
                    expect(Object.keys(res.body)).toStrictEqual(['data']);
                    expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);
                    const id = res.body.data.id;
                    const symbolCreated = await symbolRepo.findById(
                        new SymbolId(id),
                    );
                    const presenter = SymbolsController.serialize(
                        SymbolOutputMapper.toOutput(symbolCreated!),
                    );
                    const serialized = instanceToPlain(presenter);
                    expect(res.body.data).toStrictEqual({
                        id: serialized.id,
                        created_at: serialized.created_at,
                        ...expected,
                    });
                },
            );
        });
    });
})