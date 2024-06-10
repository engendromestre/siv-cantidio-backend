import { ICategoryRepository } from '../../../../../category/domain/category.repository';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { IGenreRepository } from '../../../../../genre/domain/genre.repository';
import { GenreModel } from '../../../../../genre/infra/db/sequelize/genre-model';
import { GenreSequelizeRepository } from '../../../../../genre/infra/db/sequelize/genre-sequelize.repository';
import { IStorage } from '../../../../../shared/application/storage.interface';
import { UnitOfWorkSequelize } from '../../../../../shared/infra/db/sequelize/unit-of-work-sequelize';
//import { InMemoryStorage } from '../../../../../shared/infra/storage/in-memory.storage';
import { IPatientRepository } from '../../../../domain/patient.repository';
import { setupSequelizeForPatient } from '../../../../infra/db/sequelize/testing/helpers';
import { PatientSequelizeRepository } from '../../../../infra/db/sequelize/patient-sequelize.repository';
import { PatientModel } from '../../../../infra/db/sequelize/patient.model';
import { UploadImageMediasUseCase } from '../upload-image-medias.use-case';
import { Patient } from '../../../../domain/patient.aggregate';
import { Category } from '../../../../../category/domain/category.aggregate';
import { Genre } from '../../../../../genre/domain/genre.aggregate';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { Storage as GoogleCloudStorageSdk } from '@google-cloud/storage';
import { Config } from '../../../../../shared/infra/config';
import { GoogleCloudStorage } from '../../../../../shared/infra/storage/google-cloud.storage';

describe('UploadImageMediasUseCase Integration Tests', () => {
  let uploadImageMediasUseCase: UploadImageMediasUseCase;
  let patientRepo: IPatientRepository;
  let categoryRepo: ICategoryRepository;
  let genreRepo: IGenreRepository;;
  let uow: UnitOfWorkSequelize;
  let storageService: IStorage;
  const sequelizeHelper = setupSequelizeForPatient();

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    patientRepo = new PatientSequelizeRepository(PatientModel, uow);
    //storageService = new InMemoryStorage();
    const storageSdk = new GoogleCloudStorageSdk({
      credentials: Config.googleCredentials(),
    });
    storageService = new GoogleCloudStorage(storageSdk, Config.bucketName());

    uploadImageMediasUseCase = new UploadImageMediasUseCase(
      uow,
      patientRepo,
      storageService,
    );
  });

  it('should throw error when patient not found', async () => {
    await expect(
      uploadImageMediasUseCase.execute({
        patient_id: '4e9e2e4e-4b4a-4b4a-8b8b-8b8b8b8b8b8b',
        field: 'photo',
        file: {
          raw_name: 'photo.jpg',
          data: Buffer.from(''),
          mime_type: 'image/jpg',
          size: 100,
        },
      }),
    ).rejects.toThrowError(
      new NotFoundError('4e9e2e4e-4b4a-4b4a-8b8b-8b8b8b8b8b8b', Patient),
    );
  });

  it('should throw error when image is invalid', async () => {
    expect.assertions(2);
    const category = Category.fake().aCategory().build();
    await categoryRepo.insert(category);
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(genre);
    const patient = Patient.fake()
      .aPatientWithoutMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .build();

    await patientRepo.insert(patient);

    try {
      await uploadImageMediasUseCase.execute({
        patient_id: patient.patient_id.id,
        field: 'photo',
        file: {
          raw_name: 'photo.jpg',
          data: Buffer.from(''),
          mime_type: 'image/jpg',
          size: 100,
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(EntityValidationError);
      expect(error.error).toEqual([
        {
          photo: [
            'Invalid media file mime type: image/jpg not in image/jpeg, image/png, image/gif',
          ],
        },
      ]);
    }
  }, 10000);

  it('should upload photo image', async () => {
    const storeSpy = jest.spyOn(storageService, 'store');
    const category = Category.fake().aCategory().build();
    await categoryRepo.insert(category);
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    await genreRepo.insert(genre);
    const patient = Patient.fake()
      .aPatientWithoutMedias()
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .build();

    await patientRepo.insert(patient);

    await uploadImageMediasUseCase.execute({
      patient_id: patient.patient_id.id,
      field: 'photo',
      file: {
        raw_name: 'photo.jpg',
        data: Buffer.from('test data'),
        mime_type: 'image/jpeg',
        size: 100,
      },
    });

    const patientUpdated = await patientRepo.findById(patient.patient_id);
    expect(patientUpdated!.photo).toBeDefined();
    expect(patientUpdated!.photo!.name.includes('.jpg')).toBeTruthy();
    expect(patientUpdated!.photo!.location).toBe(
      `patients/${patientUpdated!.patient_id.id}/images`,
    );
    expect(storeSpy).toHaveBeenCalledWith({
      data: Buffer.from('test data'),
      id: patientUpdated!.photo!.url,
      mime_type: 'image/jpeg',
    });
  }, 10000);
});
