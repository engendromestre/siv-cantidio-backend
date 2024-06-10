import {
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { FileMediaInput } from '../common/file-media.input';

export type UploadImageMediasInputConstructorProps = {
  patient_id: string;
  field: string; //photo, thumbnail, thumbnail_half
  file: FileMediaInput;
};

export class UploadImageMediasInput {
  //@IsUUID('4', { each: true })
  @IsString()
  @IsNotEmpty()
  patient_id: string;

  @IsIn(['photo', 'thumbnail', 'thumbnail_half'])
  @IsNotEmpty()
  field: 'photo' | 'thumbnail' | 'thumbnail_half'; //banner, thumbnail, thumbnail_half

  @ValidateNested()
  file: FileMediaInput;

  constructor(props: UploadImageMediasInput) {
    if (!props) return;

    this.patient_id = props.patient_id;
    this.field = props.field;
    this.file = props.file;
  }
}

export class ValidateUploadImageMediasInput {
  static validate(input: UploadImageMediasInput) {
    return validateSync(input);
  }
}
