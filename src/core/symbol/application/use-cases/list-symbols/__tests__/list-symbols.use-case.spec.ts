import { SortDirection } from "@core/shared/domain/repository/search-params";
import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";
import { Symbol } from "@core/symbol/domain/symbol.aggregate";
import { SymbolSearchResult } from "@core/symbol/domain/symbol.repository";
import { SymbolInMemoryRepository } from "@core/symbol/infra/in-memory/symbol-in-memory.repository";
import { SymbolOutputMapper } from "../../common/symbol-output";
import { ListSymbolsUseCase } from "../list-symbols.use-case";

describe('ListSymbolsUseCase Unit Tests', () => {
    let useCase: ListSymbolsUseCase;
    let repository: SymbolInMemoryRepository;

    beforeEach(() => {
        repository = new SymbolInMemoryRepository();
        useCase = new ListSymbolsUseCase(repository);
    });

    it('should test toOutput method', () => {
        let result = new SymbolSearchResult({
            items: [],
            total: 1,
            current_page: 1,
            per_page: 2,
        });

        let output = useCase['toOutput'](result);

        expect(output).toStrictEqual({
            items: [],
            total: 1,
            current_page: 1,
            per_page: 2,
            last_page: 1,
        });

        const entity = Symbol.fake().anIcon().build();

        result = new SymbolSearchResult({
            items: [entity],
            total: 1,
            current_page: 1,
            per_page: 2,
        });

        output = useCase['toOutput'](result);

        expect(output).toStrictEqual({
            items: [entity].map(SymbolOutputMapper.toOutput),
            total: 1,
            current_page: 1,
            per_page: 2,
            last_page: 1,
        });
    });

    it('should search sorted by created_at when an input params is empty', async () => {
        const items = [
            Symbol.fake().anIcon().build(),
            Symbol.fake()
                .anIcon()
                .withCreatedAt(new Date(new Date().getTime() + 100))
                .build(),
        ];

        repository.items = items;
        const output = await useCase.execute({});
        expect(output).toStrictEqual({
            items: [...items].reverse().map(SymbolOutputMapper.toOutput),
            total: 2,
            current_page: 1,
            per_page: 15,
            last_page: 1,
        });
    });

    it('should search applying paginate and filter by description', async () => {
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

        let output = await useCase.execute({
            page: 1,
            per_page: 2,
            filter: { description: 'TEST' },
        });

        expect(output).toStrictEqual({
            items: [symbols[0], symbols[2]].map(
                SymbolOutputMapper.toOutput
            ),
            total: 3,
            current_page: 1,
            per_page: 2,
            last_page: 2,
        });

        output = await useCase.execute({
            page: 2,
            per_page: 2,
            filter: { description: 'TEST' },
        });

        expect(output).toStrictEqual({
            items: [symbols[3]].map(
                SymbolOutputMapper.toOutput
            ),
            total: 3,
            current_page: 2,
            per_page: 2,
            last_page: 2,
        });
    });

    it('should search applying paginate and filter by type', async () => {
        const created_at = new Date();
        const symbols = [
            Symbol.fake()
                .anIcon()
                .withDescription('icon1')
                .withCreatedAt(created_at)
                .build(),
            Symbol.fake()
                .anIcon()
                .withDescription('icon2')
                .withCreatedAt(created_at)
                .build(),
            Symbol.fake()
                .anIcon()
                .withDescription('icon3')
                .withCreatedAt(created_at)
                .build(),
            Symbol.fake()
                .anIcon()
                .withDescription('icon4')
                .withCreatedAt(created_at)
                .build(),
        ];

        await repository.bulkInsert(symbols);

        const arrange = [
            {
                input: {
                    page: 1,
                    per_page: 2,
                    filter: { type: SymbolTypes.ICON },
                },
                output: {
                    items: [symbols[0], symbols[1]].map(
                        SymbolOutputMapper.toOutput,
                    ),
                    total: 4,
                    current_page: 1,
                    per_page: 2,
                    last_page: 2,
                }
            }
        ];

        for (const item of arrange) {
            const output = await useCase.execute(item.input);
            expect(output).toStrictEqual(item.output);
        }
    });

    it('should search applying paginate and sort', async () => {

        const symbols = [
            Symbol.fake()
                .anIcon()
                .withDescription('b')
                .build(),
            Symbol.fake()
                .anIcon()
                .withDescription('a')
                .build(),
            Symbol.fake()
                .anIcon()
                .withDescription('d')
                .build(),
            Symbol.fake()
                .anIcon()
                .withDescription('e')
                .build(),
            Symbol.fake()
                .anIcon()
                .withDescription('c')
                .build(),
        ];

        await repository.bulkInsert(symbols);

        const arrange = [
            {
                input: {
                    page: 1,
                    per_page: 2,
                    sort: 'description',
                },
                output: {
                    items: [symbols[1], symbols[0]].map(
                        SymbolOutputMapper.toOutput,
                    ),
                    total: 5,
                    current_page: 1,
                    per_page: 2,
                    last_page: 3,
                }
            },
            {
                input: {
                    page: 2,
                    per_page: 2,
                    sort: 'description',
                },
                output: {
                    items: [symbols[4], symbols[2]].map(
                        SymbolOutputMapper.toOutput,
                    ),
                    total: 5,
                    current_page: 2,
                    per_page: 2,
                    last_page: 3,
                }
            },
            {
                input: {
                    page: 1,
                    per_page: 2,
                    sort: 'description',
                    sort_dir: 'desc' as SortDirection,
                },
                output: {
                    items: [symbols[3], symbols[2]].map(
                        SymbolOutputMapper.toOutput,
                    ),
                    total: 5,
                    current_page: 1,
                    per_page: 2,
                    last_page: 3,
                }
            },
            {
                input: {
                    page: 2,
                    per_page: 2,
                    sort: 'description',
                    sort_dir: 'desc' as SortDirection,
                },
                output: {
                    items: [symbols[4], symbols[0]].map(
                        SymbolOutputMapper.toOutput,
                    ),
                    total: 5,
                    current_page: 2,
                    per_page: 2,
                    last_page: 3,
                },
            },
        ];

        for (const item of arrange) {
            const output = await useCase.execute(item.input);
            expect(output).toStrictEqual(item.output);
        }
    });

    describe('should search applying filter by description, sort and paginate', () => {
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
            {
                input: {
                    page: 2,
                    per_page: 2,
                    sort: 'description',
                    filter: { description: 'TEST' },
                },
                output: {
                    items: [symbols[0]].map(SymbolOutputMapper.toOutput),
                    total: 3,
                    current_page: 2,
                    per_page: 2,
                    last_page: 2,
                },
            },
        ];

        test.each(arrange)(
            'when value is $search_params',
            async ({ input, output: expectedOutput }) => {
                const output = await useCase.execute(input);
                expect(output).toStrictEqual(expectedOutput);
            },
        );
    });

    describe('should search applying filter by type, sort and paginate', () => {
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

        const arrange = [
            {
                input: {
                    page: 1,
                    per_page: 2,
                    sort: 'description',
                    filter: { type: SymbolTypes.ICON },
                },
                output: {
                    items: [symbols[2], symbols[4]].map(
                        SymbolOutputMapper.toOutput,
                    ),
                    total: 5,
                    current_page: 1,
                    per_page: 2,
                    last_page: 3,
                },
            },
        ];

        test.each(arrange)(
            'when value is $search_params',
            async ({ input, output: expectedOutput }) => {
                const output = await useCase.execute(input);
                expect(output).toStrictEqual(expectedOutput);
            },
        );
    });

    it('should search using filter by description and type, sort and paginate', async () => {
        const symbols = [
            Symbol.fake().anIcon().withDescription('test').build(),
            Symbol.fake().anIcon().withDescription('a').build(),
            Symbol.fake().anIcon().withDescription('TEST').build(),
            Symbol.fake().anIcon().withDescription('e').build(),
            Symbol.fake().anIcon().withDescription('TeSt').build(),
        ];

        repository.items = symbols;

        let output = await useCase.execute({
            page: 1,
            per_page: 2,
            sort: 'description',
            filter: { description: 'TEST', type: SymbolTypes.ICON },
        });

        expect(output).toStrictEqual({
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
            filter: { description: 'TEST', type: SymbolTypes.ICON },
        });
        expect(output).toStrictEqual({
            items: [symbols[0]].map(SymbolOutputMapper.toOutput),
            total: 3,
            current_page: 2,
            per_page: 2,
            last_page: 2,
        });
    });

    it('should search applying paginate and sort', async () => {
        expect(repository.sortableFields).toStrictEqual(['description', 'created_at']);

        const symbols = [
            Symbol.fake().anIcon().withDescription('b').build(),
            Symbol.fake().anIcon().withDescription('a').build(),
            Symbol.fake().anIcon().withDescription('d').build(),
            Symbol.fake().anIcon().withDescription('e').build(),
            Symbol.fake().anIcon().withDescription('c').build(),
        ];

        await repository.bulkInsert(symbols);

        const arrange = [
            {
                input: {
                    page: 1,
                    per_page: 2,
                    sort: 'description',
                },
                output: {
                    items: [symbols[1], symbols[0]].map(
                        SymbolOutputMapper.toOutput,
                    ),
                    total: 5,
                    current_page: 1,
                    per_page: 2,
                    last_page: 3,
                },
            },
            {
                input: {
                    page: 2,
                    per_page: 2,
                    sort: 'description',
                },
                output: {
                    items: [symbols[4], symbols[2]].map(
                        SymbolOutputMapper.toOutput,
                    ),
                    total: 5,
                    current_page: 2,
                    per_page: 2,
                    last_page: 3,
                },
            },
            {
                input: {
                    page: 1,
                    per_page: 2,
                    sort: 'description',
                    sort_dir: 'desc' as SortDirection,
                },
                output: {
                    items: [symbols[3], symbols[2]].map(
                        SymbolOutputMapper.toOutput,
                    ),
                    total: 5,
                    current_page: 1,
                    per_page: 2,
                    last_page: 3,
                },
            },
            {
                input: {
                    page: 2,
                    per_page: 2,
                    sort: 'description',
                    sort_dir: 'desc' as SortDirection,
                },
                output: {
                    items: [symbols[4], symbols[0]].map(
                        SymbolOutputMapper.toOutput,
                    ),
                    total: 5,
                    current_page: 2,
                    per_page: 2,
                    last_page: 3,
                },
            },
        ];

        for (const item of arrange) {
            const output = await useCase.execute(item.input);
            expect(output).toStrictEqual(item.output);
        }
    });
});
