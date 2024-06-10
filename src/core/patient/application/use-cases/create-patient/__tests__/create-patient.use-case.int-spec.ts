import { CategoriesIdExistsInDatabaseValidator } from '../../../../../category/application/validations/categories-ids-exists-in-database.validator';
import { Category } from '../../../../../category/domain/category.aggregate';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { GenresIdExistsInDatabaseValidator } from '../../../../../genre/application/validations/genres-ids-exists-in-database.validator';
import { Genre } from '../../../../../genre/domain/genre.aggregate';
import { GenreModel } from '../../../../../genre/infra/db/sequelize/genre-model';
import { GenreSequelizeRepository } from '../../../../../genre/infra/db/sequelize/genre-sequelize.repository';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { Patient, PatientId } from '../../../../domain/patient.aggregate';
import { setupSequelizeForPatient } from '../../../../infra/db/sequelize/testing/helpers';
import { PatientSequelizeRepository } from '../../../../infra/db/sequelize/patient-sequelize.repository';
import { PatientModel } from '../../../../infra/db/sequelize/patient.model';
import { CreatePatientUseCase } from '../create-patient.use-case';

import { DatabaseError } from 'sequelize';
describe('CreatePatientUseCase Integration Tests', () => {
  let uow: UnitOfWorkSequelize;
  let useCase: CreatePatientUseCase;

  let patientRepo: PatientSequelizeRepository;
  let genreRepo: GenreSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;
  let categoriesIdsValidator: CategoriesIdExistsInDatabaseValidator;
  let genresIdsValidator: GenresIdExistsInDatabaseValidator;

  const sequelizeHelper = setupSequelizeForPatient();

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    patientRepo = new PatientSequelizeRepository(PatientModel, uow);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    categoriesIdsValidator = new CategoriesIdExistsInDatabaseValidator(
      categoryRepo,
    );
    genresIdsValidator = new GenresIdExistsInDatabaseValidator(genreRepo);
    useCase = new CreatePatientUseCase(
      uow,
      patientRepo,
      categoriesIdsValidator,
      genresIdsValidator,
    );
  });

  it('should create a patient', async () => {
    const categories = Category.fake().theCategories(2).build();
    await categoryRepo.bulkInsert(categories);
    const categoriesId = categories.map((c) => c.category_id.id);

    const genres = Genre.fake().theGenres(2).build();
    genres[0].syncCategoriesId([categories[0].category_id]);
    genres[1].syncCategoriesId([categories[1].category_id]);
    await genreRepo.bulkInsert(genres);
    const genresId = genres.map((c) => c.genre_id.id);

    const output = await useCase.execute({
      patient_id_siresp: '12345',
      patient_chart_number: '12345',
      full_name: 'Test Full Name',
      mother_full_name: 'Test Mother Full Name',
      birthdate: new Date('2000-02-01'),
      is_opened: true,
      categories_id: categoriesId,
      genres_id: genresId,
    });
    expect(output).toStrictEqual({
      id: expect.any(String),
    });
    const patient = await patientRepo.findById(new PatientId(output.id));
    expect(patient!.toJSON()).toStrictEqual({
      patient_id: expect.any(String),
      patient_id_siresp: '12345',
      patient_chart_number: '12345',
      full_name: 'Test Full Name',
      mother_full_name: 'Test Mother Full Name',
      birthdate: new Date('2000-02-01'),
      is_opened: true,
      is_published: false,
      photo: null,
      thumbnail: null,
      thumbnail_half: null,
      categories_id: expect.arrayContaining(categoriesId),
      genres_id: expect.arrayContaining(genresId),
      created_at: expect.any(Date),
    });
  });

  it('rollback transaction', async () => {
    const categories = Category.fake().theCategories(2).build();
    await categoryRepo.bulkInsert(categories);
    const categoriesId = categories.map((c) => c.category_id.id);

    const genres = Genre.fake().theGenres(2).build();
    genres[0].syncCategoriesId([categories[0].category_id]);
    genres[1].syncCategoriesId([categories[1].category_id]);
    await genreRepo.bulkInsert(genres);
    const genresId = genres.map((c) => c.genre_id.id);

    const patient = Patient.fake().aPatientWithoutMedias().build();
    patient.patient_id_siresp= "12345";
    patient.full_name = 't'.repeat(256);

    const mockCreate = jest
      .spyOn(Patient, 'create')
      .mockImplementation(() => patient);

    await expect(
      useCase.execute({
        patient_id_siresp: '12345',
        patient_full_name: 'Test Full Name',
        categories_id: categoriesId,
        genres_id: genresId,
      } as any),
    ).rejects.toThrowError(DatabaseError);

    const patients = await patientRepo.findAll();
    expect(patients.length).toEqual(0);

    mockCreate.mockRestore();
  });
});
