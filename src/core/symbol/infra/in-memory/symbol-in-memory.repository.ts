import { SortDirection } from "@core/shared/domain/repository/search-params";
import { InMemorySearchableRepository } from "@core/shared/infra/db/in-memory/in-memory.repository";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { ISymbolRepository, SymbolFilter } from "@core/symbol/domain/symbol.repository";

export class SymbolInMemoryRepository
    extends 
        InMemorySearchableRepository<
            Symbol, 
            SymbolId, 
            SymbolFilter
        >
    implements ISymbolRepository 
{
    sortableFields: string[] = ['description', 'created_at'];

    protected async applyFilter(
        items: Symbol[],
        filter: SymbolFilter | null
    ): Promise<Symbol[]> {
        if (!filter) {
            return items;
        }
        return items.filter((i) => {
            const containsDescription =
                filter.description &&
                i.description.toLocaleLowerCase()
                    .includes(filter.description.toLocaleLowerCase());
            const hasType = filter.type &&
                i.type.equals(filter.type);
            const hasActive = filter.is_active &&
                i.is_active == filter.is_active ? i : null;
           
            return filter.description && filter.type && filter.is_active
                ? containsDescription && hasType && hasActive
                : filter.description && filter.type
                    ? containsDescription && hasType
                    : filter.description && filter.is_active
                        ? containsDescription && hasActive
                        : filter.type && filter.is_active
                            ? hasType && hasActive
                            : filter.description
                                ? containsDescription
                                : filter.type
                                    ? hasType
                                    : hasActive
        });
    }
    getEntity(): new (...args: any[]) => Symbol {
        return Symbol;
    }

    protected applySort(
        items: Symbol[],
        sort: string | null,
        sort_dir: SortDirection | null
    ) {
        return sort
            ? super.applySort(items, sort, sort_dir)
            : super.applySort(items, 'created_at', 'desc');
    }
}   