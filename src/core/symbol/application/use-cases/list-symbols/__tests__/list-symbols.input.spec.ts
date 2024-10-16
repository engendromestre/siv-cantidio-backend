import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";
import { ListSymbolsFilter, ListSymbolsInput } from "../list-symbols.input";
import { validateSync } from "class-validator";


describe('ListSymbolsInput Unit Tests', () => {
    it('validate', () => {
        const input = new ListSymbolsInput();
        input.page = 1;
        input.per_page = 10;
        input.sort = 'description';
        input.sort_dir = 'asc';
        const filter = new ListSymbolsFilter();
        filter.description = 'test';
        filter.is_active = true;
        filter.type = SymbolTypes.ICON;
        input.filter = filter;

        const errors = validateSync(input);
        expect(errors.length).toBe(0);
    });

    it('invalidate', () => {
        const input = new ListSymbolsInput();
        input.page = 1;
        input.per_page = 10;
        input.sort = 'description';
        input.sort_dir = 'asc';
        const filter = new ListSymbolsFilter();
        filter.description = 'test';
        filter.is_active = 'a' as any;
        filter.type = 'a' as any;
        input.filter = filter;

        const errors = validateSync(input);
        expect(errors.length).toBe(1);
    });
});