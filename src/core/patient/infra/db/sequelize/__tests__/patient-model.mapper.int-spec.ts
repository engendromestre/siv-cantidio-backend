import { Category } from '../../../../../category/domain/category.aggregate';
import { ICategoryRepository } from '../../../../../category/domain/category.repository';
import { CategorySequelizeRepository } from '../../../../../category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../category/infra/db/sequelize/category.model';
import { Genre } from '../../../../../genre/domain/genre.aggregate';
import { IGenreRepository } from '../../../../../genre/domain/genre.repository';
import { GenreModel } from '../../../../../genre/infra/db/sequelize/genre-model';
import { GenreSequelizeRepository } from '../../../../../genre/infra/db/sequelize/genre-sequelize.repository';
import { LoadEntityError } from '../../../../../shared/domain/validators/validation.error';
<<<<<<< HEAD
import { AudioVideoMediaStatus } from '../../../../../shared/domain/value-objects/audio-video-media.vo';
=======
>>>>>>> fix-patient-sequelize
import { UnitOfWorkFakeInMemory } from '../../../../../shared/infra/db/in-memory/fake-unit-of-work-in-memory';
import { Photo } from '../../../../domain/photo.vo';
import { ThumbnailHalf } from '../../../../domain/thumbnail-half.vo';
import { Thumbnail } from '../../../../domain/thumbnail.vo';
import { Patient, PatientId } from '../../../../domain/patient.aggregate';
import { ImageMediaModel, ImageMediaRelatedField } from '../image-media.model';
import { setupSequelizeForPatient } from '../testing/helpers';
import { PatientModelMapper } from '../patient-model.mapper';
import {
  PatientCategoryModel,
  PatientGenreModel,
  PatientModel,
} from '../patient.model';

describe('PatientModelMapper Unit Tests', () => {
  let categoryRepo: ICategoryRepository;
  let genreRepo: IGenreRepository;
  setupSequelizeForPatient();

  beforeEach(() => {
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    genreRepo = new GenreSequelizeRepository(
      GenreModel,
      new UnitOfWorkFakeInMemory() as any,
    );
  });

  it('should throws error when patient is invalid', () => {
    const arrange = [
      {
        makeModel: () => {
          return PatientModel.build({
            patient_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
            patient_id_siresp: '6'.repeat(256),
            full_name: 't'.repeat(256),
            categories_id: [],
            genres_id: [],
          } as any);
        },
        expectedErrors: [
          {
            categories_id: ['categories_id should not be empty'],
          },
          {
            genres_id: ['genres_id should not be empty'],
          },
          {
            patient_id_siresp: ['patient_id_siresp must be shorter than or equal to 5 characters'],
          },
          {
            full_name: ['full_name must be shorter than or equal to 255 characters'],
          },
        ],
      },
    ];

    for (const item of arrange) {
      try {
        PatientModelMapper.toEntity(item.makeModel());
        fail('The genre is valid, but it needs throws a LoadEntityError');
      } catch (e) {
        expect(e).toBeInstanceOf(LoadEntityError);
        expect(e.error).toMatchObject(item.expectedErrors);
      }
    }
  });

  it('should convert a patient model to a patient entity', async () => {
    const category1 = Category.fake().aCategory().build();
    await categoryRepo.bulkInsert([category1]);
    const genre1 = Genre.fake()
      .aGenre()
      .addCategoryId(category1.category_id)
      .build();
    await genreRepo.bulkInsert([genre1]);

    const patientProps = {
      patient_id: new PatientId().id,
      patient_id_siresp: '12345',
      full_name: 'Test Full Name',
      is_opened: false,
      is_published: false,
      created_at: new Date(),
    };

    let model = await PatientModel.create(
      {
        ...patientProps,
        categories_id: [
          PatientCategoryModel.build({
            patient_id: patientProps.patient_id,
            category_id: category1.category_id.id,
          }),
        ],
        genres_id: [
          PatientGenreModel.build({
            patient_id: patientProps.patient_id,
            genre_id: genre1.genre_id.id,
          }),
        ],
      } as any,
      { include: ['categories_id', 'genres_id'] },
    );
<<<<<<< HEAD
    let entity = PatientModelMapper.toEntity(model);
=======

    let entity = PatientModelMapper.toEntity(model);
    
>>>>>>> fix-patient-sequelize
    expect(entity.toJSON()).toEqual(
      new Patient({
        patient_id: new PatientId(model.patient_id),
        patient_id_siresp: patientProps.patient_id_siresp,
        full_name: patientProps.full_name,
        is_opened: patientProps.is_opened,
        is_published: patientProps.is_published,
        created_at: patientProps.created_at,
        categories_id: new Map([
          [category1.category_id.id, category1.category_id],
        ]),
        genres_id: new Map([[genre1.genre_id.id, genre1.genre_id]]),
<<<<<<< HEAD
      }).toJSON(),
    );

    patientProps.patient_id = new PatientId().id;
=======
      }).toJSON()
    );

    patientProps.patient_id = new PatientId().id;

>>>>>>> fix-patient-sequelize
    model = await PatientModel.create(
      {
        ...patientProps,
        image_medias: [
          ImageMediaModel.build({
            patient_id: patientProps.patient_id,
            location: 'location photo',
            name: 'name photo',
            patient_related_field: ImageMediaRelatedField.PHOTO,
          } as any),
          ImageMediaModel.build({
            patient_id: patientProps.patient_id,
            location: 'location thumbnail',
            name: 'name thumbnail',
            patient_related_field: ImageMediaRelatedField.THUMBNAIL,
          } as any),
          ImageMediaModel.build({
            patient_id: patientProps.patient_id,
            location: 'location thumbnail half',
            name: 'name thumbnail half',
            patient_related_field: ImageMediaRelatedField.THUMBNAIL_HALF,
          } as any),
        ],
        categories_id: [
          PatientCategoryModel.build({
            patient_id: patientProps.patient_id,
            category_id: category1.category_id.id,
          }),
        ],
        genres_id: [
          PatientGenreModel.build({
            patient_id: patientProps.patient_id,
            genre_id: genre1.genre_id.id,
          }),
        ],
      },
      {
        include: [
          'categories_id',
          'genres_id',
          'image_medias',
        ],
      },
    );
<<<<<<< HEAD

=======
>>>>>>> fix-patient-sequelize
    entity = PatientModelMapper.toEntity(model);
    expect(entity.toJSON()).toEqual(
      new Patient({
        patient_id: new PatientId(model.patient_id),
        patient_id_siresp: patientProps.patient_id_siresp,
        full_name: patientProps.full_name,
        is_opened: patientProps.is_opened,
        is_published: patientProps.is_published,
        created_at: patientProps.created_at,
        photo: new Photo({
          location: 'location photo',
          name: 'name photo',
        }),
        thumbnail: new Thumbnail({
          location: 'location thumbnail',
          name: 'name thumbnail',
        }),
        thumbnail_half: new ThumbnailHalf({
          location: 'location thumbnail half',
          name: 'name thumbnail half',
        }),
        categories_id: new Map([
          [category1.category_id.id, category1.category_id],
        ]),
        genres_id: new Map([[genre1.genre_id.id, genre1.genre_id]]),
      }).toJSON(),
    );
  });

  it('should convert a patient entity to a patient model', async () => {
    const category1 = Category.fake().aCategory().build();
    await categoryRepo.bulkInsert([category1]);
    const genre1 = Genre.fake()
      .aGenre()
      .addCategoryId(category1.category_id)
      .build();
    await genreRepo.bulkInsert([genre1]);

    const patientProps = {
      patient_id: new PatientId(),
      patient_id_siresp: '12345',
      patient_chart_number: null,
      full_name: 'Test Full Name',
      mother_full_name: null,
      birthdate: null,
      is_opened: false,
      is_published: false,
      created_at: new Date(),
    };

    let entity = new Patient({
      ...patientProps,
      categories_id: new Map([
        [category1.category_id.id, category1.category_id],
      ]),
      genres_id: new Map([[genre1.genre_id.id, genre1.genre_id]]),
    });

    const model = PatientModelMapper.toModelProps(entity);
    expect(model).toEqual({
      patient_id: patientProps.patient_id.id,
      patient_id_siresp: patientProps.patient_id_siresp,
      patient_chart_number: patientProps.patient_chart_number,
      full_name: patientProps.full_name,
      mother_full_name: patientProps.mother_full_name,
      birthdate: patientProps.birthdate,
      is_opened: patientProps.is_opened,
      is_published: patientProps.is_published,
      created_at: patientProps.created_at,
      image_medias: [],
      categories_id: [
        PatientCategoryModel.build({
          patient_id: patientProps.patient_id.id,
          category_id: category1.category_id.id,
        }),
      ],
      genres_id: [
        PatientGenreModel.build({
          patient_id: patientProps.patient_id.id,
          genre_id: genre1.genre_id.id,
        }),
      ],
    });

    entity = new Patient({
      ...patientProps,
      photo: new Photo({
        location: 'location photo',
        name: 'name photo',
      }),
      thumbnail: new Thumbnail({
        location: 'location thumbnail',
        name: 'name thumbnail',
      }),
      thumbnail_half: new ThumbnailHalf({
        location: 'location thumbnail half',
        name: 'name thumbnail half',
      }),
      categories_id: new Map([
        [category1.category_id.id, category1.category_id],
      ]),
      genres_id: new Map([[genre1.genre_id.id, genre1.genre_id]]),
    });

    const model2 = PatientModelMapper.toModelProps(entity);
    expect(model2.patient_id).toEqual(patientProps.patient_id.id);
    expect(model2.patient_id_siresp).toEqual(patientProps.patient_id_siresp);
    expect(model2.full_name).toEqual(patientProps.full_name);
    expect(model2.is_opened).toEqual(patientProps.is_opened);
    expect(model2.is_published).toEqual(patientProps.is_published);
    expect(model2.created_at).toEqual(patientProps.created_at);
    expect(model2.image_medias[0]!.toJSON()).toEqual({
      image_media_id: model2.image_medias[0]!.image_media_id,
      patient_id: patientProps.patient_id.id,
      location: 'location photo',
      name: 'name photo',
      patient_related_field: ImageMediaRelatedField.PHOTO,
    });
    expect(model2.image_medias[1]!.toJSON()).toEqual({
      image_media_id: model2.image_medias[1]!.image_media_id,
      patient_id: patientProps.patient_id.id,
      location: 'location thumbnail',
      name: 'name thumbnail',
      patient_related_field: ImageMediaRelatedField.THUMBNAIL,
    });
    expect(model2.image_medias[2]!.toJSON()).toEqual({
      image_media_id: model2.image_medias[2]!.image_media_id,
      patient_id: patientProps.patient_id.id,
      location: 'location thumbnail half',
      name: 'name thumbnail half',
      patient_related_field: ImageMediaRelatedField.THUMBNAIL_HALF,
    });
    expect(model2.categories_id[0].toJSON()).toEqual({
      patient_id: patientProps.patient_id.id,
      category_id: category1.category_id.id,
    });
    expect(model2.genres_id[0].toJSON()).toEqual({
      patient_id: patientProps.patient_id.id,
      genre_id: genre1.genre_id.id,
    });
  });
});
