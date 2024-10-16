import { NotFoundError } from "@core/shared/domain/errors/not-found.error";
import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { SymbolSearchParams, SymbolSearchResult } from "@core/symbol/domain/symbol.repository";
import orderBy from 'lodash/orderBy';
import { SymbolModelMapper } from "../symbol-model-mapper";
import { SymbolSequelizeRepository } from "../symbol-sequelize.repository";
import { SymbolModel } from "../symbol.model";
import { InvalidArgumentError } from "@core/shared/domain/errors/invalid-argument.error";
import { literal } from "sequelize";

describe('SymbolSequelizeRepository Integration Test', () => {
    let repository: SymbolSequelizeRepository;
    setupSequelize({ models: [SymbolModel] });

    beforeEach(async () => {
        repository = new SymbolSequelizeRepository(SymbolModel);
    });

    it('should inserts a new entity', async () => {
        const symbol = Symbol.fake().anIcon().build();
        await repository.insert(symbol);
        const symbolCreated = await repository.findById(symbol.symbol_id);
        expect(symbolCreated!.toJSON()).toStrictEqual(symbol.toJSON());
    });

    it('should bulk inserts new entities', async () => {
        const symbols = Symbol.fake()
            .theIcons(16)
            .withCreatedAt((index) => new Date(new Date().getTime() + 100 + index))
            .build();
        await repository.bulkInsert(symbols);
        const spyToEntity = jest.spyOn(SymbolModelMapper, 'toEntity');
        const searchOutput = await repository.search(SymbolSearchParams.create());

        expect(searchOutput).toBeInstanceOf(SymbolSearchResult);
        expect(spyToEntity).toHaveBeenCalledTimes(15);

        expect(searchOutput.toJSON()).toMatchObject({
            total: 16,
            current_page: 1,
            last_page: 2,
            per_page: 15,
        });
    });

    it('should return all symbols', async () => {
        const symbol = Symbol.fake().anIcon().build();
        await repository.insert(symbol);
        const symbols = await repository.findAll();
        expect(symbols).toContainEqual(symbol);
        expect(symbols).toHaveLength(1);
    });

    it('should throw error on update when a entity not found', async () => {
        const symbol = Symbol.fake().anIcon().build();
        await expect(repository.update(symbol)).rejects.toThrow(
            new NotFoundError(symbol.symbol_id.id, Symbol),
        );
    });

    it('should update an symbol', async () => {
        const symbol = Symbol.fake().anIcon().build();
        await repository.insert(symbol);
        symbol.changeDescription('Updated Description');
        await repository.update(symbol);
        const symbolUpdated = await repository.findById(symbol.symbol_id);
        expect(symbolUpdated!.description).toBe('Updated Description');
    });

    it('should delete an symbol', async () => {
        const symbol = Symbol.fake().anIcon().build();
        await repository.insert(symbol);
        await repository.delete(symbol.symbol_id);
        const symbolFound = await repository.findById(symbol.symbol_id);
        expect(symbolFound).toBeNull();
    });

    it('should throw error on delete when a entity is not found', async () => {
        const symbol = Symbol.fake().anIcon().build();
        await expect(repository.delete(symbol.symbol_id)).rejects.toThrow(
            new NotFoundError(symbol.symbol_id.id, Symbol),
        );
    });

    describe('search method tests', () => {
        it('should order by created_at DESC when search params are null', async () => {
            const symbols = Symbol.fake()
                .theIcons(16)
                .withCreatedAt((index) => new Date(new Date().getTime() + 100 + index))
                .build();

            await repository.bulkInsert(symbols);
            const spyToEntity = jest.spyOn(SymbolModelMapper, 'toEntity');
            const searchOutput = await repository.search(SymbolSearchParams.create());

            expect(searchOutput).toBeInstanceOf(SymbolSearchResult);
            expect(spyToEntity).toHaveBeenCalledTimes(15);

            expect(searchOutput.toJSON()).toMatchObject({
                total: 16,
                current_page: 1,
                last_page: 2,
                per_page: 15,
            });
        });

        it('should apply paginate and filter by description', async () => {
            const created_at = new Date();
            const symbols = [
                Symbol.fake()
                    .anIcon()
                    .withDescription('test')
                    .withCreatedAt(created_at)
                    .build(),
                Symbol.fake()
                    .anIcon()
                    .withDescription('a')
                    .withCreatedAt(created_at)
                    .build(),
                Symbol.fake()
                    .anIcon()
                    .withDescription('TEST')
                    .withCreatedAt(created_at)
                    .build(),
                Symbol.fake()
                    .anIcon()
                    .withDescription('TeSt')
                    .withCreatedAt(created_at)
                    .build(),
            ];

            await repository.bulkInsert(symbols);

            let searchOutput = await repository.search(
                SymbolSearchParams.create({
                    page: 1,
                    per_page: 2,
                    filter: { description: 'TEST' },
                }),
            );

            expect(searchOutput.toJSON(true)).toMatchObject(
                new SymbolSearchResult({
                    items: [symbols[0], symbols[2]],
                    total: 3,
                    current_page: 1,
                    per_page: 2,
                }).toJSON(true),
            );

            searchOutput = await repository.search(
                SymbolSearchParams.create({
                    page: 2,
                    per_page: 2,
                    filter: { description: 'TEST' },
                }),
            );

            expect(searchOutput.toJSON(true)).toMatchObject(
                new SymbolSearchResult({
                    items: [symbols[3]],
                    total: 3,
                    current_page: 2,
                    per_page: 2,
                }).toJSON(true),
            );
        });

        it('should apply paginate and filter by type', async () => {
            const created_at = new Date();
            const symbols = [
                Symbol.fake()
                    .anIcon()
                    .withDescription('description 1')
                    .withCreatedAt(created_at)
                    .build(),
                Symbol.fake()
                    .anIcon()
                    .withDescription('description 2')
                    .withCreatedAt(created_at)
                    .build(),
                Symbol.fake()
                    .anIcon()
                    .withDescription('description 3')
                    .withCreatedAt(created_at)
                    .build(),
                Symbol.fake()
                    .anIcon()
                    .withDescription('description 4')
                    .withCreatedAt(created_at)
                    .build(),
            ];

            await repository.bulkInsert(symbols);

            const arrange = [
                {
                    params: SymbolSearchParams.create({
                        page: 1,
                        per_page: 2,
                        filter: { type: SymbolTypes.ICON },
                    }),
                    result: {
                        items: [symbols[0], symbols[1]],
                        total: 4,
                        current_page: 1,
                    },
                }
            ];

            for (const item of arrange) {
                const searchOutput = await repository.search(item.params);
                const { items, ...otherOutput } = searchOutput;
                const { items: itemsExpected, ...otherExpected } = item.result;
                expect(otherOutput).toMatchObject(otherExpected);

                orderBy(items, ['description']).forEach((item, key) => {
                    expect(item.toJSON()).toStrictEqual(itemsExpected[key].toJSON());
                });
            }
        });

        it('should apply paginate and filter by is_active', async () => {
            const created_at = new Date();
            const symbols = [
                Symbol.fake()
                    .anIcon()
                    .withDescription('description 1')
                    .activate()
                    .withCreatedAt(created_at)
                    .build(),
                Symbol.fake()
                    .anIcon()
                    .withDescription('description 2')
                    .activate()
                    .withCreatedAt(created_at)
                    .build(),
                Symbol.fake()
                    .anIcon()
                    .withDescription('description 3')
                    .activate()
                    .withCreatedAt(created_at)
                    .build(),
                Symbol.fake()
                    .anIcon()
                    .withDescription('description 4')
                    .deactivate()
                    .withCreatedAt(created_at)
                    .build(),
                Symbol.fake()
                    .anIcon()
                    .withDescription('description 5')
                    .deactivate()
                    .withCreatedAt(created_at)
                    .build(),
                Symbol.fake()
                    .anIcon()
                    .withDescription('description 6')
                    .deactivate()
                    .withCreatedAt(created_at)
                    .build(),
            ];

            await repository.bulkInsert(symbols);

            const arrange = [
                {
                    params: SymbolSearchParams.create({
                        page: 1,
                        per_page: 2,
                        filter: { is_active: true },
                    }),
                    result: {
                        items: [symbols[0], symbols[1]],
                        total: 3,
                        current_page: 1,
                        per_page: 2,
                    },
                },
                {
                    params: SymbolSearchParams.create({
                        page: 2,
                        per_page: 2,
                        filter: { is_active: true },
                    }),
                    result: {
                        items: [symbols[2]],
                        total: 3,
                        current_page: 2,
                    },
                },
                {
                    params: SymbolSearchParams.create({
                        page: 1,
                        per_page: 2,
                        filter: { is_active: false },
                    }),
                    result: {
                        items: [symbols[3], symbols[4]],
                        total: 3,
                        current_page: 1,
                        per_page: 2,
                    },
                },
            ];

            for (const item of arrange) {
                const searchOutput = await repository.search(item.params);
                const { items, ...otherOutput } = searchOutput;

                const { items: itemsExpected, ...otherExpected } = item.result;
                expect(otherOutput).toMatchObject(otherExpected);

                orderBy(items, ['description']).forEach((item, key) => {
                    expect(item.toJSON()).toStrictEqual(itemsExpected[key].toJSON());
                });
            }
        });
    });

    describe('existsById', () => {
        const symbols = [
            Symbol.fake().anIcon().withDescription('test').build(),
            Symbol.fake().anIcon().withDescription('a').build(),
            Symbol.fake().anIcon().withDescription('TEST').build(),
            Symbol.fake().anIcon().withDescription('e').build(),
            Symbol.fake().anIcon().withDescription('TeSt').build(),
        ];

        const nonExistentSymbols = [
            new SymbolId('d2f4e05e-70e2-4c69-bb1b-f0051a0d8e9a'),
            new SymbolId('3d6b5469-5c8e-43d4-b3e8-989d76a0c8c7'),
        ];

        beforeEach(async () => {
            await repository.bulkInsert(symbols);
        });

        test('should throw an error if the ids array is empty', async () => {
            await expect(repository.existsById([])).rejects.toThrow(InvalidArgumentError);
        });

        test('should return existing and non-existing ids', async () => {
            const existingSymbols = symbols.map((symbol) => symbol.symbol_id);
            const idsToCheck = [...existingSymbols, ...nonExistentSymbols];
            const result = await repository.existsById(idsToCheck);

            expect(result.exists).toEqual(expect.arrayContaining(existingSymbols));
            expect(result.not_exists).toEqual(expect.arrayContaining(nonExistentSymbols));
        });

        test('should return only existing ids when all provided ids exist', async () => {
            const existingSymbols = symbols.map((symbol) => symbol.symbol_id);
            const result = await repository.existsById(existingSymbols);

            expect(result.exists).toEqual(expect.arrayContaining(existingSymbols));
            expect(result.not_exists).toEqual([]);
        });
    });

    describe('OrderBy Configuration', () => {
        test('should return correct SQL literal for description sorting', () => {
            const sortAsc = repository.orderBy.mysql.description('asc');
            const sortDesc = repository.orderBy.mysql.description('desc');

            expect(sortAsc).toEqual(literal('binary description asc'));
            expect(sortDesc).toEqual(literal('binary description desc'));
        });
    });
});