import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { ValueObject } from '@core/shared/domain/value-object';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { SymbolFakeBuilder } from './symbol-fake.builder';
import { SymbolType } from './symbol-type.vo';
import SymbolValidatorFactory from './symbol.validator';

export type SymbolProps = {
    symbol_id?: SymbolId;
    description: string;
    is_active?: boolean;
    type: SymbolType;
    created_at?: Date;
}

export type SymbolCreateCommand = {
    description: string;
    is_active?: boolean;
    type: SymbolType;
}

export class SymbolId extends Uuid { }

export class Symbol extends AggregateRoot {
    symbol_id: SymbolId;
    description: string;
    is_active: boolean;
    type: SymbolType;
    created_at: Date;

    constructor(props: SymbolProps) {
        super();
        this.symbol_id = props.symbol_id ?? new SymbolId();
        this.description = props.description;
        this.is_active = props.is_active ?? true;
        this.type = props.type;
        this.created_at = props.created_at ?? new Date();
    }


    static create(props: SymbolCreateCommand) {
        const symbol = new Symbol(props);
        symbol.validate(['description']);
        return symbol;
    }

    changeDescription(description: string): void {
        this.description = description;
        this.validate(['description']);
    }

    activate() {
        this.is_active = true;
    }

    deactivate() {
        this.is_active = false;
    }

    changeType(type: SymbolType): void {
        this.type = type;
    }

    validate(fields?: string[]) {
        const validator = SymbolValidatorFactory.create();
        return validator.validate(this.notification, this, fields);
    }

    static fake() {
        return SymbolFakeBuilder;
    }

    get entity_id(): ValueObject {
        return this.symbol_id;
    }

    toJSON() {
        return {
            symbol_id: this.symbol_id.id,
            description: this.description,
            is_active: this.is_active,
            type: this.type.type,
            created_at: this.created_at,
        }
    }

}