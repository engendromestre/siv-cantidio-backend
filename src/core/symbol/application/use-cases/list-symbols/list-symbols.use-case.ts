import { PaginationOutput, PaginationOutputMapper } from "@core/shared/application/pagination-output";
import { IUseCase } from "@core/shared/application/use-case.interface";
import { ISymbolRepository, SymbolSearchParams, SymbolSearchResult } from "@core/symbol/domain/symbol.repository";
import { SymbolOutput, SymbolOutputMapper } from "../common/symbol-output";
import { ListSymbolsInput } from "./list-symbols.input";


export class ListSymbolsUseCase
implements IUseCase<ListSymbolsInput, ListSymbolsOutput>
{
    constructor(private symbolRepo: ISymbolRepository) {}

    async execute(input: ListSymbolsInput): Promise<ListSymbolsOutput> {       
        const params = SymbolSearchParams.create(input);
        const searchResult = await this.symbolRepo.search(params);
        return this.toOutput(searchResult);
    }

    private toOutput(searchResult: SymbolSearchResult): ListSymbolsOutput {
        const { items: _items } = searchResult;
        const items = _items.map((i) => SymbolOutputMapper.toOutput(i));
        return PaginationOutputMapper.toOutput(items, searchResult);
    }
}

export type ListSymbolsOutput = PaginationOutput<SymbolOutput>;