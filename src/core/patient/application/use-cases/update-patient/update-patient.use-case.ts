import { CategoriesIdExistsInDatabaseValidator } from '../../../../category/application/validations/categories-ids-exists-in-database.validator';
import { GenresIdExistsInDatabaseValidator } from '../../../../genre/application/validations/genres-ids-exists-in-database.validator';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Patient, PatientId } from '../../../domain/patient.aggregate';
import { IPatientRepository } from '../../../domain/patient.repository';
import { UpdatePatientInput } from './update-patient.input';

export class UpdatePatientUseCase
  implements IUseCase<UpdatePatientInput, UpdatePatientOutput> {
  constructor(
    private uow: IUnitOfWork,
    private patientRepo: IPatientRepository,
    private categoriesIdValidator: CategoriesIdExistsInDatabaseValidator,
    private genresIdValidator: GenresIdExistsInDatabaseValidator,
  ) { }

  async execute(input: UpdatePatientInput): Promise<UpdatePatientOutput> {
    const patientId = new PatientId(input.id);
    const patient = await this.patientRepo.findById(patientId);

    if (!patient) {
      throw new NotFoundError(input.id, Patient);
    }

    input.patient_id_siresp && patient.changePatienIdSiresp(input.patient_id_siresp);
    input.patient_chart_number && patient.changePatientChartNumber(input.patient_chart_number);
    input.full_name && patient.changeFullName(input.full_name);
    input.mother_full_name && patient.changeMotherFullName(input.mother_full_name);
    input.birthdate && patient.changeBirthdate(input.birthdate);

    if (input.is_opened === true) {
      patient.markAsOpened();
    }

    if (input.is_opened === false) {
      patient.markAsNotOpened();
    }

    const notification = patient.notification;

    if (input.categories_id) {
      const [categoriesId, errorsCategoriesId] = (
        await this.categoriesIdValidator.validate(input.categories_id)
      ).asArray();

      categoriesId && patient.syncCategoriesId(categoriesId);

      errorsCategoriesId &&
        notification.setError(
          errorsCategoriesId.map((e) => e.message),
          'categories_id',
        );
    }

    if (input.genres_id) {
      const [genresId, errorsGenresId] = (
        await this.genresIdValidator.validate(input.genres_id)
      ).asArray();

      genresId && patient.syncGenresId(genresId);

      errorsGenresId &&
        notification.setError(
          errorsGenresId.map((e) => e.message),
          'genres_id',
        );
    }

    if (patient.notification.hasErrors()) {
      throw new EntityValidationError(patient.notification.toJSON());
    }

    await this.uow.do(async () => {
      return this.patientRepo.update(patient);
    });

    return { id: patient.patient_id.id };
  }
}

export type UpdatePatientOutput = { id: string };
