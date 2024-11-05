import { SymbolOutput } from "@core/symbol/application/use-cases/common/symbol-output";
import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";
import { Transform } from "class-transformer";
import { CollectionPresenter } from "../shared-module/collection.presenter";
import { ListSymbolsOutput } from "@core/symbol/application/use-cases/list-symbols/list-symbols.use-case";


export class SymbolPresenter {
    id: string;
    description: string;
    is_active: boolean;
    type: SymbolTypes;
    @Transform(({ value }: { value: Date }) => {
        return value.toISOString();
    })
    created_at: Date;

    constructor(output: SymbolOutput) {
        this.id = output.id;
        this.description = output.description;
        this.is_active = output.is_active;
        this.type = output.type;
        this.created_at = output.created_at;
    }
}

export class SymbolCollectionPresenter extends CollectionPresenter {
    data: SymbolPresenter[];

    constructor(output: ListSymbolsOutput) {
        const { items,...paginationProps } = output;
        super(paginationProps);
        this.data = items.map((item) => new SymbolPresenter(item));
    }
}