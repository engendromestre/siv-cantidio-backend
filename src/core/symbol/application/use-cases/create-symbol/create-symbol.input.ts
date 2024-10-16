import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";
import { IsBoolean, IsInt, IsNotEmpty, IsString, validateSync } from "class-validator";


export type CreateSymbolInputConstructorProps = {
    description: string;
    is_active: boolean;
    type: SymbolTypes;
}

export class CreateSymbolInput {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean;

    @IsInt()
    @IsNotEmpty()
    type: SymbolTypes;

    constructor(props: CreateSymbolInputConstructorProps) {
        if (!props) return;
        this.description = props.description;
        this.is_active = props.is_active;
        this.type = props.type;
    }
}

export class ValidateCreateSymbolInput {
    static validate(input: CreateSymbolInput) {
        return validateSync(input);
    }
}