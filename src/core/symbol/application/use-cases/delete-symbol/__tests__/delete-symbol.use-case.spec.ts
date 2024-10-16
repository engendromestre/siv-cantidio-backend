import { SymbolInMemoryRepository } from "@core/symbol/infra/in-memory/symbol-in-memory.repository";
import { DeleteSymbolUseCase } from "../delete-symbol.use-case";
import { InvalidUuidError } from "@core/shared/domain/value-objects/uuid.vo";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";



describe('DeleteSymbolUseCase', () => {
    let useCase: DeleteSymbolUseCase;
    let repository: SymbolInMemoryRepository;

    beforeEach(() => {
        repository = new SymbolInMemoryRepository();
        useCase = new DeleteSymbolUseCase(repository);
    });

    it('should throws error when entity not found', async () => {
        await expect(() => useCase.execute({ id: 'fake id' }))
            .rejects.toThrow(new InvalidUuidError()
            );

        const symbolId = new SymbolId();

        await expect(() => useCase.execute({ id: symbolId.id }))
            .rejects.toThrow(
                new NotFoundError(symbolId.id, Symbol)
            );
    });

    it('should delete a symbol', async () => {
        const items = [Symbol.fake().anIcon().build()];
        repository.items = items;
        await useCase.execute({ id: items[0].symbol_id.id });
        expect(repository.items).toHaveLength(0);
    });
});