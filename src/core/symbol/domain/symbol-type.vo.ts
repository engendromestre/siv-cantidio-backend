import { Either } from "@core/shared/domain/either";
import { ValueObject } from "@core/shared/domain/value-object";


export enum SymbolTypes {
    ICON = 1,
}

export class SymbolType extends ValueObject {
    constructor(readonly type: SymbolTypes) {
        super();
        this.validate();
    }

    private validate() {
        const isValid =
            this.type === SymbolTypes.ICON;
        if (!isValid) {
            throw new InvalidSymbolTypeError(this.type);
        }
    }

    static create(
        value: SymbolTypes,
    ): Either<SymbolType, InvalidSymbolTypeError> {
        return Either.safe(() => new SymbolType(value));
    }

    static createAnIcon() {
        return SymbolType.create(SymbolTypes.ICON).ok;
    }
}

export class InvalidSymbolTypeError extends Error {
    constructor(invalidType: any) {
        super(`Invalid symbol type: ${invalidType}`);
        this.name = 'InvalidSymbolTypeError';
    }
}