import { Symbol } from "@core/symbol/domain/symbol.aggregate";

export type SymbolOutput = {
    id: string;
    description: string;
    type: number;
    is_active: boolean;
    created_at: Date;
}

export class SymbolOutputMapper {
    static toOutput(entity: Symbol): SymbolOutput {
        const { symbol_id, ...other_props } = entity.toJSON();
        return {
            id: symbol_id,
            ...other_props,
        };
    }
}