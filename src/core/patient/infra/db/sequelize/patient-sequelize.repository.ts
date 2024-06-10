import { literal } from 'sequelize';
import { InvalidArgumentError } from '../../../../shared/domain/errors/invalid-argument.error';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { UnitOfWorkSequelize } from '../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { Patient, PatientId } from '../../../domain/patient.aggregate';
import {
  IPatientRepository,
  PatientSearchParams,
  PatientSearchResult,
} from '../../../domain/patient.repository';
import { PatientModelMapper } from './patient-model.mapper';
import { PatientModel } from './patient.model';
import { Op } from 'sequelize';

export class PatientSequelizeRepository implements IPatientRepository {
  sortableFields: string[] = ['full_name', 'created_at'];
  orderBy = {
    mysql: {
      name: (sort_dir: SortDirection) =>
        `binary ${this.patientModel.name}.full_name ${sort_dir}`,
    },
  };
  relations_include = [
    'categories_id',
    'genres_id',
    'image_medias',
  ];

  constructor(
    private patientModel: typeof PatientModel,
    private uow: UnitOfWorkSequelize,
  ) { }

  async insert(entity: Patient): Promise<void> {
    await this.patientModel.create(PatientModelMapper.toModelProps(entity), {
      include: this.relations_include,
      transaction: this.uow.getTransaction(),
    });
    this.uow.addAggregateRoot(entity);
  }

  async bulkInsert(entities: Patient[]): Promise<void> {
    const models = entities.map((e) => PatientModelMapper.toModelProps(e));
    await this.patientModel.bulkCreate(models, {
      include: this.relations_include,
      transaction: this.uow.getTransaction(),
    });
    entities.forEach((e) => this.uow.addAggregateRoot(e));
  }

  async findById(id: PatientId): Promise<Patient | null> {
    const model = await this._get(id.id);
    return model ? PatientModelMapper.toEntity(model) : null;
  }

  async findAll(): Promise<Patient[]> {
    const models = await this.patientModel.findAll({
      include: this.relations_include,
      transaction: this.uow.getTransaction(),
    });
    return models.map((m) => PatientModelMapper.toEntity(m));
  }

  async findByIds(ids: PatientId[]): Promise<Patient[]> {
    const models = await this.patientModel.findAll({
      where: {
        patient_id: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
      include: this.relations_include,
      transaction: this.uow.getTransaction(),
    });
    return models.map((m) => PatientModelMapper.toEntity(m));
  }

  async existsById(
    ids: PatientId[],
  ): Promise<{ exists: PatientId[]; not_exists: PatientId[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }

    const existsPatientModels = await this.patientModel.findAll({
      attributes: ['patient_id'],
      where: {
        patient_id: {
          [Op.in]: ids.map((id) => id.id),
        },
      },
      transaction: this.uow.getTransaction(),
    });
    const existsPatientIds = existsPatientModels.map(
      (m) => new PatientId(m.patient_id),
    );
    const notExistsPatientIds = ids.filter(
      (id) => !existsPatientIds.some((e) => e.equals(id)),
    );
    return {
      exists: existsPatientIds,
      not_exists: notExistsPatientIds,
    };
  }

  async update(entity: Patient): Promise<void> {
    const model = await this._get(entity.patient_id.id);

    if (!model) {
      throw new NotFoundError(entity.patient_id.id, this.getEntity());
    }

    await Promise.all([
      ...model.image_medias.map((i) =>
        i.destroy({ transaction: this.uow.getTransaction() }),
      ),
      model.$remove(
        'categories',
        model.categories_id.map((c) => c.category_id),
        {
          transaction: this.uow.getTransaction(),
        },
      ),
      model.$remove(
        'genres',
        model.genres_id.map((c) => c.genre_id),
        {
          transaction: this.uow.getTransaction(),
        },
      ),
    ]);

    const {
      categories_id,
      genres_id,
      image_medias,
      ...props
    } = PatientModelMapper.toModelProps(entity);
    await this.patientModel.update(props, {
      where: { patient_id: entity.patient_id.id },
      transaction: this.uow.getTransaction(),
    });

    await Promise.all([
      ...image_medias.map((i) =>
        model.$create('image_media', i.toJSON(), {
          transaction: this.uow.getTransaction(),
        }),
      ),
      model.$add(
        'categories',
        categories_id.map((c) => c.category_id),
        {
          transaction: this.uow.getTransaction(),
        },
      ),
      model.$add(
        'genres',
        genres_id.map((c) => c.genre_id),
        {
          transaction: this.uow.getTransaction(),
        },
      ),
    ]);

    this.uow.addAggregateRoot(entity);
  }

  async delete(id: PatientId): Promise<void> {
    //consultar o agregado
    const patientCategoryRelation =
      this.patientModel.associations.categories_id.target;
    const patientGenreRelation = this.patientModel.associations.genres_id.target;
    const imageMediaModel = this.patientModel.associations.image_medias.target;

    await Promise.all([
      patientCategoryRelation.destroy({
        where: { patient_id: id.id },
        transaction: this.uow.getTransaction(),
      }),
      patientGenreRelation.destroy({
        where: { patient_id: id.id },
        transaction: this.uow.getTransaction(),
      }),
      imageMediaModel.destroy({
        where: { patient_id: id.id },
        transaction: this.uow.getTransaction(),
      }),
    ]);
    const affectedRows = await this.patientModel.destroy({
      where: { patient_id: id.id },
      transaction: this.uow.getTransaction(),
    });

    if (affectedRows !== 1) {
      throw new NotFoundError(id.id, this.getEntity());
    }

    // this.uow.addAggregateRoot(patient);
  }

  private async _get(id: string): Promise<PatientModel | null> {
    return this.patientModel.findByPk(id, {
      include: this.relations_include,
      transaction: this.uow.getTransaction(),
    });
  }

  async search(props: PatientSearchParams): Promise<PatientSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;
    const patientTableName = this.patientModel.getTableName();
    const patientCategoryRelation =
      this.patientModel.associations.categories_id.target;
    const patientCategoryTableName = patientCategoryRelation.getTableName();
    const patientGenreRelation = this.patientModel.associations.genres_id.target;
    const patientGenreTableName = patientGenreRelation.getTableName();
    const patientAlias = this.patientModel.name;

    const wheres: any[] = [];

    if (
      props.filter &&
      (props.filter.full_name ||
        props.filter.categories_id ||
        props.filter.genres_id)
    ) {
      if (props.filter.full_name) {
        wheres.push({
          field: 'full_name',
          value: `%${props.filter.full_name}%`,
          get condition() {
            return {
              [this.field]: {
                [Op.like]: this.value,
              },
            };
          },
          rawCondition: `${patientAlias}.full_name LIKE :full_name`,
        });
      }

      if (props.filter.categories_id) {
        wheres.push({
          field: 'categories_id',
          value: props.filter.categories_id.map((c) => c.id),
          get condition() {
            return {
              ['$categories_id.category_id$']: {
                [Op.in]: this.value,
              },
            };
          },
          rawCondition: `${patientCategoryTableName}.category_id IN (:categories_id)`,
        });
      }

      if (props.filter.genres_id) {
        wheres.push({
          field: 'genres_id',
          value: props.filter.genres_id.map((c) => c.id),
          get condition() {
            return {
              ['$genres_id.genre_id$']: {
                [Op.in]: this.value,
              },
            };
          },
          rawCondition: `${patientGenreTableName}.genre_id IN (:genres_id)`,
        });
      }
    }

    const orderBy =
      props.sort && this.sortableFields.includes(props.sort)
        ? this.formatSort(props.sort, props.sort_dir)
        : `${patientAlias}.\`created_at\` DESC`;

    const count = await this.patientModel.count({
      distinct: true,
      include: [
        props.filter?.categories_id && 'categories_id',
        props.filter?.genres_id && 'genres_id',
      ].filter((i) => i) as string[],
      where: wheres.length ? { [Op.and]: wheres.map((w) => w.condition) } : {},
      transaction: this.uow.getTransaction(),
    });

    const columnOrder = orderBy.replace('binary', '').trim().split(' ')[0];

    const query = [
      'SELECT',
      `DISTINCT ${patientAlias}.\`patient_id\`,${columnOrder} FROM ${patientTableName} as ${patientAlias}`,
      props.filter?.categories_id
        ? `INNER JOIN ${patientCategoryTableName} ON ${patientAlias}.\`patient_id\` = ${patientCategoryTableName}.\`category_id\``
        : '',
      props.filter?.genres_id
        ? `INNER JOIN ${patientGenreTableName} ON ${patientAlias}.\`patient_id\` = ${patientGenreTableName}.\`genre_id\``
        : '',
      wheres.length
        ? `WHERE ${wheres.map((w) => w.rawCondition).join(' AND ')}`
        : '',
      `ORDER BY ${orderBy}`,
      `LIMIT ${limit}`,
      `OFFSET ${offset}`,
    ];

    const [idsResult] = await this.patientModel.sequelize!.query(
      query.join(' '),
      {
        replacements: wheres.reduce(
          (acc, w) => ({ ...acc, [w.field]: w.value }),
          {},
        ),
        transaction: this.uow.getTransaction(),
      },
    );

    const models = await this.patientModel.findAll({
      where: {
        patient_id: {
          [Op.in]: idsResult.map(
            (id: { patient_id: string }) => id.patient_id,
          ) as string[],
        },
      },
      include: this.relations_include,
      order: literal(orderBy),
      transaction: this.uow.getTransaction(),
    });

    return new PatientSearchResult({
      items: models.map((m) => PatientModelMapper.toEntity(m)),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  private formatSort(sort: string, sort_dir: SortDirection | null) {
    const dialect = this.patientModel.sequelize!.getDialect();
    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir);
    }
    return `${this.patientModel.name}.\`${sort}\` ${sort_dir}`;
  }

  getEntity(): new (...args: any[]) => Patient {
    return Patient;
  }
}
