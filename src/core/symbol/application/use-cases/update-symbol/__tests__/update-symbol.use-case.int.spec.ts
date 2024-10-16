import { SymbolSequelizeRepository } from "@core/symbol/infra/sequelize/symbol-sequelize.repository";
import { UpdateSymbolUseCase } from "../update-symbol.use-case";
import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { SymbolModel } from "@core/symbol/infra/sequelize/symbol.model";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { UpdateSymbolInput } from "../update-symbol.input";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";
import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";


describe('UpdateSymbolUseCase Integration Tests', () => {
    let useCase: UpdateSymbolUseCase;
    let repository: SymbolSequelizeRepository;

    setupSequelize({ models: [SymbolModel] });

    beforeEach(() => {
        repository = new SymbolSequelizeRepository(SymbolModel);
        useCase = new UpdateSymbolUseCase(repository);
    });

    it('should throws error when entity not found', async () => {
        const symbolId = new SymbolId();
        await expect(() =>
            useCase.execute(
                new UpdateSymbolInput({
                    id: symbolId.id,
                    description: 'new description',
                    is_active: true,
                    type: SymbolTypes.ICON,
                }),
            ),
        ).rejects.toThrow(new NotFoundError(symbolId.id, Symbol));
    });

    it('should update a symbol', async () => {
        const entity = Symbol.fake().anIcon().build();
        await repository.insert(entity);

        let output = await useCase.execute({
            id: entity.symbol_id.id,
            description: 'new description',
            is_active: true,
            type: SymbolTypes.ICON,
        });

        expect(output).toStrictEqual({
            id: entity.symbol_id.id,
            description: 'new description',
            type: SymbolTypes.ICON,
            is_active: true,
            created_at: entity.created_at,
        });

        type Arrange = {
            input: {
                id: string;
                description: string;
                is_active: boolean;
                type: SymbolTypes;
            },
            expected: {
                id: string;
                description: string;
                is_active: boolean;
                type: SymbolTypes;
                created_at: Date;
            }
        }

        const arrange: Arrange[] = [
            {
                input: {
                    id: entity.symbol_id.id,
                    description: 'new description',
                    is_active: true,
                    type: SymbolTypes.ICON,
                },
                expected: {
                    id: entity.symbol_id.id,
                    description: 'new description',
                    is_active: true,
                    type: SymbolTypes.ICON,
                    created_at: entity.created_at,
                }
            }
        ];

        for (const i of arrange) {
            output = await useCase.execute(i.input);
            const entityUpdated = await repository.findById(
                new SymbolId(i.input.id)
            );
            expect(output).toStrictEqual(i.expected);
            expect(entityUpdated!.toJSON()).toStrictEqual({
                symbol_id: entity.symbol_id.id,
                description: i.expected.description,
                is_active: i.expected.is_active,
                type: i.expected.type,
                created_at: i.expected.created_at,
            });
        }
    });
});