import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { CategoryId } from '../../category/domain/category.aggregate';
import { AggregateRoot } from '../../shared/domain/aggregate-root';
import { GenreId } from '../../genre/domain/genre.aggregate';
import { Photo } from './photo.vo';
import PatientValidatorFactory from './patient.validator';
import { ThumbnailHalf } from './thumbnail-half.vo';
import { Thumbnail } from './thumbnail.vo';
import { PatientFakeBuilder } from './patient-fake.builder';

export type PatientConstructorProps = {
  patient_id?: PatientId;
  patient_id_siresp: string;
  patient_chart_number?: string | null;
  full_name: string;
  mother_full_name?: string | null;
  birthdate?: Date | null;
  is_opened: boolean;
  is_published: boolean;

  photo?: Photo | null;
  thumbnail?: Thumbnail | null;
  thumbnail_half?: ThumbnailHalf | null;

  categories_id: Map<string, CategoryId>;
  genres_id: Map<string, GenreId>;
  created_at?: Date;
};

export type PatientCreateCommand = {
  patient_id_siresp: string;
  patient_chart_number?: string;
  full_name: string;
  mother_full_name?: string;
  birthdate?: Date;
  is_opened: boolean;

  photo?: Photo;
  thumbnail?: Thumbnail;
  thumbnail_half?: ThumbnailHalf;

  categories_id: CategoryId[];
  genres_id: GenreId[];
};

export class PatientId extends Uuid { }

export class Patient extends AggregateRoot {
  patient_id: PatientId;
  patient_id_siresp: string;
  patient_chart_number: string | null;
  full_name: string;
  mother_full_name: string | null;
  birthdate: Date | null;
  is_opened: boolean;
  is_published: boolean; //uploads

  photo: Photo | null;
  thumbnail: Thumbnail | null;
  thumbnail_half: ThumbnailHalf | null;

  categories_id: Map<string, CategoryId>;
  genres_id: Map<string, GenreId>;

  created_at: Date;

  
  constructor(props: PatientConstructorProps) {
    super();
    this.patient_id = props.patient_id ?? new PatientId();
    this.patient_id_siresp = props.patient_id_siresp;
    this.patient_chart_number = props.patient_chart_number ?? null;
    this.full_name = props.full_name;
    this.mother_full_name = props.mother_full_name ?? null;
    this.birthdate = props.birthdate ?? null;
    this.is_opened = props.is_opened;
    this.is_published = props.is_published;

    this.photo = props.photo ?? null;
    this.thumbnail = props.thumbnail ?? null;
    this.thumbnail_half = props.thumbnail_half ?? null;

    this.categories_id = props.categories_id;
    this.genres_id = props.genres_id;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: PatientCreateCommand) {
    const patient = new Patient({
      ...props,
      categories_id: new Map(props.categories_id.map((id) => [id.id, id])),
      genres_id: new Map(props.genres_id.map((id) => [id.id, id])),
      is_published: false,
    });
    patient.validate(['patient_id_siresp']);
    return patient;
  }

  changePatienIdSiresp(patient_id_siresp: string): void {
    this.patient_id_siresp = patient_id_siresp;
    this.validate(['patient_id_siresp']);
  }

  changePatientChartNumber(patient_chart_number: string): void {
    this.patient_chart_number = patient_chart_number;
  }

  changeFullName(full_name: string): void {
    this.full_name = full_name;
    this.validate(['full_name']);
  }

  changeMotherFullName(mother_full_name: string): void {
    this.mother_full_name = mother_full_name;
  }

  changeBirthdate(birthdate: Date): void {
    this.birthdate = birthdate;
  }

  markAsOpened(): void {
    this.is_opened = true;
  }

  markAsNotOpened(): void {
    this.is_opened = false;
  }

  replacePhoto(photo: Photo): void {
    this.photo = photo;
  }

  replaceThumbnail(thumbnail: Thumbnail): void {
    this.thumbnail = thumbnail;
  }

  replaceThumbnailHalf(thumbnailHalf: ThumbnailHalf): void {
    this.thumbnail_half = thumbnailHalf;
  }

  addCategoryId(categoryId: CategoryId): void {
    this.categories_id.set(categoryId.id, categoryId);
  }

  removeCategoryId(categoryId: CategoryId): void {
    this.categories_id.delete(categoryId.id);
  }

  syncCategoriesId(categoriesId: CategoryId[]): void {
    if (!categoriesId.length) {
      throw new Error('Categories id is empty');
    }

    this.categories_id = new Map(categoriesId.map((id) => [id.id, id]));
  }

  addGenreId(genreId: GenreId): void {
    this.genres_id.set(genreId.id, genreId);
  }

  removeGenreId(genreId: GenreId): void {
    this.genres_id.delete(genreId.id);
  }

  syncGenresId(genresId: GenreId[]): void {
    if (!genresId.length) {
      throw new Error('Genres id is empty');
    }
    this.genres_id = new Map(genresId.map((id) => [id.id, id]));
  }

  // check
  validate(fields?: string[]) {
    const validator = PatientValidatorFactory.create();
    
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return PatientFakeBuilder;
  }

  get entity_id() {
    return this.patient_id;
  }

  toJSON() {
    return {
      patient_id: this.patient_id.id,
      patient_id_siresp: this.patient_id_siresp,
      patient_chart_number: this.patient_chart_number,
      full_name: this.full_name,
      mother_full_name: this.mother_full_name,
      birthdate: this.birthdate,
      is_opened: this.is_opened,
      is_published: this.is_published,
      photo: this.photo ? this.photo.toJSON() : null,
      thumbnail: this.thumbnail ? this.thumbnail.toJSON() : null,
      thumbnail_half: this.thumbnail_half ? this.thumbnail_half.toJSON() : null,
      categories_id: Array.from(this.categories_id.values()).map((id) => id.id),
      genres_id: Array.from(this.genres_id.values()).map((id) => id.id),
      created_at: this.created_at,
    };
  }
}
