import { ClassValidatorFields } from '@core/shared/domain/validators/class-validator-fields';
import { MaxLength } from 'class-validator';
import { Notification } from '../../shared/domain/validators/notification';
import { Symbol } from './symbol.aggregate';

export class SymbolRules {
    @MaxLength(255, { groups: ['description'] })
    description: string;

    constructor(entity: Symbol) {
        Object.assign(this, entity);
    }
}

export class SymbolValidator extends ClassValidatorFields {
    validate(
        notification: Notification, 
        data: Symbol, 
        fields?: string[]
    ): boolean {
        const newFields = fields?.length? fields : ['description'];
        return super.validate(notification, new SymbolRules(data), newFields);
    }
}

export class SymbolValidatorFactory {
    static create() {
        return new SymbolValidator();
    }
}

export default SymbolValidatorFactory;
