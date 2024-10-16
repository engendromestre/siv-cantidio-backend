import { SearchInput } from "@core/shared/application/search-input";
import { SortDirection } from "@core/shared/domain/repository/search-params";
import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";
import { isBoolean, isBooleanString, IsEmpty, IsInt, ValidateNested, validateSync } from "class-validator";


export class ListSymbolsFilter {
    description?: string | null;
    is_active?: boolean| null;
    @IsInt()
    type?: SymbolTypes | null;
}

export class ListSymbolsInput
    implements SearchInput<ListSymbolsFilter> {
    page?: number;
    per_page?: number;
    sort?: string;
    sort_dir?: SortDirection;
    @ValidateNested()
    filter?: ListSymbolsFilter;
}

export class ValidateSymbolsInput {
    static validate(input: ListSymbolsInput) {
        return validateSync(input);
    }
}