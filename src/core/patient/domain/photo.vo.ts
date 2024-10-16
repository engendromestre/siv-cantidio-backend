import { Either } from '../../shared/domain/either';
import { MediaFileValidator } from '../../shared/domain/validators/media-file.validator';
import { ImageMedia } from '../../shared/domain/value-objects/image-media.vo';
import { PatientId } from './patient.aggregate';

export class Photo extends ImageMedia {
  static max_size = 1024 * 1024 * 2; // 2MB
  static mime_types = ['image/jpeg', 'image/png', 'image/gif'];

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
      Photo.max_size,
      Photo.mime_types,
    );

    return Either.safe(() => {
      const { name: newName } = mediaFileValidator.validate({
        raw_name,
        mime_type,
        size,
      });
      return new Photo({
        name: newName,
        location: `patients/${patient_id.id}/images`,
      });
    });
  }
}
