import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, validateSync } from "class-validator";


export type UpdateSymbolInputConstructorProps = {
    id: string;
    description?: string | null;
    is_active?: boolean;
    type?: SymbolTypes;
};

export class UpdateSymbolInput {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

    @IsInt()
    @IsOptional()
    type?: SymbolTypes;


    constructor(props?: UpdateSymbolInputConstructorProps) {
        if (!props) return;
        this.id = props.id;
        props.description && (this.description = props.description);
        props.is_active !== null &&
            props.is_active !== undefined &&
            (this.is_active = props.is_active);
        props.type && (this.type = props.type);
    }
}

export class ValidateUpdateSymbolInput {
    static validate(input: UpdateSymbolInput) {
        return validateSync(input);
    }
}