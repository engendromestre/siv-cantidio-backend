import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsUUID,
  validateSync,
  IsDate,
  MinLength,
  MaxLength,
} from 'class-validator';

export type UpdatePatientInputConstructorProps = {
  id: string;
  patient_id_siresp?: string;
  patient_chart_number?: string;
  full_name?: string;
  mother_full_name?: string;
  birthdate?: Date;
  is_opened?: boolean;
  categories_id?: string[];
  genres_id?: string[];
};

export class UpdatePatientInput {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(5)
  patient_id_siresp: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(5)
  patient_chart_number: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  full_name: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(255)
  mother_full_name: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  birthdate: Date;

  @IsBoolean()
  @IsOptional()
  is_opened: boolean;

  @IsUUID('4', { each: true })
  @IsArray()
  @IsOptional()
  categories_id?: string[];

  @IsUUID('4', { each: true })
  @IsArray()
  @IsOptional()
  genres_id?: string[];

  constructor(props?: UpdatePatientInputConstructorProps) {
    if (!props) return;
    this.id = props.id;
    props.patient_id_siresp && (this.patient_id_siresp = props.patient_id_siresp);
    props.patient_chart_number && (this.patient_chart_number = props.patient_chart_number);
    props.full_name && (this.full_name = props.full_name);
    props.mother_full_name && (this.mother_full_name = props.mother_full_name);
    props.birthdate && (this.birthdate = props.birthdate);
    props.is_opened !== null &&
      props.is_opened !== undefined &&
      (this.is_opened = props.is_opened);
    props.categories_id &&
      props.categories_id.length > 0 &&
      (this.categories_id = props.categories_id);
    props.genres_id &&
      props.genres_id.length > 0 &&
      (this.genres_id = props.genres_id);
  }
}

export class ValidateUpdatePatientInput {
  static validate(input: UpdatePatientInput) {
    return validateSync(input);
  }
}
