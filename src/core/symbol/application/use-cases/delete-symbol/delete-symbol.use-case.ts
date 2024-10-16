import { IUseCase } from "@core/shared/application/use-case.interface";
import { SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { ISymbolRepository } from "@core/symbol/domain/symbol.repository";


export class DeleteSymbolUseCase
  implements IUseCase<DeleteSymbolInput, DeleteSymbolOutput>
{
    constructor(private symbolRepository: ISymbolRepository) {}
    
    async execute(input: DeleteSymbolInput): Promise<DeleteSymbolOutput> {
        const symbolId = new SymbolId(input.id);
        await this.symbolRepository.delete(symbolId);
    }
    
}

interface DeleteSymbolInput {
    id: string;
}

type DeleteSymbolOutput = void;