import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesModule } from '../categories-module/categories.module';
import { PATIENTS_PROVIDERS } from './patients.providers';
import {
  PatientCategoryModel,
  PatientGenreModel,
  PatientModel,
} from '../../core/patient/infra/db/sequelize/patient.model';
import { ImageMediaModel } from '../../core/patient/infra/db/sequelize/image-media.model';
import { GenresModule } from '../genres-module/genres.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PatientModel,
      PatientCategoryModel,
      PatientGenreModel,
      ImageMediaModel,
    ]),
    CategoriesModule,
    GenresModule,
  ],
  controllers: [PatientsController],
  providers: [
    ...Object.values(PATIENTS_PROVIDERS.REPOSITORIES),
    ...Object.values(PATIENTS_PROVIDERS.USE_CASES),
  ],
})
<<<<<<< HEAD
export class VideosModule { }
=======
export class PatientsModule { }
>>>>>>> fix-patient-sequelize
