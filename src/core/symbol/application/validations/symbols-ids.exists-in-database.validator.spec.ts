import { SymbolInMemoryRepository } from "@core/symbol/infra/in-memory/symbol-in-memory.repository";
import { SymbolsIdExistsInDatabaseValidator } from "./symbols-ids-exists-in-database.validator";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";


describe('SymbolsIdExistsInDatabaseValidator Unit Tests', () => {
    let symbolRepo: SymbolInMemoryRepository;
    let validator: SymbolsIdExistsInDatabaseValidator;

    beforeEach(() => {
        symbolRepo = new SymbolInMemoryRepository();
        validator = new SymbolsIdExistsInDatabaseValidator(symbolRepo);
    });

    it('should return many not found error when symbols id is not exists in storage', async () => {
        const symbolId1 = new SymbolId();
        const symbolId2 = new SymbolId();
        const spyExistsById = jest.spyOn(symbolRepo, 'existsById');
        let [symbolsId, errorsSymbolsId] = await validator.validate([
            symbolId1.id,
            symbolId2.id,
        ]);
        expect(symbolsId).toStrictEqual(null);
        expect(errorsSymbolsId).toStrictEqual([
            new NotFoundError(symbolId1.id, Symbol),
            new NotFoundError(symbolId2.id, Symbol),
        ]);

        expect(spyExistsById).toHaveBeenCalledTimes(1);

        const symbol1 = Symbol.fake().anIcon().build();
        await symbolRepo.insert(symbol1);

        [symbolsId, errorsSymbolsId] = await validator.validate([
            symbol1.symbol_id.id,
            symbolId2.id,
        ]);
        expect(symbolsId).toStrictEqual(null);
        expect(errorsSymbolsId).toStrictEqual([
            new NotFoundError(symbolId2.id, Symbol),
        ]);
        expect(spyExistsById).toHaveBeenCalledTimes(2);
    });

    it('should return a list of symbols id', async () => {
        const symbol1 = Symbol.fake().anIcon().build();
        const symbol2 = Symbol.fake().anIcon().build();
        await symbolRepo.bulkInsert([symbol1, symbol2]);
        const [symbolsId, errorsSymbolsId] = await validator.validate([
            symbol1.symbol_id.id,
            symbol2.symbol_id.id,
        ]);
        expect(symbolsId).toHaveLength(2);
        expect(errorsSymbolsId).toStrictEqual(null);
        expect(symbolsId[0]).toBeValueObject(symbol1.symbol_id);
        expect(symbolsId[1]).toBeValueObject(symbol2.symbol_id);
    });
});
