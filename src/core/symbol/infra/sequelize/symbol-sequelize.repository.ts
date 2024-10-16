import { NotFoundError } from "@core/shared/domain/errors/not-found.error";
import { SortDirection } from "@core/shared/domain/repository/search-params";
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { ISymbolRepository, SymbolSearchParams, SymbolSearchResult } from "@core/symbol/domain/symbol.repository";
import { literal, Op } from "sequelize";
import { SymbolModelMapper } from "./symbol-model-mapper";
import { SymbolModel } from "./symbol.model";
import { InvalidArgumentError } from "@core/shared/domain/errors/invalid-argument.error";


export class SymbolSequelizeRepository implements ISymbolRepository {
    sortableFields: string[] = ['description', 'created_at'];
    orderBy = {
        mysql: {
            description: (sort_dir: SortDirection) => literal(`binary description ${sort_dir}`), //ascii
        }
    }

    constructor(private symbolModel: typeof SymbolModel) { }

    async search(props: SymbolSearchParams): Promise<SymbolSearchResult> {
        const offset = (props.page - 1) * props.per_page;
        const limit = props.per_page;
        const where = {};

        if (props.filter && (
            props.filter.description 
            || props.filter.is_active !== undefined 
            || props.filter.type
        )) {
            if (props.filter.description) {
                where['description'] = { [Op.like]: `%${props.filter.description}%` };
            }
            
            if (props.filter.is_active !== undefined) {
                where['is_active'] = props.filter.is_active;
            }

            if (props.filter.type) {
                where['type'] = props.filter.type.type;
            }
        }

        const { rows: models, count } = await this.symbolModel.findAndCountAll({
            ...(props.filter && {
                where,
            }),
            ...(props.sort && this.sortableFields.includes(props.sort)
                ? { order: this.formatSort(props.sort, props.sort_dir!) }
                : { order: [['created_at', 'DESC']] }),
            offset,
            limit,
        });
        
        return new SymbolSearchResult({
            items: models.map((model) => {
                return SymbolModelMapper.toEntity(model);
            }),
            current_page: props.page,
            per_page: props.per_page,
            total: count,
        });
    }
    private formatSort(sort: string, sort_dir: SortDirection) {
        const dialect = this.symbolModel.sequelize!.getDialect() as 'mysql';
        if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
            return this.orderBy[dialect][sort](sort_dir);
        }
        return [[sort, sort_dir]];
    }
    async insert(entity: Symbol): Promise<void> {
        const modelProps = SymbolModelMapper.toModel(entity);
        await this.symbolModel.create(modelProps.toJSON());
    }
    async bulkInsert(entities: Symbol[]): Promise<void> {
        const modelProps = entities.map((entity) =>
            SymbolModelMapper.toModel(entity).toJSON(),
        );
        await this.symbolModel.bulkCreate(modelProps);
    }
    async update(entity: Symbol): Promise<void> {
        const id = entity.symbol_id.id;

        const modelProps = SymbolModelMapper.toModel(entity);
        const [affectedRows] = await this.symbolModel.update(
            modelProps.toJSON(),
            {
                where: { symbol_id: entity.symbol_id.id },
            },
        );

        if (affectedRows !== 1) {
            throw new NotFoundError(id, this.getEntity());
        }
    }
    async delete(symbol_id: SymbolId): Promise<void> {
        const id = symbol_id.id;

        const affectedRows = await this.symbolModel.destroy({
            where: { symbol_id: id },
        });

        if (affectedRows !== 1) {
            throw new NotFoundError(id, this.getEntity());
        }
    }
    async findById(entity_id: SymbolId): Promise<Symbol | null> {
        const model = await this.symbolModel.findByPk(entity_id.id);
        return model ? SymbolModelMapper.toEntity(model) : null;
    }
    async findAll(): Promise<Symbol[]> {
        const models = await this.symbolModel.findAll();
        return models.map((m) => SymbolModelMapper.toEntity(m));
    }
    async findByIds(ids: SymbolId[]): Promise<Symbol[]> {
        const models = await this.symbolModel.findAll({
            where: {
                symbol_id: {
                    [Op.in]: ids.map((id) => id.id),
                },
            },
        });
        return models.map((m) => SymbolModelMapper.toEntity(m));

    }
    async existsById(
        ids: SymbolId[]
    ): Promise<{ exists: SymbolId[]; not_exists: SymbolId[]; }> {
        if (!ids.length) {
            throw new InvalidArgumentError(
                'ids must be an array with at least one element',
            );
        }

        const existsSymbolModels = await this.symbolModel.findAll({
            attributes: ['symbol_id'],
            where: {
                symbol_id: {
                    [Op.in]: ids.map((id) => id.id),
                },
            },
        });

        const existsSymbolsIds = existsSymbolModels.map(
            (m) => new SymbolId(m.symbol_id),
        );

        const notExistsSymbolsIds = ids.filter(
            (id) => !existsSymbolsIds.some((e) => e.equals(id)),
        );

        return {
            exists: existsSymbolsIds,
            not_exists: notExistsSymbolsIds,
        };
    }
    getEntity(): new (...args: any[]) => Symbol {
        return Symbol;
    }
}