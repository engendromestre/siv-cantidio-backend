import { IUseCase } from "@core/shared/application/use-case.interface";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";
import { EntityValidationError } from "@core/shared/domain/validators/validation.error";
import { SymbolType } from "@core/symbol/domain/symbol-type.vo";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { ISymbolRepository } from "@core/symbol/domain/symbol.repository";
import { SymbolOutput, SymbolOutputMapper } from "../common/symbol-output";
import { UpdateSymbolInput } from "./update-symbol.input";


export class UpdateSymbolUseCase
    implements IUseCase<UpdateSymbolInput, UpdateSymbolOutput> {

    constructor(private symbolRepo: ISymbolRepository) { }

    async execute(input: UpdateSymbolInput): Promise<UpdateSymbolOutput> {
        const symbolId = new SymbolId(input.id);
        const symbol = await this.symbolRepo.findById(symbolId);

        if (!symbol) {
            throw new NotFoundError(input.id, Symbol);
        }

        input.description && symbol.changeDescription(input.description);

        if (input.type) {
            const [type, errorSymbolType] = SymbolType.create(
                input.type,
            ).asArray();

            symbol.changeType(type);

            errorSymbolType &&
                symbol.notification.setError(errorSymbolType.message, 'type');
        }

        if (symbol.notification.hasErrors()) {
            throw new EntityValidationError(symbol.notification.toJSON());
        }

        if (input.is_active === true) {
            symbol.activate();
        }

        if (input.is_active === false) {
            symbol.deactivate();
        }

        await this.symbolRepo.update(symbol);
        return SymbolOutputMapper.toOutput(symbol);

    }
}

export type UpdateSymbolOutput = SymbolOutput;