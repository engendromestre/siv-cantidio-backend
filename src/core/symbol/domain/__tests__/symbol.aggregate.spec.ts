import { SymbolType } from "../symbol-type.vo";
import { Symbol, SymbolId } from "../symbol.aggregate";


describe('Symbol Unit Tests', () => {
    beforeEach(() => {
        Symbol.prototype.validate = jest
            .fn()
            .mockImplementation(Symbol.prototype.validate);
    });

    it('should construct a symbol', () => {
        const icon = SymbolType.createAnIcon();
        let symbol = new Symbol({
            description: 'description',
            is_active: true,
            type: icon
        });

        expect(symbol.symbol_id).toBeInstanceOf(SymbolId);
        expect(symbol.description).toEqual('description');
        expect(symbol.is_active).toEqual(true);
        expect(symbol.type).toEqual(icon);
        expect(symbol.created_at).toBeInstanceOf(Date);

        let created_at = new Date();
        symbol = new Symbol({
            description: 'some description',
            is_active: true,
            type: icon,
            created_at
        });

        expect(symbol.symbol_id).toBeInstanceOf(SymbolId);
        expect(symbol.description).toEqual('some description');
        expect(symbol.is_active).toEqual(true);
        expect(symbol.type).toEqual(icon);
        expect(symbol.created_at).toBe(created_at);
    });

    it('should create a symbol', () => {
        const icon = SymbolType.createAnIcon();
        const symbol = Symbol.create({
            description: 'description',
            is_active: true,
            type: icon
        });

        expect(symbol.symbol_id).toBeInstanceOf(SymbolId);
        expect(symbol.description).toEqual('description');
        expect(symbol.is_active).toEqual(true);
        expect(symbol.type).toEqual(icon);
        expect(symbol.created_at).toBeInstanceOf(Date);
        expect(Symbol.prototype.validate).toHaveBeenCalledTimes(1);
        expect(symbol.notification.hasErrors()).toBe(false);

    });

    describe('symbol_id field', () => {
        const arrange = [
            { id: null },
            { id: undefined },
            { id: new SymbolId() },
        ];

        test.each(arrange)('should be is %j', (props) => {
            const symbol = new Symbol(props as any);
            expect(symbol.symbol_id).toBeInstanceOf(SymbolId);
        });
    });

    it('should change description', () => {
        const icon = SymbolType.createAnIcon()
        const symbol = Symbol.create({
            description: 'description',
            is_active: true,
            type: icon,
        });
        symbol.changeDescription('new description');

        expect(symbol.description).toEqual('new description');
        expect(Symbol.prototype.validate).toHaveBeenCalledTimes(2);
        expect(symbol.notification.hasErrors()).toBe(false);
    });

    it('should activate symbol', () => {
        const icon = SymbolType.createAnIcon();
        const symbol = Symbol.create({
            description: 'description',
            is_active: false,
            type: icon,
        });
        symbol.activate();

        expect(symbol.is_active).toEqual(true);
        expect(Symbol.prototype.validate).toHaveBeenCalledTimes(1);
        expect(symbol.notification.hasErrors()).toBe(false);
    });

    it('should deactivate symbol', () => {
        const icon = SymbolType.createAnIcon();
        const symbol = Symbol.create({
            description: 'description',
            is_active: true,
            type: icon,
        });
        symbol.deactivate();

        expect(symbol.is_active).toEqual(false);
        expect(Symbol.prototype.validate).toHaveBeenCalledTimes(1);
        expect(symbol.notification.hasErrors()).toBe(false);
    });

    describe('Symbol Validator', () => {
        describe('create command', () => {
            test('should an invalid symbol with description property', () => {
                const symbol = Symbol.create({ 
                    description: 't'.repeat(256) 
                } as any);
                expect(symbol.notification.hasErrors()).toBe(true);
                expect(symbol.notification).notificationContainsErrorMessages([
                    {
                        description: ['description must be shorter than or equal to 255 characters'],
                    },
                ]);
            });
        });

        describe('changeDescription method', () => {
            test('should an invalid symbol with description property', () => {
                const symbol = Symbol.create({ 
                    description: 'description',
                    is_active: true,
                    type: SymbolType.createAnIcon(),
                });
                symbol.changeDescription('t'.repeat(256));

                expect(symbol.notification.hasErrors()).toBe(true);
                expect(symbol.notification).notificationContainsErrorMessages([
                    {
                        description: ['description must be shorter than or equal to 255 characters'],
                    },
                ]);
            });
        });
    });
});