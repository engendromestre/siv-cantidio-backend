<<<<<<< HEAD
=======
import { Type } from 'class-transformer';
>>>>>>> fix-patient-sequelize
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsArray,
  IsUUID,
<<<<<<< HEAD
  Min,
  Max,
  validateSync,
  IsDate,
  IsOptional,
=======
  validateSync,
  IsDate,
  IsOptional,
  MinLength,
  MaxLength,
>>>>>>> fix-patient-sequelize
} from 'class-validator';

export type CreatePatientInputConstructorProps = {
  patient_id_siresp: string;
  patient_chart_number: string;
  full_name: string;
  mother_full_name: string;
  birthdate: Date;
  is_opened: boolean;
  categories_id: string[];
  genres_id: string[];
  is_active?: boolean;
};

export class CreatePatientInput {
  @IsString()
  @IsNotEmpty()
<<<<<<< HEAD
  @Min(5)
  @Max(5)
=======
  @MinLength(5)
  @MaxLength(5)
>>>>>>> fix-patient-sequelize
  patient_id_siresp: string;

  @IsString()
  @IsOptional()
<<<<<<< HEAD
  @Min(5)
  @Max(5)
=======
  @MinLength(5)
  @MaxLength(5)
>>>>>>> fix-patient-sequelize
  patient_chart_number: string;

  @IsString()
  @IsNotEmpty()
<<<<<<< HEAD
  @Min(5)
  @Max(255)
=======
  @MinLength(5)
  @MaxLength(255)
>>>>>>> fix-patient-sequelize
  full_name: string;

  @IsString()
  @IsOptional()
<<<<<<< HEAD
  @Min(5)
  @Max(255)
  mother_full_name: string;

  @IsDate()
  @IsNotEmpty()
=======
  @MinLength(5)
  @MaxLength(255)
  mother_full_name: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
>>>>>>> fix-patient-sequelize
  birthdate: Date;

  @IsBoolean()
  @IsNotEmpty()
  is_opened: boolean;

  @IsUUID('4', { each: true })
  @IsArray()
  @IsNotEmpty()
  categories_id: string[];

  @IsUUID('4', { each: true })
  @IsArray()
  @IsNotEmpty()
  genres_id: string[];

  constructor(props?: CreatePatientInputConstructorProps) {
    if (!props) return;
    this.patient_id_siresp = props.patient_id_siresp;
    this.patient_chart_number = props.patient_chart_number;
    this.full_name = props.full_name;
    this.mother_full_name = props.mother_full_name;
    this.birthdate = props.birthdate;
    this.is_opened = props.is_opened;
    this.categories_id = props.categories_id;
    this.genres_id = props.genres_id;
  }
}

export class ValidateCreatePatientInput {
  static validate(input: CreatePatientInput) {
    return validateSync(input);
  }
}
