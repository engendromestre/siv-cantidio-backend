import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { PatientModel } from './patient.model';

export enum ImageMediaRelatedField {
  PHOTO = 'photo',
  THUMBNAIL = 'thumbnail',
  THUMBNAIL_HALF = 'thumbnail_half',
}

export type ImageMediaModelProps = {
  image_media_id: string;
  name: string;
  location: string;
  patient_id: string;
  patient_related_field: ImageMediaRelatedField;
};

@Table({
  tableName: 'image_medias',
  timestamps: false,
  indexes: [{ fields: ['patient_id', 'patient_related_field'], unique: true }],
})
export class ImageMediaModel extends Model<ImageMediaModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: () => new Uuid().id })
  declare image_media_id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare location: string;

  @ForeignKey(() => PatientModel)
  @Column({ allowNull: false, type: DataType.UUID })
  declare patient_id: string;

  @Column({ allowNull: false, type: DataType.STRING(20) })
  declare patient_related_field: ImageMediaRelatedField;
}
