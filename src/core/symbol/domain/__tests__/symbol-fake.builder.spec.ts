import { Chance } from 'chance';
import { SymbolFakeBuilder } from '../symbol-fake.builder'; // Supondo que você tenha um SymbolFakeBuilder
import { SymbolId } from '../symbol.aggregate'; // Supondo que você tenha um SymbolId

describe('SymbolFakerBuilder Unit Tests', () => {
  describe('symbol_id prop', () => {
    const faker = SymbolFakeBuilder.anIcon();

    test('should throw error when any with methods has called', () => {
      expect(() => faker.symbol_id).toThrowError(
        new Error(
          "Property symbol_id not have a factory, use 'with' methods",
        ),
      );
    });

    test('should be undefined', () => {
      expect(faker['_symbol_id']).toBeUndefined();
    });

    test('withSymbolId', () => {
      const symbol_id = new SymbolId();
      const $this = faker.withSymbolId(symbol_id);
      expect($this).toBeInstanceOf(SymbolFakeBuilder);
      expect(faker['_symbol_id']).toBe(symbol_id);

      faker.withSymbolId(() => symbol_id);
      //@ts-expect-error _symbol_id is a callable
      expect(faker['_symbol_id']()).toBe(symbol_id);

      expect(faker.symbol_id).toBe(symbol_id);
    });

    test('should pass index to symbol_id factory', () => {
      let mockFactory = jest.fn(() => new SymbolId());
      faker.withSymbolId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);

      const symbolId = new SymbolId();
      mockFactory = jest.fn(() => symbolId);
      const fakerMany = SymbolFakeBuilder.theSymbols(2);
      fakerMany.withSymbolId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].symbol_id).toBe(symbolId);
      expect(fakerMany.build()[1].symbol_id).toBe(symbolId);
    });
  });

  describe('description prop', () => {
    const faker = SymbolFakeBuilder.anIcon();
    
    test('should be a function', () => {
      expect(typeof faker['_description']).toBe('function');
    });

    test('should call the word method', () => {
      const chance = Chance();
      const spySentenceMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();

      expect(spySentenceMethod).toHaveBeenCalled();
    });

      test('should pass index to description factory', () => {
        faker.withDescription((index) => `test symbol description ${index}`);
        const symbol = faker.build();
        expect(symbol.description).toBe(`test symbol description 0`);

        const fakerMany = SymbolFakeBuilder.theSymbols(2);
        fakerMany.withDescription((index) => `test symbol description ${index}`);
        const symbols = fakerMany.build();

        expect(symbols[0].description).toBe(`test symbol description 0`);
        expect(symbols[1].description).toBe(`test symbol description 1`);
      });

    test('should pass index to description factory', () => {
      faker.withDescription((index) => `test symbol description ${index}`);
      const symbol = faker.build();
      expect(symbol.description).toBe(`test symbol description 0`);

      const fakerMany = SymbolFakeBuilder.theSymbols(2);
      fakerMany.withDescription((index) => `test symbol description ${index}`);
      const symbols = fakerMany.build();

      expect(symbols[0].description).toBe(`test symbol description 0`);
      expect(symbols[1].description).toBe(`test symbol description 1`);
    });
  });

  describe('created_at prop', () => {
    const faker = SymbolFakeBuilder.anIcon();

    test('should throw error when any with methods has called', () => {
      const fakerSymbol = SymbolFakeBuilder.anIcon();
      expect(() => fakerSymbol.created_at).toThrowError(
        new Error("Property created_at not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_created_at']).toBeUndefined();
    });

    test('withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(SymbolFakeBuilder);
      expect(faker['_created_at']).toBe(date);

      faker.withCreatedAt(() => date);
      //@ts-expect-error _created_at is a callable
      expect(faker['_created_at']()).toBe(date);
      expect(faker.created_at).toBe(date);
    });

    test('should pass index to created_at factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const symbol = faker.build();
      expect(symbol.created_at.getTime()).toBe(date.getTime() + 2);

      const fakerMany = SymbolFakeBuilder.theSymbols(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const symbols = fakerMany.build();

      expect(symbols[0].created_at.getTime()).toBe(date.getTime() + 2);
      expect(symbols[1].created_at.getTime()).toBe(date.getTime() + 3);
    });
  });

  test('should create a symbol', () => {
    const faker = SymbolFakeBuilder.anIcon();
    let symbol = faker.build();

    expect(symbol.symbol_id).toBeInstanceOf(SymbolId);
    expect(typeof symbol.description === 'string').toBeTruthy();
    expect(symbol.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    const symbol_id = new SymbolId();
    symbol = faker
      .withSymbolId(symbol_id)
      .withDescription('description test')
      .withCreatedAt(created_at)
      .build();

    expect(symbol.symbol_id.id).toBe(symbol_id.id);
    expect(symbol.description).toBe('description test');
    expect(symbol.created_at).toBe(created_at);
  });

  test('should create many symbols', () => {
    const faker = SymbolFakeBuilder.theSymbols(2);
    let symbols = faker.build();

    symbols.forEach((symbol) => {
      expect(symbol.symbol_id).toBeInstanceOf(SymbolId);
      expect(typeof symbol.description === 'string').toBeTruthy();
      expect(symbol.created_at).toBeInstanceOf(Date);
    });

    const created_at = new Date();
    const symbol_id = new SymbolId();
    symbols = faker
      .withSymbolId(symbol_id)
      .withDescription('description test')
      .withCreatedAt(created_at)
      .build();

    symbols.forEach((symbol) => {
      expect(symbol.symbol_id.id).toBe(symbol_id.id);
      expect(symbol.description).toBe('description test');
      expect(symbol.created_at).toBe(created_at);
    });
  });
});