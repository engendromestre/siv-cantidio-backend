
import { ISearchableRepository } from "@core/shared/domain/repository/repository-interface";
import { SearchParams, SearchParamsConstructorProps } from "@core/shared/domain/repository/search-params";
import { SearchResult } from "@core/shared/domain/repository/search-result";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { InvalidSymbolTypeError, SymbolType, SymbolTypes } from "./symbol-type.vo";
import { Either } from "@core/shared/domain/either";
import { SearchValidationError } from "@core/shared/domain/validators/validation.error";

export type SymbolFilter = {
  description?: string | null;
  is_active?: boolean | null;
  type?: SymbolType | null;
};

export class SymbolSearchParams extends SearchParams<SymbolFilter> {
  private constructor(props: SearchParamsConstructorProps<SymbolFilter> = {}) {
    super(props);
  }

  static create(
    props: Omit<SearchParamsConstructorProps<SymbolFilter>, 'filter'> & {
      filter?: {
        description?: string | null;
        is_active?: boolean | null;
        type?: SymbolTypes | null;
      };
    } = {},
  ) {
    const [type, errorSymbolType] = Either.of(props.filter?.type)
      .map((type) => type || null)
      .chain<SymbolType | null, InvalidSymbolTypeError>((type) =>
        type ? SymbolType.create(type) : Either.of(null),
      )
      .asArray();

    if (errorSymbolType) {
      const error = new SearchValidationError([
        { type: [errorSymbolType.message] },
      ]);
      throw error;
    }

    return new SymbolSearchParams({
      ...props,
      filter: {
        description: props.filter?.description,
        is_active: props.filter?.is_active,
        type: type,
      },
    });
  }

  get filter(): SymbolFilter | null {
    return this._filter;
  }

  protected set filter(value: SymbolFilter | null) {
    const _value =
      !value || (value as unknown) === '' || typeof value !== 'object'
        ? null
        : value;
    
    const filter = {
      ...(_value && _value.description && { description: `${_value?.description}` }),
      ...(_value && _value.is_active !== undefined && { is_active: _value?.is_active }),
      ...(_value && _value.type && { type: _value.type }),
    };
    
    this._filter = Object.keys(filter).length === 0 ? null : filter;
  }
}

export class SymbolSearchResult extends SearchResult<Symbol> { }

export interface ISymbolRepository
  extends ISearchableRepository<
    Symbol,
    SymbolId,
    SymbolFilter,
    SymbolSearchParams,
    SymbolSearchResult
  > { }