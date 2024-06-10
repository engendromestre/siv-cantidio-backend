import { CategoriesIdExistsInDatabaseValidator } from '../../../../category/application/validations/categories-ids-exists-in-database.validator';
import { GenresIdExistsInDatabaseValidator } from '../../../../genre/application/validations/genres-ids-exists-in-database.validator';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Patient } from '../../../domain/patient.aggregate';
import { IPatientRepository } from '../../../domain/patient.repository';
import { CreatePatientInput } from './create-patient.input';

export class CreatePatientUseCase
  implements IUseCase<CreatePatientInput, CreatePatientOutput> {
  constructor(
    private uow: IUnitOfWork,
    private patientRepo: IPatientRepository,
    private categoriesIdValidator: CategoriesIdExistsInDatabaseValidator,
    private genresIdValidator: GenresIdExistsInDatabaseValidator,
  ) { }

  async execute(input: CreatePatientInput): Promise<CreatePatientOutput> {
    const [eitherCategoriesId, eitherGenresId] =
      await Promise.all([
        await this.categoriesIdValidator.validate(input.categories_id),
        await this.genresIdValidator.validate(input.genres_id),
      ]);

    const [categoriesId, errorsCategoriesId] = eitherCategoriesId.asArray();
    const [genresId, errorsGenresId] = eitherGenresId.asArray();

    const patient = Patient.create({
      ...input,
      categories_id: errorsCategoriesId ? [] : categoriesId,
      genres_id: errorsGenresId ? [] : genresId,
    });

    const notification = patient.notification;

    if (errorsCategoriesId) {
      notification.setError(
        errorsCategoriesId.map((e) => e.message),
        'categories_id',
      );
    }

    if (errorsGenresId) {
      notification.setError(
        errorsGenresId.map((e) => e.message),
        'genres_id',
      );
    }

    if (notification.hasErrors()) {
      throw new EntityValidationError(notification.toJSON());
    }

    await this.uow.do(async () => {
      return this.patientRepo.insert(patient);
    });

    return { id: patient.patient_id.id };
  }
}

export type CreatePatientOutput = { id: string };
