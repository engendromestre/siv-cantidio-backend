import { SymbolInMemoryRepository } from "@core/symbol/infra/in-memory/symbol-in-memory.repository";
import { CreateSymbolUseCase } from "../create-symbol.use-case";
import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";
import { EntityValidationError } from "@core/shared/domain/validators/validation.error";


describe('CreateSymbolUseCase', () => {
    let useCase: CreateSymbolUseCase;
    let repository: SymbolInMemoryRepository;

    beforeEach(() => {
        repository = new SymbolInMemoryRepository();
        useCase = new CreateSymbolUseCase(repository);
        jest.restoreAllMocks();
    });

    describe('execute method', () => {
        it('should throw an generic error', async () => {
            const expectedError = new Error('generic error');
            jest.spyOn(repository, 'insert').mockRejectedValue(expectedError);
            await expect(
                useCase.execute({
                    description: 'some description',
                    is_active: true,
                    type: SymbolTypes.ICON,
                }),
            ).rejects.toThrowError(expectedError);
        });

        it('should throw an entity validation error', async () => {
            try {
                await useCase.execute({
                    description: 'description',
                    is_active: true,
                    type: 'a' as any,
                });
            } catch (e) {
                expect(e).toBeInstanceOf(EntityValidationError);
                expect(e.error).toStrictEqual([
                    {
                        type: ['Invalid symbol type: a'],
                    },
                ]);
            }
            expect.assertions(2);
        });

        it('should create a symbol', async () => {
            const spyInsert = jest.spyOn(repository, 'insert');
           
            let output = await useCase.execute({
                description: 'some description',
                is_active: true,
                type: SymbolTypes.ICON,
            });

            expect(spyInsert).toHaveBeenCalledTimes(1);
            expect(output).toStrictEqual({
                id: repository.items[0].symbol_id.id,
                description: 'some description',
                is_active: true,
                type: SymbolTypes.ICON,
                created_at: repository.items[0].created_at,
            });

            output = await useCase.execute({
                description: 'some description',
                is_active: true,
                type: SymbolTypes.ICON,
            });

            expect(spyInsert).toHaveBeenCalledTimes(2);
            expect(output).toStrictEqual({
                id: repository.items[1].symbol_id.id,
                description: 'some description',
                is_active: true,
                type: SymbolTypes.ICON,
                created_at: repository.items[1].created_at,
            });
        });
    });
});