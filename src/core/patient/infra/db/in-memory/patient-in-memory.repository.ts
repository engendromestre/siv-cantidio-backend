import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { Patient, PatientId } from '../../../domain/patient.aggregate';
import {
  IPatientRepository,
  PatientFilter,
} from '../../../domain/patient.repository';

export class PatientInMemoryRepository
  extends InMemorySearchableRepository<Patient, PatientId, PatientFilter>
  implements IPatientRepository {
  sortableFields: string[] = ['full_name', 'patient_id_siresp', 'created_at'];

  getEntity(): new (...args: any[]) => Patient {
    return Patient;
  }

  protected async applyFilter(
    items: Patient[],
    filter: PatientFilter | null,
  ): Promise<Patient[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      const containsPatientIdSiresp =
        filter.patient_id_siresp &&
        i.patient_id_siresp.includes(filter.patient_id_siresp);
      const containsFullName =
        filter.full_name &&
        i.full_name.toLowerCase().includes(filter.full_name.toLowerCase());
      const containsCategoriesId =
        filter.categories_id &&
        filter.categories_id.some((c) => i.categories_id.has(c.id));
      const containsGenresId =
        filter.genres_id && filter.genres_id.some((c) => i.genres_id.has(c.id));

      const filterMap = [
        [filter.patient_id_siresp, containsPatientIdSiresp],
        [filter.full_name, containsFullName],
        [filter.categories_id, containsCategoriesId],
        [filter.genres_id, containsGenresId],
      ].filter((i) => i[0]);

      return filterMap.every((i) => i[1]);
    });
  }

  protected applySort(
    items: Patient[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ): Patient[] {
    return !sort
      ? super.applySort(items, 'created_at', 'desc')
      : super.applySort(items, sort, sort_dir);
  }
}
