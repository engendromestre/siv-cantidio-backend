import { OmitType } from '@nestjs/mapped-types';
import { UpdatePatientInput } from '../../../core/patient/application/use-cases/update-patient/update-patient.input';

export class UpdatePatientInputWithoutId extends OmitType(UpdatePatientInput, [
  'id',
] as any) { }

export class UpdatePatientDto extends UpdatePatientInputWithoutId { }
