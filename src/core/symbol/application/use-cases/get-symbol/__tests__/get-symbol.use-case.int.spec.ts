import { NotFoundError } from "@core/shared/domain/errors/not-found.error";
import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { SymbolSequelizeRepository } from "@core/symbol/infra/sequelize/symbol-sequelize.repository";
import { SymbolModel } from "@core/symbol/infra/sequelize/symbol.model";
import { GetSymbolUseCase } from "../get-symbol.use-case";


describe('GetSymbolUseCase', () => {
    let useCase: GetSymbolUseCase;
    let repository: SymbolSequelizeRepository;

    setupSequelize({ models: [SymbolModel] });

    beforeEach(() => {
        repository = new SymbolSequelizeRepository(SymbolModel);
        useCase = new GetSymbolUseCase(repository);
    });

    it('should throw error when entity not found', () => {
        const symbolId = new SymbolId();
        return expect(useCase.execute({ id: symbolId.id }))
           .rejects.toThrow(new NotFoundError(symbolId.id, Symbol));
    });

    it('should returns a symbol', async () => {
        const symbol = Symbol.fake().anIcon().build();
        await repository.insert(symbol);
        const output = await useCase.execute({ id: symbol.symbol_id.id });
        expect(output).toStrictEqual({
            id: symbol.symbol_id.id,
            description: symbol.description,
            is_active: true,
            type: symbol.type.type,
            created_at: symbol.created_at,
        });
    });
});