import { Chance } from 'chance';
import { Symbol, SymbolId } from './symbol.aggregate';
import { SymbolType } from './symbol-type.vo';

type PropOrFactory<T> = T | ((index: number) => T);

export class SymbolFakeBuilder<TBuild = any> {
  // auto generated in entity
  private _symbol_id: PropOrFactory<SymbolId> | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _description: PropOrFactory<string> = (_index) => this.chance.word();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _is_active: PropOrFactory<boolean> = (_index) => true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _type: PropOrFactory<SymbolType> = (_index) =>
    SymbolType.createAnIcon();
  // auto generated in entity
  private _created_at: PropOrFactory<Date> | undefined = undefined;

  private countObjs;

  static anIcon() {
    return new SymbolFakeBuilder<Symbol>().withType(
      SymbolType.createAnIcon(),
    );
  }

  static theIcons(countObjs: number) {
    return new SymbolFakeBuilder<Symbol[]>(countObjs).withType(
      SymbolType.createAnIcon(),
    );
  }

  static theSymbols(countObjs: number) {
    return new SymbolFakeBuilder<Symbol[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withSymbolId(valueOrFactory: PropOrFactory<SymbolId>) {
    this._symbol_id = valueOrFactory;
    return this;
  }

  withDescription(valueOrFactory: PropOrFactory<string>) {
    this._description = valueOrFactory;
    return this;
  }

  activate() {
    this._is_active = true;
    return this;
  }

  deactivate() {
    this._is_active = false;
    return this;
  }

  withType(valueOrFactory: PropOrFactory<SymbolType>) {
    this._type = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  withInvalidDescriptionTooLong(value?: string) {
    this._description = value ?? this.chance.word({ length: 256 });
    return this;
  }

  build(): TBuild {
    const symbols = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const symbol = new Symbol({
          symbol_id: !this._symbol_id
            ? undefined
            : this.callFactory(this._symbol_id, index),
          description: this.callFactory(this._description, index),
          is_active: this.callFactory(this._is_active, index),
          type: this.callFactory(this._type, index),
          ...(this._created_at && {
            created_at: this.callFactory(this._created_at, index),
          }),
        });
        symbol.validate();
        return symbol;
      });
    return this.countObjs === 1 ? (symbols[0] as any) : symbols;
  }

  get symbol_id() {
    return this.getValue('symbol_id');
  }

  get description() {
    return this.getValue('description');
  }

  get is_active() {
    return this.getValue('is_active');
  }

  get type() {
    return this.getValue('type');
  }

  get created_at() {
    return this.getValue('created_at');
  }

  private getValue(prop: any) {
    const optional = ['symbol_id', 'created_at'];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`,
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}