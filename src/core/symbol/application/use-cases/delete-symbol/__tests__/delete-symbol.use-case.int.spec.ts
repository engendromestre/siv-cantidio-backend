import { SymbolSequelizeRepository } from "@core/symbol/infra/sequelize/symbol-sequelize.repository";
import { DeleteSymbolUseCase } from "../delete-symbol.use-case";
import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { SymbolModel } from "@core/symbol/infra/sequelize/symbol.model";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";


describe('Delete SymbolUseCase Integration Tests', () => {
    let useCase: DeleteSymbolUseCase;
    let repository: SymbolSequelizeRepository;

    setupSequelize({ models: [SymbolModel] });

    beforeEach(() => {
        repository = new SymbolSequelizeRepository(SymbolModel);
        useCase = new DeleteSymbolUseCase(repository);
    });

    it('should throws error when entity not found', () => {
        const symbolId = new SymbolId();
        return expect(useCase.execute({ id: symbolId.id }))
            .rejects.toThrow(new NotFoundError(symbolId.id, Symbol));
    });

    it('should delete a symbol', async () => {
        const symbol = Symbol.fake().anIcon().build();
        await repository.insert(symbol);
        await useCase.execute({
            id: symbol.symbol_id.id,
        });
        await expect(repository.findById(symbol.symbol_id))
            .resolves.toBeNull();
    });
});