import { LoadEntityError } from "@core/shared/domain/validators/validation.error";
import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { SymbolModelMapper } from "../symbol-model-mapper";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { SymbolModel } from "../symbol.model";
import { SymbolType, SymbolTypes } from "@core/symbol/domain/symbol-type.vo";



describe('SymbolModelMapper Integration Tests', () => {
    setupSequelize({ models: [SymbolModel] });

    it('should throws error when symbol is invalid', () => {
        expect.assertions(2);
        const model = SymbolModel.build({
            symbol_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
            description: 'a'.repeat(256),
            is_active: true,
            type: SymbolTypes.ICON,
            created_at: new Date(),
        });
        try {
            SymbolModelMapper.toEntity(model);
            fail('The symbol is valid, but it needs throws a LoadEntityError');
        } catch (e) {
            expect(e).toBeInstanceOf(LoadEntityError);
            expect((e as LoadEntityError).error).toMatchObject([
                {
                    description: ['description must be shorter than or equal to 255 characters'],
                },
            ]);
        }
    });

    it('should convert a symbol model to a symbol aggregate', () => {
        const created_at = new Date();
        const model = SymbolModel.build({
            symbol_id: '5490020a-e866-4229-9adc-aa44b83234c4',
            description: 'some value',
            is_active: true,
            type: SymbolTypes.ICON,
            created_at,
        });
        const aggregate = SymbolModelMapper.toEntity(model);
        expect(aggregate.toJSON()).toStrictEqual(
            new SymbolModel({
                symbol_id: '5490020a-e866-4229-9adc-aa44b83234c4',
                description: 'some value',
                is_active: true,
                type: SymbolTypes.ICON,
                created_at,
            }).toJSON(),
        );
    });

    it('should convert a symbol aggregate to a symbol model', () => {
        const created_at = new Date();
        const icon = SymbolType.createAnIcon();
        const aggregate = new Symbol({ 
            symbol_id: new SymbolId('5490020a-e866-4229-9adc-aa44b83234c4'),
            description: 'some value',
            is_active: true,
            type: icon,
            created_at,
        });
        const model = SymbolModelMapper.toModel(aggregate);
        expect(model.toJSON()).toStrictEqual(
            new SymbolModel({
                symbol_id: '5490020a-e866-4229-9adc-aa44b83234c4',
                description: 'some value',
                is_active: true,
                type: SymbolTypes.ICON,
                created_at,
            }).toJSON(),
        );
    });
});