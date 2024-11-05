import { SortDirection } from "@core/shared/domain/repository/search-params";
import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";
import { Symbol } from "@core/symbol/domain/symbol.aggregate";

const _keysInResponse = [
    'id',
    'description',
    'is_active',
    'type',
    'created_at',
]

export class GetSymbolFixture {
    static keysInResponse = _keysInResponse;
}

export class CreateSymbolFixture {
    static keysInResponse = _keysInResponse;

    static arrangeForCreate() {
        const faker =
            Symbol.fake()
                .anIcon()
                .withDescription('TEST');

        return [
            {
                send_data: {
                    description: faker.description,
                    type: SymbolTypes.ICON,
                },
                expected: {
                    description: faker.description,
                    type: SymbolTypes.ICON,
                    is_active: true,
                }
            }
        ]
    }

    static arrangeInvalidRequest() {
        const faker = Symbol.fake().anIcon().withDescription("TEST");

        const defaultExpected = {
            statusCode: 422,
            error: 'Unprocessable Entity',
        }

        return {
            EMPTY: {
                send_data: {},
                expected: {
                    message: [
                        'description should not be empty',
                        'description must be a string',
                        'type should not be empty',
                        'type must be an integer number'
                    ],
                    ...defaultExpected,
                },
            },
            DESCRIPTION_UNDEFINED: {
                send_data: {
                    description: undefined,
                    type: faker.type.type,
                },
                expected: {
                    message: [
                        'description should not be empty',
                        'description must be a string'
                    ],
                    ...defaultExpected,
                },
            },
            DESCRIPTION_NULL: {
                send_data: {
                    description: null,
                    type: faker.type.type,
                },
                expected: {
                    message: [
                        'description should not be empty',
                        'description must be a string'
                    ],
                    ...defaultExpected,
                },
            },
            DESCRIPTION_EMPTY: {
                send_data: {
                    description: '',
                    type: faker.type.type,
                },
                expected: {
                    message: ['description should not be empty'],
                    ...defaultExpected,
                },
            },
            TYPE_UNDEFINED: {
                send_data: {
                    description: faker.withDescription('TEST').description,
                    type: undefined,
                },
                expected: {
                    message: ['type should not be empty', 'type must be an integer number'],
                    ...defaultExpected,
                },
            },
            TYPE_NULL: {
                send_data: {
                    description: faker.withDescription('TEST').description,
                    type: null,
                },
                expected: {
                    message: ['type should not be empty', 'type must be an integer number'],
                    ...defaultExpected,
                },
            },
            TYPE_EMPTY: {
                send_data: {
                    description: faker.withDescription('TEST').description,
                    type: '',
                },
                expected: {
                    message: ['type should not be empty', 'type must be an integer number'],
                    ...defaultExpected,
                },
            },
            TYPE_NOT_A_NUMBER: {
                send_data: {
                    description: faker.withDescription('TEST').description,
                    type: 'a',
                },
                expected: {
                    message: ['type must be an integer number'],
                    ...defaultExpected,
                },
            }
        }
    }

    static arrangeForEntityValidationError() {
        const faker = Symbol.fake().anIcon().withDescription('TEST');
        const defaultExpected = {
            statusCode: 422,
            error: 'Unprocessable Entity',
        };

        return {
            DESCRIPTION_TOO_LONG: {
                send_data: {
                    description: faker.withInvalidDescriptionTooLong().description,
                    type: faker.type.type,
                },
                expected: {
                    message: ['description must be shorter than or equal to 255 characters'],
                    ...defaultExpected,
                },
            },
            TYPE_INVALID: {
                send_data: {
                    description: faker.withDescription('TEST').description,
                    type: 10,
                },
                expected: {
                    message: ['Invalid symbol type: 10'],
                    ...defaultExpected,
                },
            },
        };
    }
}

export class UpdateSymbolsFixture {
    static keysInResponse = _keysInResponse;

    static arrangeForUpdate() {
        const faker = Symbol.fake().anIcon().withDescription('TEST');
        return [
            {
                send_data: {
                    description: faker.description,
                    type: faker.type.type,
                },
                expected: {
                    description: faker.description,
                    type: faker.type.type,
                },
            },
            {
                send_data: {
                    description: faker.description + ' Updated',
                },
                expected: {
                    description: faker.description + ' Updated',
                },
            },
            {
                send_data: {
                    type: SymbolTypes.ICON,
                },
                expected: {
                    type: SymbolTypes.ICON,
                },
            },
        ];
    }

    static arrangeInvalidRequest() {
        const faker = Symbol.fake().anIcon().withDescription('TEST');
        const defaultExpected = {
            statusCode: 422,
            error: 'Unprocessable Entity',
        };

        return {
            TYPE_INVALID: {
                send_data: {
                    name: faker.description,
                    type: 'a',
                },
                expected: {
                    message: ['type must be an integer number'],
                    ...defaultExpected,
                },
            },
        };
    }

    static arrangeForEntityValidationError() {
        const faker = Symbol.fake().anIcon().withDescription('TEST');
        const defaultExpected = {
            statusCode: 422,
            error: 'Unprocessable Entity',
        };

        return {
            TYPE_INVALID: {
                send_data: {
                    name: faker.description,
                    type: 10,
                },
                expected: {
                    message: ['Invalid symbol type: 10'],
                    ...defaultExpected,
                },
            },
        };
    }
}

export class ListSymbolsFixture {
    static arrangeIncrementedWithCreatedAt() {
        const _entities = Symbol.fake()
            .theSymbols(4)
            .withDescription((i) => i + '')
            .withCreatedAt((i) => new Date(new Date().getTime() + i * 2000))
            .build();

        const entitiesMap = {
            first: _entities[0],
            second: _entities[1],
            third: _entities[2],
            fourth: _entities[3],
        };

        const arrange = [
            {
                send_data: {},
                expected: {
                    entities: [
                        entitiesMap.fourth,
                        entitiesMap.third,
                        entitiesMap.second,
                        entitiesMap.first,
                    ],
                    meta: {
                        current_page: 1,
                        last_page: 1,
                        per_page: 15,
                        total: 4,
                    },
                },
            },
            {
                send_data: {
                    page: 1,
                    per_page: 2,
                },
                expected: {
                    entities: [entitiesMap.fourth, entitiesMap.third],
                    meta: {
                        current_page: 1,
                        last_page: 2,
                        per_page: 2,
                        total: 4,
                    },
                },
            },
            {
                send_data: {
                    page: 2,
                    per_page: 2,
                },
                expected: {
                    entities: [entitiesMap.second, entitiesMap.first],
                    meta: {
                        current_page: 2,
                        last_page: 2,
                        per_page: 2,
                        total: 4,
                    },
                },
            },
        ];

        return { arrange, entitiesMap };
    }

    static arrangeUnsorted() {
        const icon = Symbol.fake().anIcon();
        const created_at = new Date();

        const entitiesMap = {
            icon_a: icon
                .withDescription('a')
                .withCreatedAt(new Date(created_at.getTime() + 1000))
                .build(),
            icon_AAA: icon
                .withDescription('AAA')
                .withCreatedAt(new Date(created_at.getTime() + 2000))
                .build(),
            icon_AaAa: icon
                .withDescription('AaAa')
                .withCreatedAt(new Date(created_at.getTime() + 3000))
                .build(),
            icon_b: icon
                .withDescription('b')
                .withCreatedAt(new Date(created_at.getTime() + 4000))
                .build(),
            icon_c: icon
                .withDescription('c')
                .withCreatedAt(new Date(created_at.getTime() + 5000))
                .build(),
        };

        const arrange_filter_by_description_sort_description_asc = [
            {
                send_data: {
                    page: 1,
                    per_page: 2,
                    sort: 'description',
                    filter: { description: 'a' },
                },
                expected: {
                    entities: [entitiesMap.icon_AAA, entitiesMap.icon_AaAa],
                    meta: {
                        total: 3,
                        current_page: 1,
                        last_page: 2,
                        per_page: 2,
                    },
                },
            },
            {
                send_data: {
                    page: 2,
                    per_page: 2,
                    sort: 'description',
                    filter: { description: 'a' },
                },
                expected: {
                    entities: [entitiesMap.icon_a],
                    meta: {
                        total: 3,
                        current_page: 2,
                        last_page: 2,
                        per_page: 2,
                    },
                },
            },
        ];

        const arrange_filter_icons_sort_by_created_desc = [
            {
                send_data: {
                    page: 1,
                    per_page: 2,
                    sort: 'created_at',
                    sort_dir: 'desc' as SortDirection,
                    filter: { type: SymbolTypes.ICON },
                },
                expected: {
                    entities: [entitiesMap.icon_c, entitiesMap.icon_b],
                    meta: {
                        total: 5,
                        current_page: 1,
                        last_page: 3,
                        per_page: 2,
                    },
                },
            },
            {
                send_data: {
                    page: 2,
                    per_page: 2,
                    sort: 'created_at',
                    sort_dir: 'desc' as SortDirection,
                    filter: { type: SymbolTypes.ICON },
                },
                expected: {
                    entities: [entitiesMap.icon_AaAa, entitiesMap.icon_AAA],
                    meta: {
                        total: 5,
                        current_page: 2,
                        last_page: 3,
                        per_page: 2,
                    },
                },
            },
        ];

        return {
            arrange: [
                ...arrange_filter_by_description_sort_description_asc,
                ...arrange_filter_icons_sort_by_created_desc,
            ],
            entitiesMap,
        }
    }
}

export class UpdateSymbolFixture {
    static keysInResponse = _keysInResponse;

    static arrangeForUpdate() {
        const faker = Symbol.fake().anIcon().withDescription('TEST');
        return [
            {
                send_data: {
                    description: faker.description,
                    type: faker.type.type,
                },
                expected: {
                    description: faker.description,
                    type: faker.type.type,
                },
            },
            {
                send_data: {
                    description: faker.description + ' Updated',
                },
                expected: {
                    description: faker.description + ' Updated',
                },
            },
            {
                send_data: {
                    type: SymbolTypes.ICON,
                },
                expected: {
                    type: SymbolTypes.ICON,
                },
            },
        ];
    }

    static arrangeInvalidRequest() {
        const faker = Symbol.fake().anIcon().withDescription('TEST');
        const defaultExpected = {
            statusCode: 422,
            error: 'Unprocessable Entity',
        };

        return {
            TYPE_INVALID: {
                send_data: {
                    description: faker.description,
                    type: 'a',
                },
                expected: {
                    message: ['type must be an integer number'],
                    ...defaultExpected,
                },
            },
        };
    }

    static arrangeForEntityValidationError() {
        const faker = Symbol.fake().anIcon().withDescription('TEST');
        const defaultExpected = {
            statusCode: 422,
            error: 'Unprocessable Entity',
        };

        return {
            TYPE_INVALID: {
                send_data: {
                    description: faker.description,
                    type: 10,
                },
                expected: {
                    message: ['Invalid cast member type: 10'],
                    ...defaultExpected,
                },
            },
        };
    }
}