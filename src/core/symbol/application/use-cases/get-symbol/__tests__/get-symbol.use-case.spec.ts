import { SymbolInMemoryRepository } from "@core/symbol/infra/in-memory/symbol-in-memory.repository";
import { GetSymbolUseCase } from "../get-symbol.use-case";
import { InvalidUuidError } from "@core/shared/domain/value-objects/uuid.vo";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";
import { SymbolType, SymbolTypes } from "@core/symbol/domain/symbol-type.vo";

describe('GetSymbolUseCase', () => {
    let useCase: GetSymbolUseCase;
    let repository: SymbolInMemoryRepository;

    beforeEach(() => {
        repository = new SymbolInMemoryRepository();
        useCase = new GetSymbolUseCase(repository);
    });

    it('should throw error when entity not found', async () => {
        await expect(() => useCase.execute({ id: 'fake id' }))
            .rejects.toThrow(
                new InvalidUuidError(),
            )

        const symbolId = new SymbolId();
        await expect(() => useCase.execute({ id: symbolId.id }))
            .rejects.toThrow(
                new NotFoundError(symbolId.id, Symbol),
            )
    });

    it('should returns a symbol', async () => {
        const items = [Symbol.fake().anIcon().build()];
        repository.items = items;
        const spyFindById = jest.spyOn(repository, 'findById');
        const output = await useCase.execute({ id: items[0].symbol_id.id });
        expect(spyFindById).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: items[0].symbol_id.id,
            description: items[0].description,
            type: SymbolTypes.ICON,
            is_active: items[0].is_active,
            created_at: items[0].created_at,
        });
    });
})