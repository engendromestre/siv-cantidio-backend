import { Category } from '../../../../category/domain/category.aggregate';
import { Genre } from '../../../../genre/domain/genre.aggregate';
import { Patient } from '../../../domain/patient.aggregate';
import { PatientOutputMapper } from './patient-output';

describe('PatientOutputMapper Unit Tests', () => {
  describe('genreToOutput method', () => {
    it('should return an empty array if no genres match', () => {
      const patient = Patient.fake().aPatientWithAllMedias().build();
      const output = PatientOutputMapper['toGenrePatientOutput'](patient, [], []);
      expect(output).toEqual([]);
    });

    it('should return an array of genres that match the patient', () => {
      const categories = Category.fake().theCategories(2).build();
      const genres = Genre.fake().theGenres(2).build();
      genres[0].syncCategoriesId([categories[0].category_id]);
      genres[1].syncCategoriesId([categories[1].category_id]);
      const patient = Patient.fake()
        .aPatientWithAllMedias()
        .addGenreId(genres[0].genre_id)
        .addGenreId(genres[1].genre_id)
        .build();
      const output = PatientOutputMapper['toGenrePatientOutput'](
        patient,
        genres,
        categories,
      );
      expect(output).toEqual([
        {
          id: genres[0].genre_id.id,
          name: genres[0].name,
          is_active: genres[0].is_active,
          categories_id: [categories[0].category_id.id],
          categories: [
            {
              id: categories[0].category_id.id,
              name: categories[0].name,
              created_at: categories[0].created_at,
            },
          ],
          created_at: genres[0].created_at,
        },
        {
          id: genres[1].genre_id.id,
          name: genres[1].name,
          is_active: genres[1].is_active,
          categories_id: [categories[1].category_id.id],
          categories: [
            {
              id: categories[1].category_id.id,
              name: categories[1].name,
              created_at: categories[1].created_at,
            },
          ],
          created_at: genres[1].created_at,
        },
      ]);
    });
  });
  it('should convert a patient in output', () => {
    const categories = Category.fake().theCategories(2).build();
    const genres = Genre.fake().theGenres(2).build();
    genres[0].syncCategoriesId([categories[0].category_id]);
    genres[1].syncCategoriesId([categories[1].category_id]);

    const entity = Patient.fake()
      .aPatientWithAllMedias()
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .addGenreId(genres[0].genre_id)
      .addGenreId(genres[1].genre_id)
      .build();
    const output = PatientOutputMapper.toOutput({
      patient: entity,
      genres,
      allCategoriesOfPatientAndGenre: categories,
    });
    expect(output).toEqual({
      id: entity.patient_id.id,
      patient_id_siresp: entity.patient_id_siresp,
      patient_chart_number: entity.patient_chart_number,
      full_name: entity.full_name,
      mother_full_name: entity.mother_full_name,
      birthdate: entity.birthdate,
      is_opened: entity.is_opened,
      is_published: entity.is_published,
      categories_id: [
        categories[0].category_id.id,
        categories[1].category_id.id,
      ],
      categories: [
        {
          id: categories[0].category_id.id,
          name: categories[0].name,
          created_at: categories[0].created_at,
        },
        {
          id: categories[1].category_id.id,
          name: categories[1].name,
          created_at: categories[1].created_at,
        },
      ],
      genres_id: [genres[0].genre_id.id, genres[1].genre_id.id],
      genres: [
        {
          id: genres[0].genre_id.id,
          name: genres[0].name,
          is_active: genres[0].is_active,
          categories_id: [categories[0].category_id.id],
          categories: [
            {
              id: categories[0].category_id.id,
              name: categories[0].name,
              created_at: categories[0].created_at,
            },
          ],
          created_at: genres[0].created_at,
        },
        {
          id: genres[1].genre_id.id,
          name: genres[1].name,
          is_active: genres[1].is_active,
          categories_id: [categories[1].category_id.id],
          categories: [
            {
              id: categories[1].category_id.id,
              name: categories[1].name,
              created_at: categories[1].created_at,
            },
          ],
          created_at: genres[1].created_at,
        },
      ],
      created_at: entity.created_at,
    });
  });
});
