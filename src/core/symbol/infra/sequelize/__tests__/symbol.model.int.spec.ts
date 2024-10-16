import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { DataType } from "sequelize-typescript";
import { SymbolModel } from "../symbol.model";
import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";


describe('SymbolModel Integration Tests', () => {
    setupSequelize({ models: [SymbolModel] });

    test('mapping props', () => {
        const attributesMap = SymbolModel.getAttributes();
        
        const attributes = Object.keys(SymbolModel.getAttributes());
        expect(attributes).toStrictEqual([
            'symbol_id',
            'description',
            'type',
            'is_active',
            'created_at',
        ]);

        const symbolIdAttr = attributesMap.symbol_id;
        expect(symbolIdAttr).toMatchObject({
            field:'symbol_id',
            fieldName:'symbol_id',
            primaryKey: true,
            type: DataType.UUID(),
        });

        const descriptionAttr = attributesMap.description;
        expect(descriptionAttr).toMatchObject({
            field: 'description',
            fieldName: 'description',
            allowNull: false,
            type: DataType.STRING(255),
        });

        const createdAtAttr = attributesMap.created_at;
        expect(createdAtAttr).toMatchObject({
          field: 'created_at',
          fieldName: 'created_at',
          allowNull: false,
          type: DataType.DATE(3),
        });
    });

    test('create', async () => {
        //arrange
        const arrange = {
            symbol_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
            description: 'test',
            is_active: true,
            type: SymbolTypes.ICON,
            created_at: new Date(),
        };

        //act
        const symbol = await SymbolModel.create(arrange);

        //assert
        expect(symbol.toJSON()).toStrictEqual(arrange);
    })
});