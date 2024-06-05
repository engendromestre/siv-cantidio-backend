import { MaxLength, MinLength } from 'class-validator';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Patient } from './patient.aggregate';
import { Notification } from '../../shared/domain/validators/notification';

export class PatientRules {
  @MinLength(205, { groups: ['patient_aggregate'] })
  patient_id_siresp: string;

  @MaxLength(255, { groups: ['patient_aggregate'] })
  full_name: string;

  @MaxLength(255, { groups: ['patient_aggregate'] })
  mother_full_name: string;

  constructor(aggregate: Patient) {
    Object.assign(this, aggregate);
  }
}

export class PatientValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Patient,
    fields?: string[],
  ): boolean {
    const newFields = fields?.length ? fields : ['patient_id_siresp'];
    return super.validate(notification, new PatientRules(data), newFields);
  }
}

export class PatientValidatorFactory {
  static create() {
    return new PatientValidator();
  }
}

export default PatientValidatorFactory;
