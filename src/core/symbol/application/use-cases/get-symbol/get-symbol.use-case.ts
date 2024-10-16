import { IUseCase } from "@core/shared/application/use-case.interface";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { ISymbolRepository } from "@core/symbol/domain/symbol.repository";
import { SymbolOutput, SymbolOutputMapper } from "../common/symbol-output";

export class GetSymbolUseCase
implements IUseCase<GetSymbolInput, GetSymbolOutput> {
    constructor(private symbolRepo: ISymbolRepository) {}

    async execute(input: GetSymbolInput): Promise<SymbolOutput> {
        const symbolId = new SymbolId(input.id);
        const symbol = await this.symbolRepo.findById(symbolId);
        if (!symbol) {
            throw new NotFoundError(input.id, Symbol);
        }
        return SymbolOutputMapper.toOutput(symbol);
    }
}

export type GetSymbolInput = {
    id: string;
}

export type GetSymbolOutput = SymbolOutput;