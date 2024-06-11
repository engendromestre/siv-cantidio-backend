import { DataType } from 'sequelize-typescript';
import {
  PatientCategoryModel,
  PatientGenreModel,
  PatientModel,
} from '../patient.model';
import { ImageMediaModel, ImageMediaRelatedField } from '../image-media.model';
import { PatientId } from '../../../../domain/patient.aggregate';
import { Category } from '../../../../../category/domain/category.aggregate';
import { Genre } from '../../../../../genre/domain/genre.aggregate';
import { setupSequelizeForPatient } from '../testing/helpers';
import { GenreModel } from '../../../../../genre/infra/db/sequelize/genre-model';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { GenreSequelizeRepository } from '../../../../../genre/infra/db/sequelize/genre-sequelize.repository';
import { UnitOfWorkFakeInMemory } from '../../../../../shared/infra/db/in-memory/fake-unit-of-work-in-memory';

describe('PatientCategoryModel Unit Tests', () => {
  setupSequelizeForPatient();

  test('table name', () => {
    expect(PatientCategoryModel.tableName).toBe('category_patient');
  });

  test('mapping props', () => {
    const attributesMap = PatientCategoryModel.getAttributes();
    const attributes = Object.keys(PatientCategoryModel.getAttributes());
    expect(attributes).toStrictEqual(['patient_id', 'category_id']);

    const patientIdAttr = attributesMap.patient_id;
    expect(patientIdAttr).toMatchObject({
      field: 'patient_id',
      fieldName: 'patient_id',
      primaryKey: true,
      type: DataType.UUID(),
      references: {
        model: 'patients',
        key: 'patient_id',
      },
      unique: 'category_patient_patient_id_category_id_unique',
    });

    const categoryIdAttr = attributesMap.category_id;
    expect(categoryIdAttr).toMatchObject({
      field: 'category_id',
      fieldName: 'category_id',
      primaryKey: true,
      type: DataType.UUID(),
      references: {
        model: 'categories',
        key: 'category_id',
      },
      unique: 'category_patient_patient_id_category_id_unique',
    });
  });
});

describe('PatientGenreModel Unit Tests', () => {
  setupSequelizeForPatient();

  test('table name', () => {
    expect(PatientGenreModel.tableName).toBe('genre_patient');
  });

  test('mapping props', () => {
    const attributesMap = PatientGenreModel.getAttributes();
    const attributes = Object.keys(PatientGenreModel.getAttributes());
    expect(attributes).toStrictEqual(['patient_id', 'genre_id']);

    const patientIdAttr = attributesMap.patient_id;
    expect(patientIdAttr).toMatchObject({
      field: 'patient_id',
      fieldName: 'patient_id',
      primaryKey: true,
      type: DataType.UUID(),
      references: {
        model: 'patients',
        key: 'patient_id',
      },
      unique: 'genre_patient_patient_id_genre_id_unique',
    });

    const genreIdAttr = attributesMap.genre_id;
    expect(genreIdAttr).toMatchObject({
      field: 'genre_id',
      fieldName: 'genre_id',
      primaryKey: true,
      type: DataType.UUID(),
      references: {
        model: 'genres',
        key: 'genre_id',
      },
      unique: 'genre_patient_patient_id_genre_id_unique',
    });
  });
});

describe('PatientModel Unit Tests', () => {
  setupSequelizeForPatient();

  test('table name', () => {
    expect(PatientModel.tableName).toBe('patients');
  });

  test('mapping props', () => {
    const attributesMap = PatientModel.getAttributes();
    const attributes = Object.keys(PatientModel.getAttributes());
    expect(attributes).toStrictEqual([
      'patient_id',
      'patient_id_siresp',
      'patient_chart_number',
      'full_name',
      'mother_full_name',
      'birthdate',
      'is_opened',
      'is_published',
      'created_at',
    ]);

    const patientIdAttr = attributesMap.patient_id;
    expect(patientIdAttr).toMatchObject({
      field: 'patient_id',
      fieldName: 'patient_id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const patientIdSirespAttr = attributesMap.patient_id_siresp;
    expect(patientIdSirespAttr).toMatchObject({
      field: 'patient_id_siresp',
      fieldName: 'patient_id_siresp',
      allowNull: false,
      type: DataType.STRING(5),
    });

    const patientChartNumberAttr = attributesMap.patient_chart_number;
    expect(patientChartNumberAttr).toMatchObject({
      field: 'patient_chart_number',
      fieldName: 'patient_chart_number',
      allowNull: true,
      type: DataType.STRING(5),
    });

    const fullNameAttr = attributesMap.full_name;
    expect(fullNameAttr).toMatchObject({
      field: 'full_name',
      fieldName: 'full_name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const motherFullNameAttr = attributesMap.mother_full_name;
    expect(motherFullNameAttr).toMatchObject({
      field: 'mother_full_name',
      fieldName: 'mother_full_name',
      allowNull: true,
      type: DataType.STRING(255),
    });

    const birthdateAttr = attributesMap.birthdate;
    expect(birthdateAttr).toMatchObject({
      field: 'birthdate',
      fieldName: 'birthdate',
      allowNull: true,
      type: DataType.DATE(6),
    });

    const isOpenedAttr = attributesMap.is_opened;
    expect(isOpenedAttr).toMatchObject({
      field: 'is_opened',
      fieldName: 'is_opened',
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    const isPublishedAttr = attributesMap.is_published;
    expect(isPublishedAttr).toMatchObject({
      field: 'is_published',
      fieldName: 'is_published',
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    const createdAtAttr = attributesMap.created_at;
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      allowNull: false,
      type: DataType.DATE(6),
    });
  });

  test('mapping associations', () => {
    const associationsMap = PatientModel.associations;
    const associations = Object.keys(associationsMap);
    expect(associations).toStrictEqual([
      'image_medias',
      'categories_id',
      'categories',
      'genres_id',
      'genres',
    ]);

    const imageMediasAttr = associationsMap.image_medias;
    expect(imageMediasAttr).toMatchObject({
      foreignKey: 'patient_id',
      source: PatientModel,
      target: ImageMediaModel,
      associationType: 'HasMany',
      options: {
        foreignKey: {
          name: 'patient_id',
        },
      },
    });

    const categoriesIdAttr = associationsMap.categories_id;
    expect(categoriesIdAttr).toMatchObject({
      foreignKey: 'patient_id',
      source: PatientModel,
      target: PatientCategoryModel,
      associationType: 'HasMany',
      options: {
        foreignKey: { name: 'patient_id' },
        as: 'categories_id',
      },
    });

    const categoriesRelation = associationsMap.categories;
    expect(categoriesRelation).toMatchObject({
      associationType: 'BelongsToMany',
      source: PatientModel,
      target: CategoryModel,
      options: {
        through: { model: PatientCategoryModel },
        foreignKey: { name: 'patient_id' },
        otherKey: { name: 'category_id' },
        as: 'categories',
      },
    });

    const genresIdAttr = associationsMap.genres_id;
    expect(genresIdAttr).toMatchObject({
      foreignKey: 'patient_id',
      source: PatientModel,
      target: PatientGenreModel,
      associationType: 'HasMany',
      options: {
        foreignKey: { name: 'patient_id' },
        as: 'genres_id',
      },
    });

    const genresRelation = associationsMap.genres;
    expect(genresRelation).toMatchObject({
      associationType: 'BelongsToMany',
      source: PatientModel,
      target: GenreModel,
      options: {
        through: { model: PatientGenreModel },
        foreignKey: { name: 'patient_id' },
        otherKey: { name: 'genre_id' },
        as: 'genres',
      },
    });
  });

  test('create and association relations separately ', async () => {
    const categoryRepo = new CategorySequelizeRepository(CategoryModel);
    const category = Category.fake().aCategory().build();
    await categoryRepo.insert(category);

    const genreRepo = new GenreSequelizeRepository(
      GenreModel,
      new UnitOfWorkFakeInMemory() as any,
    );
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(genre);

    const birthOfDate = new Date('2000-02-01');
    const patientProps = {
      patient_id: new PatientId().id,
      patient_id_siresp: '12345',
      patient_chart_number: '12345',
      full_name: 'Test Full Name',
      mother_full_name: 'Mother Full Name',
      birthdate: birthOfDate,
      is_opened: false,
      is_published: false,
      created_at: new Date(),
    };

    const patient = await PatientModel.create(patientProps as any);

    await patient.$add('categories', [category.category_id.id]);
    const patientWithCategories = await PatientModel.findByPk(patient.patient_id, {
      include: ['categories_id'],
    });
    expect(patientWithCategories).toMatchObject(patientProps);
    expect(patientWithCategories!.categories_id).toHaveLength(1);
    expect(patientWithCategories!.categories_id[0]).toBeInstanceOf(
      PatientCategoryModel,
    );
    expect(patientWithCategories!.categories_id[0].category_id).toBe(
      category.category_id.id,
    );
    expect(patientWithCategories!.categories_id[0].patient_id).toBe(patient.patient_id);

    await patient.$add('genres', [genre.genre_id.id]);
    const patientWithGenres = await PatientModel.findByPk(patient.patient_id, {
      include: ['genres_id'],
    });
    expect(patientWithGenres).toMatchObject(patientProps);
    expect(patientWithGenres!.genres_id).toHaveLength(1);
    expect(patientWithGenres!.genres_id[0]).toBeInstanceOf(PatientGenreModel);
    expect(patientWithGenres!.genres_id[0].genre_id).toBe(genre.genre_id.id);
    expect(patientWithGenres!.genres_id[0].patient_id).toBe(patient.patient_id);

    await patient.$create('image_media', {
      name: 'name',
      location: 'location',
      patient_related_field: ImageMediaRelatedField.PHOTO,
    });
    const patientWithImageMedias = await PatientModel.findByPk(patient.patient_id, {
      include: ['image_medias'],
    });
    expect(patientWithImageMedias).toMatchObject(patientProps);
    expect(patientWithImageMedias!.image_medias).toHaveLength(1);
    expect(patientWithImageMedias!.image_medias[0].toJSON()).toMatchObject({
      name: 'name',
      location: 'location',
      patient_id: patient.patient_id,
      patient_related_field: ImageMediaRelatedField.PHOTO,
    });
  });

  test('create and association in single transaction ', async () => {
    const categoryRepo = new CategorySequelizeRepository(CategoryModel);
    const category = Category.fake().aCategory().build();
    await categoryRepo.insert(category);

    const genreRepo = new GenreSequelizeRepository(
      GenreModel,
      new UnitOfWorkFakeInMemory() as any,
    );
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(genre);

    const dateOfBirth = new Date('200-02-01');
    const patientProps = {
      patient_id: new PatientId().id,
      patient_id_siresp: '12345',
      patient_chart_number: '12345',
      full_name: 'Test Full Name',
      mother_full_name: 'Test Mother Full Name',
      birthdate: dateOfBirth,
      is_opened: false,
      is_published: false,
      created_at: new Date(),
    };

    const patient = await PatientModel.create(
      {
        ...patientProps,
        categories_id: [
          PatientCategoryModel.build({
            category_id: category.category_id.id,
            patient_id: patientProps.patient_id,
          }),
        ],
        genres_id: [
          PatientGenreModel.build({
            genre_id: genre.genre_id.id,
            patient_id: patientProps.patient_id,
          }),
        ],
        image_medias: [
          ImageMediaModel.build({
            name: 'name',
            location: 'location',
            patient_related_field: ImageMediaRelatedField.PHOTO,
          } as any),
        ],
      },
      {
        include: [
          'categories_id',
          'genres_id',
          'image_medias',
        ],
      },
    );

    const patientWithRelations = await PatientModel.findByPk(patient.patient_id, {
      include: [
        'categories_id',
        'genres_id',
        'image_medias',
      ],
    });
    expect(patientWithRelations).toMatchObject(patientProps);
    expect(patientWithRelations!.categories_id).toHaveLength(1);
    expect(patientWithRelations!.categories_id[0]).toBeInstanceOf(
      PatientCategoryModel,
    );
    expect(patientWithRelations!.categories_id[0].category_id).toBe(
      category.category_id.id,
    );
    expect(patientWithRelations!.categories_id[0].patient_id).toBe(patient.patient_id);
    expect(patientWithRelations!.genres_id).toHaveLength(1);
    expect(patientWithRelations!.genres_id[0]).toBeInstanceOf(PatientGenreModel);
    expect(patientWithRelations!.genres_id[0].genre_id).toBe(genre.genre_id.id);
    expect(patientWithRelations!.genres_id[0].patient_id).toBe(patient.patient_id);
    expect(patientWithRelations!.image_medias).toHaveLength(1);
    expect(patientWithRelations!.image_medias[0].toJSON()).toMatchObject({
      name: 'name',
      location: 'location',
      patient_id: patient.patient_id,
      patient_related_field: ImageMediaRelatedField.PHOTO,
    });
  });
});
