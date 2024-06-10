import { getModelToken } from '@nestjs/sequelize';
import { PatientInMemoryRepository } from '../../core/patient/infra/db/in-memory/patient-in-memory.repository';
import { IPatientRepository } from '../../core/patient/domain/patient.repository';
import { UnitOfWorkSequelize } from '../../core/shared/infra/db/sequelize/unit-of-work-sequelize';
import { IUnitOfWork } from '../../core/shared/domain/repository/unit-of-work.interface';
import { CATEGORY_PROVIDERS } from '../categories-module/categories.providers';
import { PatientSequelizeRepository } from '../../core/patient/infra/db/sequelize/patient-sequelize.repository';
import { PatientModel } from '../../core/patient/infra/db/sequelize/patient.model';
import { GENRES_PROVIDERS } from '../genres-module/genres.providers';
import { IGenreRepository } from '../../core/genre/domain/genre.repository';
import { ICategoryRepository } from '../../core/category/domain/category.repository';
import { ApplicationService } from '../../core/shared/application/application.service';
import { IStorage } from '../../core/shared/application/storage.interface';
import { CreatePatientUseCase } from '../../core/patient/application/use-cases/create-patient/create-patient.use-case';
import { CategoriesIdExistsInDatabaseValidator } from '../../core/category/application/validations/categories-ids-exists-in-database.validator';
import { GenresIdExistsInDatabaseValidator } from '../../core/genre/application/validations/genres-ids-exists-in-database.validator';
import { UpdatePatientUseCase } from '../../core/patient/application/use-cases/update-patient/update-patient.use-case';
import { GetPatientUseCase } from '../../core/patient/application/use-cases/get-patient/get-patient.use-case';
import { IMessageBroker } from '../../core/shared/application/message-broker.interface';

export const REPOSITORIES = {
  PATIENT_REPOSITORY: {
    provide: 'PatientRepository',
    useExisting: PatientSequelizeRepository,
  },
  PATIENT_IN_MEMORY_REPOSITORY: {
    provide: PatientInMemoryRepository,
    useClass: PatientInMemoryRepository,
  },
  PATIENT_SEQUELIZE_REPOSITORY: {
    provide: PatientSequelizeRepository,
    useFactory: (patientModel: typeof PatientModel, uow: UnitOfWorkSequelize) => {
      return new PatientSequelizeRepository(patientModel, uow);
    },
    inject: [getModelToken(PatientModel), 'UnitOfWork'],
  },
};

export const USE_CASES = {
  CREATE_PATIENT_USE_CASE: {
    provide: CreatePatientUseCase,
    useFactory: (
      uow: IUnitOfWork,
      patientRepo: IPatientRepository,
      categoriesIdValidator: CategoriesIdExistsInDatabaseValidator,
      genresIdValidator: GenresIdExistsInDatabaseValidator,
    ) => {
      return new CreatePatientUseCase(
        uow,
        patientRepo,
        categoriesIdValidator,
        genresIdValidator,
      );
    },
    inject: [
      'UnitOfWork',
      REPOSITORIES.PATIENT_REPOSITORY.provide,
      CATEGORY_PROVIDERS.VALIDATIONS.CATEGORIES_IDS_EXISTS_IN_DATABASE_VALIDATOR
        .provide,
      GENRES_PROVIDERS.VALIDATIONS.GENRES_IDS_EXISTS_IN_DATABASE_VALIDATOR
        .provide,
    ],
  },
  UPDATE_PATIENT_USE_CASE: {
    provide: UpdatePatientUseCase,
    useFactory: (
      uow: IUnitOfWork,
      patientRepo: IPatientRepository,
      categoriesIdValidator: CategoriesIdExistsInDatabaseValidator,
      genresIdValidator: GenresIdExistsInDatabaseValidator,
    ) => {
      return new UpdatePatientUseCase(
        uow,
        patientRepo,
        categoriesIdValidator,
        genresIdValidator,
      );
    },
    inject: [
      'UnitOfWork',
      REPOSITORIES.PATIENT_REPOSITORY.provide,
      CATEGORY_PROVIDERS.VALIDATIONS.CATEGORIES_IDS_EXISTS_IN_DATABASE_VALIDATOR
        .provide,
      GENRES_PROVIDERS.VALIDATIONS.GENRES_IDS_EXISTS_IN_DATABASE_VALIDATOR
        .provide,
    ],
  },
  GET_PATIENT_USE_CASE: {
    provide: GetPatientUseCase,
    useFactory: (
      patientRepo: IPatientRepository,
      categoryRepo: ICategoryRepository,
      genreRepo: IGenreRepository,
    ) => {
      return new GetPatientUseCase(
        patientRepo,
        categoryRepo,
        genreRepo,
      );
    },
    inject: [
      REPOSITORIES.PATIENT_REPOSITORY.provide,
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
    ],
  },
};

export const PATIENTS_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
