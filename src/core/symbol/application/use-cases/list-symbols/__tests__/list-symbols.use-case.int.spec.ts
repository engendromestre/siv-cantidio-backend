import { SymbolSequelizeRepository } from "@core/symbol/infra/sequelize/symbol-sequelize.repository";
import { ListSymbolsUseCase } from "../list-symbols.use-case";
import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { SymbolModel } from "@core/symbol/infra/sequelize/symbol.model";
import { SymbolOutputMapper } from "../../common/symbol-output";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { SymbolSearchResult } from "@core/symbol/domain/symbol.repository";
import { InvalidArgumentError } from "@core/shared/domain/errors/invalid-argument.error";


describe('ListSymbolsUseCase Integration Tests', () => {
    let useCase: ListSymbolsUseCase;
    let repository: SymbolSequelizeRepository;

    setupSequelize({ models: [SymbolModel] });

    beforeEach(() => {
        repository = new SymbolSequelizeRepository(SymbolModel);
        useCase = new ListSymbolsUseCase(repository);
    });

    it('should return output sorted by created_at when input param is empty', async () => {
        const symbols = Symbol.fake()
            .theSymbols(2)
            .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
            .build();

        await repository.bulkInsert(symbols);
        const output = await useCase.execute({});
        expect(output).toEqual({
            items: [...symbols].reverse().map(SymbolOutputMapper.toOutput),
            total: 2,
            current_page: 1,
            per_page: 15,
            last_page: 1,
        });
    });

    it('should search applying paginate and filter by description', async () => {
        const symbols = [
            Symbol.fake().anIcon().withDescription('test').build(),
            Symbol.fake().anIcon().withDescription('a').build(),
            Symbol.fake().anIcon().withDescription('TEST').build(),
            Symbol.fake().anIcon().withDescription('e').build(),
            Symbol.fake().anIcon().withDescription('TeSt').build(),
        ];

        await repository.bulkInsert(symbols);

        let output = await useCase.execute({
            page: 1,
            per_page: 2,
            filter: { description: 'TEST' },
        });
    });

    describe('should search applying filter by description, sort and paginate', () => {
        const symbols = [
            Symbol.fake().anIcon().withDescription('test').build(),
            Symbol.fake().anIcon().withDescription('a').build(),
            Symbol.fake().anIcon().withDescription('TEST').build(),
            Symbol.fake().anIcon().withDescription('e').build(),
            Symbol.fake().anIcon().withDescription('TeSt').build(),
        ];

        const arrange = [
            {
                input: {
                    page: 1,
                    per_page: 2,
                    sort: 'description',
                    filter: { description: 'TEST' },
                },
                output: {
                    items: [symbols[2], symbols[4]].map(
                        SymbolOutputMapper.toOutput,
                    ),
                    total: 3,
                    current_page: 1,
                    per_page: 2,
                    last_page: 2,
                },
            },
        ];

        beforeEach(async () => {
            await repository.bulkInsert(symbols);
        });

        test.each(arrange)(
            'when value is $search_params',
            async ({ input, output: expectedOutput }) => {
                const output = await useCase.execute(input);
                expect(output).toEqual(expectedOutput);
            },
        );
    });

    describe('should search applying filter by is_active, sort and paginate', () => {
        const symbols = [
            Symbol.fake().anIcon().withDescription('test').activate().build(),
            Symbol.fake().anIcon().withDescription('a').deactivate().build(),
            Symbol.fake().anIcon().withDescription('TEST').activate().build(),
            Symbol.fake().anIcon().withDescription('e').deactivate().build(),
            Symbol.fake().anIcon().withDescription('TeSt').activate().build(),
            Symbol.fake().anIcon().withDescription('b').deactivate().build(),
        ];

        const arrange = [
            {
                input: {
                    page: 1,
                    per_page: 2,
                    sort: 'description',
                    filter: { is_active: true },
                },
                output: {
                    items: [symbols[2], symbols[4]].map(
                        SymbolOutputMapper.toOutput,
                    ),
                    total: 3,
                    current_page: 1,
                    per_page: 2,
                    last_page: 2,
                },
            },
            {
                input: {
                    page: 2,
                    per_page: 2,
                    sort: 'description',
                    filter: { is_active: true },
                },
                output: {
                    items: [symbols[0]].map(SymbolOutputMapper.toOutput),
                    total: 3,
                    current_page: 2,
                    per_page: 2,
                    last_page: 2,
                },
            },
            {
                input: {
                    page: 1,
                    per_page: 2,
                    sort: 'description',
                    filter: { is_active: false },
                },
                output: {
                    items: [symbols[1], symbols[5]].map(
                        SymbolOutputMapper.toOutput,
                    ),
                    total: 3,
                    current_page: 1,
                    per_page: 2,
                    last_page: 2,
                },
            },
        ];

        beforeEach(async () => {
            await repository.bulkInsert(symbols);
        });

        test.each(arrange)(
            'when value is $search_params',
            async ({ input, output: expectedOutput }) => {
                const output = await useCase.execute(input);
                expect(output).toEqual(expectedOutput);
            },
        );
    });

    it('should search using filter by description and is_active, sort and paginate', async () => {
        const symbols = [
            Symbol.fake().anIcon().withDescription('test').activate().build(),
            Symbol.fake().anIcon().withDescription('a description').deactivate().build(),
            Symbol.fake().anIcon().withDescription('TEST').activate().build(),
            Symbol.fake().anIcon().withDescription('e description').deactivate().build(),
            Symbol.fake().anIcon().withDescription('TeSt').activate().build(),
            Symbol.fake().anIcon().withDescription('b description').deactivate().build(),
        ];

        await repository.bulkInsert(symbols);

        let output = await useCase.execute({
            page: 1,
            per_page: 2,
            sort: 'description',
            filter: { description: 'TEST', is_active: true },
        });

        expect(output).toEqual({
            items: [symbols[2], symbols[4]].map(
                SymbolOutputMapper.toOutput,
            ),
            total: 3,
            current_page: 1,
            per_page: 2,
            last_page: 2,
        });

        output = await useCase.execute({
            page: 2,
            per_page: 2,
            sort: 'description',
            filter: { description: 'TEST', is_active: true },
        });
        expect(output).toEqual({
            items: [symbols[0]].map(SymbolOutputMapper.toOutput),
            total: 3,
            current_page: 2,
            per_page: 2,
            last_page: 2,
        });

        output = await useCase.execute({
            page: 1,
            per_page: 2,
            sort: 'description',
            sort_dir: 'asc',
            filter: { description: 'description', is_active: false },
        });

        expect(output).toEqual({
            items: [symbols[1], symbols[5]].map(
                SymbolOutputMapper.toOutput,
            ),
            total: 3,
            current_page: 1,
            per_page: 2,
            last_page: 2,
        });

        output = await useCase.execute({
            page: 2,
            per_page: 2,
            sort: 'description',
            sort_dir: 'asc',
            filter: { description: 'description', is_active: false },
        });

        expect(output).toEqual({
            items: [symbols[3]].map(SymbolOutputMapper.toOutput),
            total: 3,
            current_page: 2,
            per_page: 2,
            last_page: 2,
        });
    });

    describe('findByIds', () => {
        const symbols = [
            Symbol.fake().anIcon().withDescription('test').build(),
            Symbol.fake().anIcon().withDescription('a').build(),
            Symbol.fake().anIcon().withDescription('TEST').build(),
            Symbol.fake().anIcon().withDescription('e').build(),
            Symbol.fake().anIcon().withDescription('TeSt').build(),
        ];

        beforeEach(async () => {
            await repository.bulkInsert(symbols);
        });

        test('should return the symbols by ids', async () => {
            const ids = [symbols[0].symbol_id, symbols[2].symbol_id];
            const result = await repository.findByIds(ids);
            const resultIds = result.map((symbol) => symbol.entity_id);
            expect(resultIds).toEqual(expect.arrayContaining(ids));
            expect(resultIds.length).toBe(ids.length);
        });

        test('should return empty array for non-existing ids', async () => {
            const nonExistentIds = [
                new SymbolId('d2f4e05e-70e2-4c69-bb1b-f0051a0d8e9a'),
                new SymbolId('3d6b5469-5c8e-43d4-b3e8-989d76a0c8c7'),
            ];
            const result = await repository.findByIds(nonExistentIds);
            expect(result).toEqual([]);
        });
    });
});