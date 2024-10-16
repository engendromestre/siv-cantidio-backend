import { ISymbolRepository } from "@core/symbol/domain/symbol.repository";
import { Either } from '../../../shared/domain/either';
import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";

export class SymbolsIdExistsInDatabaseValidator {
    constructor(private categoryRepo: ISymbolRepository) {}
  
    async validate(
      symbols_id: string[],
    ): Promise<Either<SymbolId[], NotFoundError[]>> {
      const symbolsId = symbols_id.map((v) => new SymbolId(v));
  
      const existsResult = await this.categoryRepo.existsById(symbolsId);
      return existsResult.not_exists.length > 0
        ? Either.fail(
            existsResult.not_exists.map((c) => new NotFoundError(c.id, Symbol)),
          )
        : Either.ok(symbolsId);
    }
  }