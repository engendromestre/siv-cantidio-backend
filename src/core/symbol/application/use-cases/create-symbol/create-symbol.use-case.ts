import { IUseCase } from "@core/shared/application/use-case.interface";
import { EntityValidationError } from "@core/shared/domain/validators/validation.error";
import { SymbolType } from "@core/symbol/domain/symbol-type.vo";
import { Symbol } from "@core/symbol/domain/symbol.aggregate";
import { ISymbolRepository } from "@core/symbol/domain/symbol.repository";
import { SymbolOutput, SymbolOutputMapper } from "../common/symbol-output";
import { CreateSymbolInput } from "./create-symbol.input";


export class CreateSymbolUseCase
    implements IUseCase<CreateSymbolInput, CreateSymbolOutput> {

    constructor(private symbolRepo: ISymbolRepository) { }
    async execute(input: CreateSymbolInput): Promise<CreateSymbolOutput> {
        const [type, errorSymbolType] = SymbolType.create(
            input.type,
        ).asArray();
        const entity = Symbol.create({
            ...input,
            type,
        });

        const notification = entity.notification;
        if (errorSymbolType) {
            notification.setError(errorSymbolType.message, 'type');
        }

        if (notification.hasErrors()) {
            throw new EntityValidationError(notification.toJSON());
        }

        await this.symbolRepo.insert(entity);
        return SymbolOutputMapper.toOutput(entity);
    }
}

export type CreateSymbolOutput = SymbolOutput;