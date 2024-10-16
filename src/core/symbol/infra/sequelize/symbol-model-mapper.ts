import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { SymbolModel } from "./symbol.model";
import { SymbolType } from "@core/symbol/domain/symbol-type.vo";
import { LoadEntityError } from "@core/shared/domain/validators/validation.error";


export class SymbolModelMapper {
    static toModel(entity: Symbol): SymbolModel {
        return SymbolModel.build({
            symbol_id: entity.symbol_id.id,
            description: entity.description,
            is_active: entity.is_active,
            type: entity.type.type,
            created_at: entity.created_at,
        });
    }

    static toEntity(model: SymbolModel) {
        const { symbol_id: id, ...otherData } = model.toJSON();
        const [type, errorSymbolType] = SymbolType.create(
            otherData.type as any,
        ).asArray();

        const symbol = new Symbol({
            ...otherData,
            symbol_id: new SymbolId(id),
            type,
        });

        symbol.validate();

        const notification = symbol.notification;
        if (errorSymbolType) {
            notification.setError(errorSymbolType.message, 'type');
        }

        if (notification.hasErrors()) {
            throw new LoadEntityError(notification.toJSON());
        }

        return symbol;
    }
}