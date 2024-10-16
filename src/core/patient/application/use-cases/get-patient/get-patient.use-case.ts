import { ICategoryRepository } from '../../../../category/domain/category.repository';
import { IGenreRepository } from '../../../../genre/domain/genre.repository';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Patient, PatientId } from '../../../domain/patient.aggregate';
import { IPatientRepository } from '../../../domain/patient.repository';
import { PatientOutput, PatientOutputMapper } from '../common/patient-output';

export class GetPatientUseCase
  implements IUseCase<GetPatientInput, GetPatientOutput> {
  constructor(
<<<<<<< HEAD
    private videoRepo: IPatientRepository,
=======
    private patientRepo: IPatientRepository,
>>>>>>> fix-patient-sequelize
    private categoryRepo: ICategoryRepository,
    private genreRepo: IGenreRepository,
  ) { }

  async execute(input: GetPatientInput): Promise<GetPatientOutput> {
    const patientId = new PatientId(input.id);
<<<<<<< HEAD
    const patient = await this.videoRepo.findById(patientId);
=======
    const patient = await this.patientRepo.findById(patientId);
>>>>>>> fix-patient-sequelize
    if (!patient) {
      throw new NotFoundError(input.id, Patient);
    }
    const genres = await this.genreRepo.findByIds(
      Array.from(patient.genres_id.values()),
    );

    const categories = await this.categoryRepo.findByIds(
      Array.from(patient.categories_id.values()).concat(
        genres.flatMap((g) => Array.from(g.categories_id.values())),
      ),
    );
    return PatientOutputMapper.toOutput({
      patient,
      genres,
      allCategoriesOfPatientAndGenre: categories,
    });
  }
}

export type GetPatientInput = {
  id: string;
};

export type GetPatientOutput = PatientOutput;
