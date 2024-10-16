import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";
import {
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table
} from "sequelize-typescript";


export type SymbolModelProps = {
    symbol_id: string;
    description: string;
    is_active: boolean;
    type: SymbolTypes;
    created_at: Date;
}

@Table({ tableName: 'symbols', timestamps: false })
export class SymbolModel extends Model<SymbolModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare symbol_id: string;

    @Column({
        allowNull: false,
        unique: true,
        type: DataType.STRING(255)
    })
    declare description: string;

    @Column({
        allowNull: false,
        type: DataType.SMALLINT,
    })
    declare type: SymbolTypes;

    @Column({ allowNull: false, type: DataType.BOOLEAN })
    declare is_active: boolean;

    @Column({ allowNull: false, type: DataType.DATE(3) })
    declare created_at: Date;
}