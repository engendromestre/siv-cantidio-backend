import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CategoryModel } from '../../../../category/infra/db/sequelize/category.model';
import { GenreModel } from '../../../../genre/infra/db/sequelize/genre-model';
import { ImageMediaModel } from './image-media.model';

export type PatientModelProps = {
  patient_id: string;
  patient_id_siresp: string;
  patient_chart_number?: string | null;
  full_name: string;
<<<<<<< HEAD
  mother_full_name?: string;
  birthdate?: Date;
=======
  mother_full_name?: string | null;
  birthdate?: Date | null;
>>>>>>> fix-patient-sequelize
  is_opened: boolean;
  is_published: boolean;

  image_medias: ImageMediaModel[];

  categories_id: PatientCategoryModel[];
  categories?: CategoryModel[];
  genres_id: PatientGenreModel[];
  genres?: CategoryModel[];
  created_at: Date;
};

@Table({ tableName: 'patients', timestamps: false })
export class PatientModel extends Model<PatientModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare patient_id: string;

  @Column({ allowNull: false, type: DataType.STRING(5) })
  declare patient_id_siresp: string;

  @Column({ allowNull: true,  type: DataType.STRING(5) })
  declare patient_chart_number: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare full_name: string;

  @Column({ allowNull: true, type: DataType.STRING(255) })
  declare mother_full_name: string;

  @Column({ allowNull: true, type: DataType.DATE(6) })
  declare birthdate: Date;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare is_opened: boolean;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare is_published: boolean;

  @HasMany(() => ImageMediaModel, 'patient_id')
  declare image_medias: ImageMediaModel[];

  @HasMany(() => PatientCategoryModel, 'patient_id')
  declare categories_id: PatientCategoryModel[];

  @BelongsToMany(() => CategoryModel, () => PatientCategoryModel)
  declare categories: CategoryModel[];

  @HasMany(() => PatientGenreModel, 'patient_id')
  declare genres_id: PatientGenreModel[];

  @BelongsToMany(() => GenreModel, () => PatientGenreModel)
  declare genres: GenreModel[];

  @Column({ allowNull: false, type: DataType.DATE(6) })
  declare created_at: Date;
}

export type PatientCategoryModelProps = {
  patient_id: string;
  category_id: string;
};

@Table({ tableName: 'category_patient', timestamps: false })
export class PatientCategoryModel extends Model<PatientCategoryModelProps> {
  @PrimaryKey
  @ForeignKey(() => PatientModel)
  @Column({ type: DataType.UUID })
  declare patient_id: string;

  @PrimaryKey
  @ForeignKey(() => CategoryModel)
  @Column({ type: DataType.UUID })
  declare category_id: string;
}

export type PatientGenreModelProps = {
  patient_id: string;
  genre_id: string;
};

@Table({ tableName: 'genre_patient', timestamps: false })
export class PatientGenreModel extends Model<PatientGenreModelProps> {
  @PrimaryKey
  @ForeignKey(() => PatientModel)
  @Column({ type: DataType.UUID })
  declare patient_id: string;

  @PrimaryKey
  @ForeignKey(() => GenreModel)
  @Column({ type: DataType.UUID })
  declare genre_id: string;
}
