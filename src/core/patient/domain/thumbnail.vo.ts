import { Either } from '../../shared/domain/either';
import {
  InvalidMediaFileMimeTypeError,
  InvalidMediaFileSizeError,
  MediaFileValidator,
} from '../../shared/domain/validators/media-file.validator';
import { ImageMedia } from '../../shared/domain/value-objects/image-media.vo';
import { PatientId } from './patient.aggregate';

export class Thumbnail extends ImageMedia {
  static max_size = 1024 * 1024 * 2;
  static mime_types = ['image/jpeg', 'image/png'];

  static createFromFile({
    raw_name,
    mime_type,
    size,
    patient_id,
  }: {
    raw_name: string;
    mime_type: string;
    size: number;
    patient_id: PatientId;
  }) {
    const mediaFileValidator = new MediaFileValidator(
      Thumbnail.max_size,
      Thumbnail.mime_types,
    );
    return Either.safe<
      Thumbnail,
      InvalidMediaFileSizeError | InvalidMediaFileMimeTypeError
    >(() => {
      const { name } = mediaFileValidator.validate({
        raw_name,
        mime_type,
        size,
      });
      return new Thumbnail({
        name: `${patient_id.id}-${name}`,
<<<<<<< HEAD
        location: `videos/${patient_id.id}/images`,
=======
        location: `patients/${patient_id.id}/images`,
>>>>>>> fix-patient-sequelize
      });
    });
  }
}
