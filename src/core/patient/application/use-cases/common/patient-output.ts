import { Category } from '../../../../category/domain/category.aggregate';
import { Genre } from '../../../../genre/domain/genre.aggregate';
import { Patient } from '../../../domain/patient.aggregate';

export type PatientCategoryOutput = {
  id: string;
  name: string;
  created_at: Date;
};

export type PatientGenreOutput = {
  id: string;
  name: string;
  is_active: boolean;
  categories_id: string[];
  categories: { id: string; name: string; created_at: Date }[];
  created_at: Date;
};

export type PatientOutput = {
  id: string;
  patient_id_siresp: string;
  patient_chart_number?: string | null;
  full_name: string;
  mother_full_name?: string | null;
  birthdate?: Date | null;
  is_opened: boolean;
  is_published: boolean;
  categories_id: string[];
  categories: PatientCategoryOutput[];
  genres_id: string[];
  genres: PatientGenreOutput[];
  created_at: Date;
};

export type PatientOutputParams = {
  patient: Patient;
  allCategoriesOfPatientAndGenre: Category[];
  genres: Genre[];
};

export class PatientOutputMapper {
  static toOutput({
    patient,
    allCategoriesOfPatientAndGenre,
    genres,
  }: PatientOutputParams): PatientOutput {
    return {
      id: patient.patient_id.id,
      patient_id_siresp: patient.patient_id_siresp,
      patient_chart_number: patient.patient_chart_number,
      full_name: patient.full_name,
      mother_full_name: patient.mother_full_name,
      birthdate: patient.birthdate,
      is_opened: patient.is_opened,
      is_published: patient.is_published,
      categories_id: Array.from(patient.categories_id.values()).map((c) => c.id),
      categories: allCategoriesOfPatientAndGenre
        .filter((c) => patient.categories_id.has(c.category_id.id))
        .map((c) => ({
          id: c.category_id.id,
          name: c.name,
          created_at: c.created_at,
        })),
      genres_id: Array.from(patient.genres_id.values()).map((g) => g.id),
      genres: PatientOutputMapper.toGenrePatientOutput(
        patient,
        genres,
        allCategoriesOfPatientAndGenre,
      ),
      created_at: patient.created_at,
    };
  }

  private static toGenrePatientOutput(
    patient: Patient,
    genres: Genre[],
    categories: Category[],
  ) {
    return genres
      .filter((g) => patient.genres_id.has(g.genre_id.id))
      .map((g) => ({
        id: g.genre_id.id,
        name: g.name,
        is_active: g.is_active,
        categories_id: Array.from(g.categories_id.values()).map((c) => c.id),
        categories: categories
          .filter((c) => g.categories_id.has(c.category_id.id))
          .map((c) => ({
            id: c.category_id.id,
            name: c.name,
            created_at: c.created_at,
          })),
        created_at: g.created_at,
      }));
  }
}
