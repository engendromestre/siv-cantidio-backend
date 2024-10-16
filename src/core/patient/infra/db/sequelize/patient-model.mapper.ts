import { Patient, PatientId } from '../../../domain/patient.aggregate';
import { LoadEntityError } from '../../../../shared/domain/validators/validation.error';
import { CategoryId } from '../../../../category/domain/category.aggregate';
import { Notification } from '../../../../shared/domain/validators/notification';
import { GenreId } from '../../../../genre/domain/genre.aggregate';
import {
  PatientCategoryModel,
  PatientGenreModel,
  PatientModel,
} from './patient.model';
import { ImageMediaModel, ImageMediaRelatedField } from './image-media.model';
import { Photo } from '../../../domain/photo.vo';
import { Thumbnail } from '../../../domain/thumbnail.vo';
import { ThumbnailHalf } from '../../../domain/thumbnail-half.vo';

export class PatientModelMapper {
  static toEntity(model: PatientModel) {
    const {
      patient_id: id,
      categories_id = [],
      genres_id = [],
      image_medias = [],
      ...otherData
    } = model.toJSON();

    const categoriesId = categories_id.map(
      (c) => new CategoryId(c.category_id),
    );
    const genresId = genres_id.map((c) => new GenreId(c.genre_id));

    const notification = new Notification();
    if (!categoriesId.length) {
      notification.addError(
        'categories_id should not be empty',
        'categories_id',
      );
    }

    if (!genresId.length) {
      notification.addError('genres_id should not be empty', 'genres_id');
    }

    const photoModel = image_medias.find(
      (i) => i.patient_related_field === 'photo',
    );
    const photo = photoModel
      ? new Photo({
        name: photoModel.name,
        location: photoModel.location,
      })
      : null;

    const thumbnailModel = image_medias.find(
      (i) => i.patient_related_field === 'thumbnail',
    );
    const thumbnail = thumbnailModel
      ? new Thumbnail({
        name: thumbnailModel.name,
        location: thumbnailModel.location,
      })
      : null;

    const thumbnailHalfModel = image_medias.find(
      (i) => i.patient_related_field === 'thumbnail_half',
    );

    const thumbnailHalf = thumbnailHalfModel
      ? new ThumbnailHalf({
        name: thumbnailHalfModel.name,
        location: thumbnailHalfModel.location,
      })
      : null;

    const patientEntity = new Patient({
      ...otherData,
      patient_id: new PatientId(id),
      photo,
      thumbnail,
      thumbnail_half: thumbnailHalf,
      categories_id: new Map(categoriesId.map((c) => [c.id, c])),
      genres_id: new Map(genresId.map((c) => [c.id, c])),
    });

    patientEntity.validate(['patient_id_siresp','full_name']);

    notification.copyErrors(patientEntity.notification);

    if (notification.hasErrors()) {
<<<<<<< HEAD
      console.log(notification.toJSON());
=======
>>>>>>> fix-patient-sequelize
      throw new LoadEntityError(notification.toJSON());
    }

    return patientEntity;
  }

  static toModelProps(entity: Patient) {
    const {
      photo,
      thumbnail,
      thumbnail_half,
      categories_id,
      genres_id,
      ...otherData
    } = entity.toJSON();
    return {
      ...otherData,
      image_medias: [
        {
          media: photo,
          patient_related_field: ImageMediaRelatedField.PHOTO,
        },
        {
          media: thumbnail,
          patient_related_field: ImageMediaRelatedField.THUMBNAIL,
        },
        {
          media: thumbnail_half,
          patient_related_field: ImageMediaRelatedField.THUMBNAIL_HALF,
        },
      ]
        .map((item) => {
          return item.media
            ? ImageMediaModel.build({
              patient_id: entity.patient_id.id,
              name: item.media.name,
              location: item.media.location,
              patient_related_field: item.patient_related_field as any,
            } as any)
            : null;
        })
        .filter(Boolean) as ImageMediaModel[],

      categories_id: categories_id.map((category_id) =>
        PatientCategoryModel.build({
          patient_id: entity.patient_id.id,
          category_id: category_id,
        }),
      ),
      genres_id: genres_id.map((category_id) =>
        PatientGenreModel.build({
          patient_id: entity.patient_id.id,
          genre_id: category_id,
        }),
      ),
    };
  }
}
