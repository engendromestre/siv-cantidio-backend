import { Category } from '../../../../../category/domain/category.aggregate';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { Genre } from '../../../../../genre/domain/genre.aggregate';
import { GenreModel } from '../../../../../genre/infra/db/sequelize/genre-model';
import { GenreSequelizeRepository } from '../../../../../genre/infra/db/sequelize/genre-sequelize.repository';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
import { Patient, PatientId } from '../../../../domain/patient.aggregate';
import {
  PatientSearchParams,
  PatientSearchResult,
} from '../../../../domain/patient.repository';
import { ImageMediaModel } from '../image-media.model';
import { setupSequelizeForPatient } from '../testing/helpers';
import { PatientModelMapper } from '../patient-model.mapper';
import { PatientSequelizeRepository } from '../patient-sequelize.repository';
import {
  PatientCategoryModel,
  PatientGenreModel,
  PatientModel,
} from '../patient.model';
<<<<<<< HEAD
=======
import { ConsoleLogger } from '@nestjs/common';
>>>>>>> fix-patient-sequelize

describe('PatientSequelizeRepository Integration Tests', () => {
  const sequelizeHelper = setupSequelizeForPatient();
  let patientRepo: PatientSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;
  let genreRepo: GenreSequelizeRepository;
  let uow: UnitOfWorkSequelize;

  beforeEach(async () => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    patientRepo = new PatientSequelizeRepository(PatientModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
  });

  it('should inserts a new entity without medias', async () => {
    const { category, genre } = await createRelations();

    const patient = Patient.fake()
      .aPatientWithoutMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .build();
<<<<<<< HEAD
=======

>>>>>>> fix-patient-sequelize
    await patientRepo.insert(patient);
    const newPatient = await patientRepo.findById(patient.patient_id);
    expect(newPatient!.toJSON()).toStrictEqual(patient.toJSON());
  });

  it('should inserts a new entity with medias', async () => {
    const { category, genre } = await createRelations();

    const patient = Patient.fake()
      .aPatientWithoutMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .build();
    await patientRepo.insert(patient);
    const newPatient = await patientRepo.findById(patient.patient_id);
    expect(newPatient!.toJSON()).toStrictEqual(patient.toJSON());
  });

  it('should bulk inserts new entities without medias', async () => {
    const { category, genre } = await createRelations();

    const patients = Patient.fake()
      .thePatientsWithoutMedias(2)
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .build();
<<<<<<< HEAD
    await patientRepo.bulkInsert(patients);
    const newPatients = await patientRepo.findAll();
=======

    await patientRepo.bulkInsert(patients);
    const newPatients = await patientRepo.findAll();

>>>>>>> fix-patient-sequelize
    expect(newPatients.length).toBe(2);
    expect(newPatients[0].toJSON()).toStrictEqual(patients[0].toJSON());
    expect(newPatients[1].toJSON()).toStrictEqual(patients[1].toJSON());
  });

  it('should bulk inserts new entities with medias', async () => {
    const { category, genre } = await createRelations();

    const patients = Patient.fake()
      .thePatientsWithAllMedias(2)
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .build();
    await patientRepo.bulkInsert(patients);
    const newPatients = await patientRepo.findAll();
    expect(newPatients.length).toBe(2);
    expect(newPatients[0].toJSON()).toStrictEqual(patients[0].toJSON());
    expect(newPatients[1].toJSON()).toStrictEqual(patients[1].toJSON());
  });

  it('should finds a entity by id without medias', async () => {
    const { category, genre } = await createRelations();
    const patient = Patient.fake()
      .aPatientWithoutMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .build();
    await patientRepo.insert(patient);

    const entityFound = await patientRepo.findById(patient.patient_id);
    expect(patient.toJSON()).toStrictEqual(entityFound!.toJSON());
  });

  it('should finds a entity by id with medias', async () => {
    const { category, genre } = await createRelations();
    const patient = Patient.fake()
      .aPatientWithAllMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .build();
    await patientRepo.insert(patient);

    const entityFound = await patientRepo.findById(patient.patient_id);
    expect(patient.toJSON()).toStrictEqual(entityFound!.toJSON());
  });

  it('should return all patients without medias', async () => {
    const { category, genre } = await createRelations();
    const patient = Patient.fake()
      .aPatientWithoutMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .build();
    await patientRepo.insert(patient);

    const patients = await patientRepo.findAll();
    expect([patient.toJSON()]).toStrictEqual([patients[0].toJSON()]);
  });

  it('should return all patients with medias', async () => {
    const { category, genre } = await createRelations();
    const patient = Patient.fake()
      .aPatientWithAllMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .build();
    await patientRepo.insert(patient);

    const patients = await patientRepo.findAll();
    expect([patient.toJSON()]).toStrictEqual([patients[0].toJSON()]);
  });

  it('should throw error on update when a entity not found', async () => {
    const entity = Patient.fake().aPatientWithoutMedias().build();
    await expect(patientRepo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.patient_id.id, Patient),
    );
  });

  it('should update a entity', async () => {
    const categories = Category.fake().theCategories(3).build();
    await categoryRepo.bulkInsert(categories);
    const genres = Genre.fake()
      .theGenres(3)
      .addCategoryId(categories[0].category_id)
      .build();
    await genreRepo.bulkInsert(genres);
    const fakerPatient = Patient.fake().aPatientWithoutMedias();
    const patient = Patient.fake()
      .aPatientWithoutMedias()
      .addCategoryId(categories[0].category_id)
      .addGenreId(genres[0].genre_id)
      .build();
    await patientRepo.insert(patient);

    patient.changeFullName('Full Name changed');
    patient.syncCategoriesId([categories[1].category_id]);
    patient.syncGenresId([genres[1].genre_id]);
    await patientRepo.update(patient);

    let patientUpdated = await patientRepo.findById(patient.patient_id);
    expect(patient.toJSON()).toStrictEqual(patientUpdated!.toJSON());
    await expect(PatientCategoryModel.count()).resolves.toBe(1);
    await expect(PatientGenreModel.count()).resolves.toBe(1);

    patient.replacePhoto(fakerPatient.photo);
    patient.replaceThumbnail(fakerPatient.thumbnail);
    patient.replaceThumbnailHalf(fakerPatient.thumbnail_half);

    await patientRepo.update(patient);

    patientUpdated = await patientRepo.findById(patient.patient_id);
    expect(patient.toJSON()).toStrictEqual(patientUpdated!.toJSON());
    await expect(PatientCategoryModel.count()).resolves.toBe(1);
    await expect(PatientGenreModel.count()).resolves.toBe(1);
    await expect(ImageMediaModel.count()).resolves.toBe(3);

    patient.replacePhoto(fakerPatient.photo);
    patient.replaceThumbnail(fakerPatient.thumbnail);
    patient.replaceThumbnailHalf(fakerPatient.thumbnail_half);

    await patientRepo.update(patient);

    patientUpdated = await patientRepo.findById(patient.patient_id);
    expect(patient.toJSON()).toStrictEqual(patientUpdated!.toJSON());
    await expect(PatientCategoryModel.count()).resolves.toBe(1);
    await expect(PatientGenreModel.count()).resolves.toBe(1);
    await expect(ImageMediaModel.count()).resolves.toBe(3);
  });

  it('should throw error on delete when a entity not found', async () => {
    const patientId = new PatientId();
    await expect(patientRepo.delete(patientId)).rejects.toThrow(
      new NotFoundError(patientId.id, Patient),
    );

    await expect(
      patientRepo.delete(new PatientId('9366b7dc-2d71-4799-b91c-c64adb205104')),
    ).rejects.toThrow(
      new NotFoundError('9366b7dc-2d71-4799-b91c-c64adb205104', Patient),
    );
  });

  it('should delete a entity', async () => {
    const { category, genre } = await createRelations();
    let patient = Patient.fake()
      .aPatientWithoutMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .build();
    await patientRepo.insert(patient);

    await patientRepo.delete(patient.patient_id);
    let patientFound = await PatientModel.findByPk(patient.patient_id.id);
    expect(patientFound).toBeNull();
    await expect(PatientCategoryModel.count()).resolves.toBe(0);
    await expect(PatientGenreModel.count()).resolves.toBe(0);

    patient = Patient.fake()
      .aPatientWithAllMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .build();
    await patientRepo.insert(patient);
    await patientRepo.delete(patient.patient_id);
    patientFound = await PatientModel.findByPk(patient.patient_id.id);
    expect(patientFound).toBeNull();
    await expect(PatientCategoryModel.count()).resolves.toBe(0);
    await expect(PatientGenreModel.count()).resolves.toBe(0);
    await expect(ImageMediaModel.count()).resolves.toBe(0);
  });

  describe('search method tests', () => {
    it('should order by created_at DESC when search params are null', async () => {
      const { category, genre } = await createRelations();

      const patients = Patient.fake()
        .thePatientsWithAllMedias(16)
        .withCreatedAt((index) => new Date(new Date().getTime() + 100 + index))
        .addCategoryId(category.category_id)
        .addGenreId(genre.genre_id)
        .build();
      await patientRepo.bulkInsert(patients);
      const spyToEntity = jest.spyOn(PatientModelMapper, 'toEntity');
      const searchOutput = await patientRepo.search(PatientSearchParams.create());
      expect(searchOutput).toBeInstanceOf(PatientSearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });

      [...patients.slice(1, 16)].reverse().forEach((item, index) => {
        expect(searchOutput.items[index]).toBeInstanceOf(Patient);
        const expected = searchOutput.items[index].toJSON();
        expect(item.toJSON()).toStrictEqual({
          ...expected,
          categories_id: [category.category_id.id],
          genres_id: [genre.genre_id.id],
        });
      });
    });

    it('should apply paginate and filter by full_name', async () => {
      const { category, genre } = await createRelations();
      const patients = [
        Patient.fake()
          .aPatientWithAllMedias()
<<<<<<< HEAD
          .withPatientIdSiresp('12345')
=======
>>>>>>> fix-patient-sequelize
          .withFullName('test')
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build(),
        Patient.fake()
          .aPatientWithAllMedias()
<<<<<<< HEAD
          .withPatientIdSiresp('12345')
=======
>>>>>>> fix-patient-sequelize
          .withFullName('a')
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build(),
        Patient.fake()
          .aPatientWithAllMedias()
<<<<<<< HEAD
          .withPatientIdSiresp('12345')
=======
>>>>>>> fix-patient-sequelize
          .withFullName('TEST')
          .withCreatedAt(new Date(new Date().getTime() + 2000))
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build(),
        Patient.fake()
          .aPatientWithAllMedias()
          .withPatientIdSiresp('12345')
          .withFullName('TeSt')
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build(),
      ];
<<<<<<< HEAD
=======

>>>>>>> fix-patient-sequelize
      await patientRepo.bulkInsert(patients);

      let searchOutput = await patientRepo.search(
        PatientSearchParams.create({
          page: 1,
          per_page: 2,
          filter: { full_name: 'TEST' },
        }),
      );


      let expected = new PatientSearchResult({
        items: [patients[0], patients[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
      }).toJSON(true);
      expect(searchOutput.toJSON(true)).toMatchObject({
        ...expected,
        items: [
          {
            ...expected.items[0],
            categories_id: [category.category_id.id],
            genres_id: [genre.genre_id.id],
          },
          {
            ...expected.items[1],
            categories_id: [category.category_id.id],
            genres_id: [genre.genre_id.id],
          },
        ],
      });

      expected = new PatientSearchResult({
        items: [patients[3]],
        total: 3,
        current_page: 2,
        per_page: 2,
      }).toJSON(true);
      searchOutput = await patientRepo.search(
        PatientSearchParams.create({
          page: 2,
          per_page: 2,
          filter: { full_name: 'TEST' },
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject({
        ...expected,
        items: [
          {
            ...expected.items[0],
            categories_id: [category.category_id.id],
          },
        ],
      });
    });
  });

  //TODO - fazer testes para buscas de categories_id, genres_id
<<<<<<< HEAD
 
=======

>>>>>>> fix-patient-sequelize
  describe('transaction mode', () => {
    describe('insert method', () => {
      it('should insert a genre', async () => {
        const { category, genre } = await createRelations();
        const patient = Patient.fake()
          .aPatientWithAllMedias()
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build();
        uow.start();
        await patientRepo.insert(patient);
        await uow.commit();

        const patientCreated = await patientRepo.findById(patient.patient_id);
        expect(patient.patient_id).toBeValueObject(patientCreated!.patient_id);
      });

      it('rollback the insertion', async () => {
        const { category, genre } = await createRelations();
        const patient = Patient.fake()
          .aPatientWithAllMedias()
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build();

        await uow.start();
        await patientRepo.insert(patient);
        await uow.rollback();

        await expect(patientRepo.findById(patient.patient_id)).resolves.toBeNull();
        await expect(PatientCategoryModel.count()).resolves.toBe(0);
        await expect(PatientGenreModel.count()).resolves.toBe(0);
        await expect(ImageMediaModel.count()).resolves.toBe(0);
      });
    });

    describe('bulkInsert method', () => {
<<<<<<< HEAD
      it('should insert a list of videos', async () => {
=======
      it('should insert a list of patients', async () => {
>>>>>>> fix-patient-sequelize
        const { category, genre } = await createRelations();
        const patients = Patient.fake()
          .thePatientsWithAllMedias(2)
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build();
        await uow.start();
        await patientRepo.bulkInsert(patients);
        await uow.commit();

        const [patient1, patient2] = await Promise.all([
          patientRepo.findById(patients[0].patient_id),
          patientRepo.findById(patients[1].patient_id),
        ]);
        expect(patient1!.patient_id).toBeValueObject(patients[0].patient_id);
        expect(patient2!.patient_id).toBeValueObject(patients[1].patient_id);
      });

      it('rollback the bulk insertion', async () => {
        const { category, genre } = await createRelations();
        const patients = Patient.fake()
          .thePatientsWithAllMedias(2)
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build();
        await uow.start();
        await patientRepo.bulkInsert(patients);
        await uow.rollback();

        await expect(
          patientRepo.findById(patients[0].patient_id),
        ).resolves.toBeNull();
        await expect(
          patientRepo.findById(patients[1].patient_id),
        ).resolves.toBeNull();
        await expect(PatientCategoryModel.count()).resolves.toBe(0);
        await expect(PatientGenreModel.count()).resolves.toBe(0);
        await expect(ImageMediaModel.count()).resolves.toBe(0);
      });
    });

    describe('findById method', () => {
      it('should return a patient', async () => {
        const { category, genre } = await createRelations();
        const patient = Patient.fake()
          .aPatientWithAllMedias()
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build();
        await uow.start();
        await patientRepo.insert(patient);
        const result = await patientRepo.findById(patient.patient_id);
        expect(result!.patient_id).toBeValueObject(patient.patient_id);
        await uow.commit();
      });
    });

    describe('findAll method', () => {
      it('should return a list of patients', async () => {
        const { category, genre } = await createRelations();
        const patients = Patient.fake()
          .thePatientsWithAllMedias(2)
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build();
        await uow.start();
        await patientRepo.bulkInsert(patients);
        const result = await patientRepo.findAll();
        expect(result.length).toBe(2);
        await uow.commit();
      });
    });

    describe('findByIds method', () => {
      it('should return a list of patients', async () => {
        const { category, genre } = await createRelations();
        const patients = Patient.fake()
          .thePatientsWithAllMedias(2)
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build();
        await uow.start();
        await patientRepo.bulkInsert(patients);
        const result = await patientRepo.findByIds(patients.map((v) => v.patient_id));
        expect(result.length).toBe(2);
        await uow.commit();
      });
    });

    describe('existsById method', () => {
      it('should return true if the patient exists', async () => {
        const { category, genre } = await createRelations();
        const patient = Patient.fake()
          .aPatientWithAllMedias()
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build();
        await uow.start();
        await patientRepo.insert(patient);
        const existsResult = await patientRepo.existsById([patient.patient_id]);
        expect(existsResult.exists[0]).toBeValueObject(patient.patient_id);
        await uow.commit();
      });
    });

    describe('update method', () => {
      it('should update a patient', async () => {
        const { category, genre } = await createRelations();
        const patient = Patient.fake()
          .aPatientWithAllMedias()
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build();
        await patientRepo.insert(patient);
        await uow.start();
        patient.changeFullName('new Full Name');
        await patientRepo.update(patient);
        await uow.commit();
        const result = await patientRepo.findById(patient.patient_id);
        expect(result!.full_name).toBe(patient.full_name);
      });

      it('rollback the update', async () => {
        const { category, genre } = await createRelations();
        const patient = Patient.fake()
          .aPatientWithAllMedias()
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build();
        await patientRepo.insert(patient);
        await uow.start();
        patient.changeFullName('new Full Name');
        await patientRepo.update(patient);
        await uow.rollback();
        const notChangePatient = await patientRepo.findById(patient.patient_id);
        expect(notChangePatient!.full_name).not.toBe(patient.full_name);
      });
    });

    describe('delete method', () => {
      it('should delete a patient', async () => {
        const { category, genre } = await createRelations();
        const patient = Patient.fake()
          .aPatientWithAllMedias()
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build();
        await patientRepo.insert(patient);
        await uow.start();
        await patientRepo.delete(patient.patient_id);
        await uow.commit();
        await expect(patientRepo.findById(patient.patient_id)).resolves.toBeNull();
        await expect(PatientCategoryModel.count()).resolves.toBe(0);
        await expect(PatientGenreModel.count()).resolves.toBe(0);
        await expect(ImageMediaModel.count()).resolves.toBe(0);
      });

      it('rollback the deletion', async () => {
        const { category, genre } = await createRelations();
        const patient = Patient.fake()
          .aPatientWithAllMedias()
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build();
        await patientRepo.insert(patient);
        await uow.start();
        await patientRepo.delete(patient.patient_id);
        await uow.rollback();
        const result = await patientRepo.findById(patient.patient_id);
        expect(result!.patient_id).toBeValueObject(patient.patient_id);
        await expect(PatientCategoryModel.count()).resolves.toBe(1);
        await expect(PatientGenreModel.count()).resolves.toBe(1);
        await expect(ImageMediaModel.count()).resolves.toBe(3);
      });
    });

    describe('search method', () => {
      it('should return a list of genres', async () => {
        const { category, genre } = await createRelations();
        const genres = Patient.fake()
          .thePatientsWithAllMedias(2)
          .withFullName('Test Full Name')
          .addCategoryId(category.category_id)
          .addGenreId(genre.genre_id)
          .build();
        await uow.start();
        await patientRepo.bulkInsert(genres);
        const searchParams = PatientSearchParams.create({
          filter: { full_name: 'Test Full Name' },
        });
        const result = await patientRepo.search(searchParams);
        expect(result.items.length).toBe(2);
        expect(result.total).toBe(2);
        await uow.commit();
      });
    });
  });

  async function createRelations() {
    const category = Category.fake().aCategory().build();
    await categoryRepo.insert(category);
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(genre);
    return { category, genre };
  }
});
