import { CreateSymbolUseCase } from "@core/symbol/application/use-cases/create-symbol/create-symbol.use-case";
import { DeleteSymbolUseCase } from "@core/symbol/application/use-cases/delete-symbol/delete-symbol.use-case";
import { GetSymbolUseCase } from "@core/symbol/application/use-cases/get-symbol/get-symbol.use-case";
import { ListSymbolsUseCase } from "@core/symbol/application/use-cases/list-symbols/list-symbols.use-case";
import { UpdateSymbolUseCase } from "@core/symbol/application/use-cases/update-symbol/update-symbol.use-case";
import { SymbolsIdExistsInDatabaseValidator } from "@core/symbol/application/validations/symbols-ids-exists-in-database.validator";
import { ISymbolRepository } from "@core/symbol/domain/symbol.repository";
import { SymbolInMemoryRepository } from "@core/symbol/infra/in-memory/symbol-in-memory.repository";
import { SymbolSequelizeRepository } from "@core/symbol/infra/sequelize/symbol-sequelize.repository";
import { SymbolModel } from "@core/symbol/infra/sequelize/symbol.model";
import { getModelToken } from "@nestjs/sequelize";


export const REPOSITORIES = {
    SYMBOL_REPOSITORY: {
        provide: 'SymbolRepository',
        useExisting: SymbolSequelizeRepository,
    },
    SYMBOL_IN_MEMORY_REPOSITORY: {
        provide: SymbolInMemoryRepository,
        useClass: SymbolInMemoryRepository,
    },
    SYMBOL_SEQUELIZE_REPOSITORY: {
        provide: SymbolSequelizeRepository,
        useFactory: (symbolModel: typeof SymbolModel) => {
            return new SymbolSequelizeRepository(symbolModel);
        },
        inject: [getModelToken(SymbolModel)],
    },
};

export const USE_CASES = {
    CREATE_SYMBOL_USE_CASE: {
        provide: CreateSymbolUseCase,
        useFactory: (symbolRepo: ISymbolRepository) => {
            return new CreateSymbolUseCase(symbolRepo);
        },
        inject: [REPOSITORIES.SYMBOL_REPOSITORY.provide],
    },
    UPDATE_SYMBOL_USE_CASE: {
        provide: UpdateSymbolUseCase,
        useFactory: (symbolRepo: ISymbolRepository) => {
            return new UpdateSymbolUseCase(symbolRepo);
        },
        inject: [REPOSITORIES.SYMBOL_REPOSITORY.provide],
    },
    LIST_SYMBOLS_USE_CASE: {
        provide: ListSymbolsUseCase,
        useFactory: (symbolRepo: ISymbolRepository) => {
            return new ListSymbolsUseCase(symbolRepo);
        },
        inject: [REPOSITORIES.SYMBOL_REPOSITORY.provide],
    },
    GET_SYMBOL_USE_CASE: {
        provide: GetSymbolUseCase,
        useFactory: (symbolRepo: ISymbolRepository) => {
            return new GetSymbolUseCase(symbolRepo);
        },
        inject: [REPOSITORIES.SYMBOL_REPOSITORY.provide],
    },
    DELETE_SYMBOL_USE_CASE: {
        provide: DeleteSymbolUseCase,
        useFactory: (symbolRepo: ISymbolRepository) => {
            return new DeleteSymbolUseCase(symbolRepo);
        },
        inject: [REPOSITORIES.SYMBOL_REPOSITORY.provide],
    },
};

export const VALIDATIONS = {
    SYMBOLS_IDS_EXISTS_IN_DATABASE_VALIDATOR: {
        provide: SymbolsIdExistsInDatabaseValidator,
        useFactory: (symbolRepo: ISymbolRepository) => {
            return new SymbolsIdExistsInDatabaseValidator(symbolRepo);
        },
        inject: [REPOSITORIES.SYMBOL_REPOSITORY.provide],
    },
};

export const SYMBOL_PROVIDERS = {
    REPOSITORIES,
    USE_CASES,
    VALIDATIONS,
};
