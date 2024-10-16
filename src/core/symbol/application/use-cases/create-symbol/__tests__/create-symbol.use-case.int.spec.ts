import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";
import { SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { SymbolSequelizeRepository } from "@core/symbol/infra/sequelize/symbol-sequelize.repository";
import { SymbolModel } from "@core/symbol/infra/sequelize/symbol.model";
import { CreateSymbolUseCase } from "../create-symbol.use-case";


describe('CreateSymbol Integration Tests', () => {
    let useCase: CreateSymbolUseCase;
    let repository: SymbolSequelizeRepository;

    setupSequelize({ models: [SymbolModel] });

    beforeEach(() => {
        repository = new SymbolSequelizeRepository(SymbolModel);
        useCase = new CreateSymbolUseCase(repository);
    });

    it('should create a symbol', async() => {
        let output = await useCase.execute({
            description: 'Some description',
            is_active: true,
            type: SymbolTypes.ICON,
        });

        let entity = await repository.findById(
            new SymbolId(output.id)
        );

        expect(output).toStrictEqual({
            id: entity!.symbol_id.id,
            description: 'Some description',
            is_active: true,
            type: SymbolTypes.ICON,
            created_at: entity!.created_at,
        });
    });
})