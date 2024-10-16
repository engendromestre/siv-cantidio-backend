import { Symbol } from '@core/symbol/domain/symbol.aggregate';
import { SymbolInMemoryRepository } from "./symbol-in-memory.repository";
import { SymbolType, SymbolTypes } from '@core/symbol/domain/symbol-type.vo';

describe('SymbolInMemoryRepository', () => {
    let repository: SymbolInMemoryRepository;

    beforeEach(() => (repository = new SymbolInMemoryRepository()));

    it('should no filter items when filter object is null', async () => {
        const items = [Symbol.fake().anIcon().build()];
        const filterSpy = jest.spyOn(items, 'filter' as any);

        const itemsFiltered = await repository['applyFilter'](items, null);
        expect(filterSpy).not.toHaveBeenCalled();
        expect(itemsFiltered).toStrictEqual(items);
    });

    it('should sort by created_at when sort param is null', async () => {
        const created_at = new Date();

        const items = [
            Symbol.fake()
                .anIcon()
                .withDescription('test')
                .withCreatedAt(created_at)
                .build(),
            Symbol.fake()
                .anIcon()
                .withDescription('TEST')
                .withCreatedAt(new Date(created_at.getTime() + 100))
                .build(),
            Symbol.fake()
                .anIcon()
                .withDescription('fake')
                .withCreatedAt(new Date(created_at.getTime() + 200))
                .build(),
        ];

        const itemsSorted = await repository['applySort'](items, null, null);
        expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
    });

    it('should sort by description', async () => {
        const items = [
            Symbol.fake().anIcon().withDescription('c').build(),
            Symbol.fake().anIcon().withDescription('b').build(),
            Symbol.fake().anIcon().withDescription('a').build(),
        ];

        const itemsSorted = await repository['applySort'](items, 'description', 'asc');
        expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

        const itemsSortedDesc = await repository['applySort'](items, 'description', 'desc');
        expect(itemsSortedDesc).toStrictEqual([items[0], items[1], items[2]]);
    });

    it('should filter items by description', async () => {
        const faker = Symbol.fake().anIcon();
        const items = [
            faker.withDescription('test').build(),
            faker.withDescription('TEST').build(),
            faker.withDescription('fake').build(),
        ];

        const filterSpy = jest.spyOn(items, 'filter' as any);

        const itemsFiltered = await repository['applyFilter'](items, {
            description: 'TEST',
        });

        expect(filterSpy).toHaveBeenCalledTimes(1);
        expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
    });

    it('should filter items by type', async () => {
        const items = [
            Symbol.fake().anIcon().build(),
        ];

        const filterSpy = jest.spyOn(items, 'filter' as any);

        let itemsFiltered = await repository['applyFilter'](items, {
            type: SymbolType.createAnIcon(),
        });

        expect(filterSpy).toHaveBeenCalledTimes(1);
        expect(itemsFiltered).toStrictEqual([items[0]]);
    });

    it('should filter items by is_active', async () => {
        const items = [
            Symbol.fake().anIcon().build(),
        ];

        const filterSpy = jest.spyOn(items, 'filter' as any);

        let itemsFiltered = await repository['applyFilter'](items, {
            is_active: true,
        });

        expect(filterSpy).toHaveBeenCalledTimes(1);
        expect(itemsFiltered).toStrictEqual([items[0]]);

        itemsFiltered = await repository['applyFilter'](items, {
            is_active: false,
        });

        expect(filterSpy).toHaveBeenCalledTimes(2);
        expect(itemsFiltered).toStrictEqual([]);
    });

    it('should filter items by is_active and description', async () => {
        const items = [
            Symbol.create({
               description: 'test',
               type: SymbolType.createAnIcon(),
               is_active: true,
            })
        ];

        const filterSpy = jest.spyOn(items, 'filter' as any);

        let itemsFiltered = await repository['applyFilter'](items, {
            is_active: true,
            description: 'test',
        });

        expect(filterSpy).toHaveBeenCalledTimes(1);
        expect(itemsFiltered).toStrictEqual([items[0]]);
    });

    it('should filter items by description, type and is_active', async () => {
        const items = [
            Symbol.create({
               description: 'test',
               type: SymbolType.createAnIcon(),
               is_active: true,
            })
        ];

        const filterSpy = jest.spyOn(items, 'filter' as any);

        let itemsFiltered = await repository['applyFilter'](items, {
            description: 'test',
            type: SymbolType.createAnIcon(),
            is_active: true,            
        });

        expect(filterSpy).toHaveBeenCalledTimes(1);
        expect(itemsFiltered).toStrictEqual([items[0]]);
    });

    it('should filter items by description and type', async () => {
        const items = [
            Symbol.create({
               description: 'test',
               type: SymbolType.createAnIcon(),
               is_active: true,
            })
        ];

        const filterSpy = jest.spyOn(items, 'filter' as any);

        let itemsFiltered = await repository['applyFilter'](items, {
            description: 'test',
            type: SymbolType.createAnIcon(),           
        });

        expect(filterSpy).toHaveBeenCalledTimes(1);
        expect(itemsFiltered).toStrictEqual([items[0]]);
    });

    it('should filter items by is_active and type', async () => {
        const items = [
            Symbol.create({
               description: 'test',
               type: SymbolType.createAnIcon(),
               is_active: true,
            })
        ];

        const filterSpy = jest.spyOn(items, 'filter' as any);

        let itemsFiltered = await repository['applyFilter'](items, {
            is_active: true,
            type: SymbolType.createAnIcon(),           
        });

        expect(filterSpy).toHaveBeenCalledTimes(1);
        expect(itemsFiltered).toStrictEqual([items[0]]);
    });
});