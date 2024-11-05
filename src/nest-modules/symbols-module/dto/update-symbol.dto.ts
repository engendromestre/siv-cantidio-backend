import { UpdateSymbolInput } from "@core/symbol/application/use-cases/update-symbol/update-symbol.input";
import { OmitType } from '@nestjs/mapped-types';


export class UpdateSymbolInputWithoutId extends OmitType(
    UpdateSymbolInput,
    ['id'] as const,
) { }

export class UpdateSymbolDto extends UpdateSymbolInputWithoutId { }