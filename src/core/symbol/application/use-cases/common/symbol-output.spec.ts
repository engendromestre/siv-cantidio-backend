import { SymbolType } from "@core/symbol/domain/symbol-type.vo";
import { Symbol } from "@core/symbol/domain/symbol.aggregate";
import { SymbolOutputMapper } from "./symbol-output";

describe('SymbolOutputMapper Unit Tests', () => {
    it('should convert a symbol in output', ()=> {
        const entity = Symbol.create({
            description: 'some description',
            type: SymbolType.createAnIcon(),
            is_active: true,
        });
        const spyToJSON = jest.spyOn(entity, 'toJSON');
        const output = SymbolOutputMapper.toOutput(entity);
        expect(spyToJSON).toHaveBeenCalled();
        expect(output).toStrictEqual({
            id: entity.symbol_id.id,
            description: 'some description',
            type: SymbolType.createAnIcon().type,
            is_active: true,
            created_at: entity.created_at,
        });
    })
});