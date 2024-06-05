import { SequelizeOptions } from 'sequelize-typescript';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { ImageMediaModel } from '../image-media.model';
import {
  PatientCategoryModel,
  PatientGenreModel,
  PatientModel,
} from '../patient.model';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import {
  GenreCategoryModel,
  GenreModel,
} from '../../../../../genre/infra/db/sequelize/genre-model';

export function setupSequelizeForPatient(options: SequelizeOptions = {}) {
  return setupSequelize({
    models: [
      ImageMediaModel,
      PatientModel,
      PatientCategoryModel,
      CategoryModel,
      PatientGenreModel,
      GenreModel,
      GenreCategoryModel,
    ],
    ...options,
  });
}
