import { IStorage } from '../../../../shared/application/storage.interface';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { IUnitOfWork } from '../../../../shared/domain/repository/unit-of-work.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Photo } from '../../../domain/photo.vo';
import { ThumbnailHalf } from '../../../domain/thumbnail-half.vo';
import { Thumbnail } from '../../../domain/thumbnail.vo';
import { Patient, PatientId } from '../../../domain/patient.aggregate';
import { IPatientRepository } from '../../../domain/patient.repository';
import { UploadImageMediasInput } from './upload-image-medias.input';

export class UploadImageMediasUseCase
  implements IUseCase<UploadImageMediasInput, UploadImageMediasOutput> {
  constructor(
    private uow: IUnitOfWork,
    private patientRepo: IPatientRepository,
    private storage: IStorage,
  ) { }

  async execute(
    input: UploadImageMediasInput,
  ): Promise<UploadImageMediasOutput> {
    const patientId = new PatientId(input.patient_id);
    const patient = await this.patientRepo.findById(patientId);

    if (!patient) {
      throw new NotFoundError(input.patient_id, Patient);
    }

    const imagesMap = {
      photo: Photo,
      thumbnail: Thumbnail,
      thumbnail_half: ThumbnailHalf,
    };

    const [image, errorImage] = imagesMap[input.field]
      .createFromFile({
        ...input.file,
        patient_id: patientId,
      })
      .asArray();

    if (errorImage) {
      throw new EntityValidationError([
        { [input.field]: [errorImage.message] },
      ]);
    }

    image instanceof Photo && patient.replacePhoto(image);
    image instanceof Thumbnail && patient.replaceThumbnail(image);
    image instanceof ThumbnailHalf && patient.replaceThumbnailHalf(image);

    await this.storage.store({
      data: input.file.data,
      mime_type: input.file.mime_type,
      id: image.url,
    });

    await this.uow.do(async () => {
      await this.patientRepo.update(patient);
    });
  }
}

export type UploadImageMediasOutput = void;
