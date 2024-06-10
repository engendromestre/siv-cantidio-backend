import { CategoryId } from '../../category/domain/category.aggregate';
import { GenreId } from '../../genre/domain/genre.aggregate';
import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';
import {
    SearchParams,
    SearchParamsConstructorProps,
} from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { Patient, PatientId } from './patient.aggregate';

export type PatientFilter = {
    patient_id_siresp?: string;
    full_name?: string;
    categories_id?: CategoryId[];
    genres_id?: GenreId[];
};

export class PatientSearchParams extends SearchParams<PatientFilter> {
    private constructor(props: SearchParamsConstructorProps<PatientFilter> = {}) {
        super(props);
    }

    static create(
        props: Omit<SearchParamsConstructorProps<PatientFilter>, 'filter'> & {
            filter?: {
                patient_id_siresp?: string;
                full_name?: string;
                categories_id?: CategoryId[] | string[];
                genres_id?: GenreId[] | string[];
            };
        } = {},
    ) {
        const categories_id = props.filter?.categories_id?.map((c) =>
            c instanceof CategoryId ? c : new CategoryId(c),
        );
        const genres_id = props.filter?.genres_id?.map((c) =>
            c instanceof GenreId ? c : new GenreId(c),
        );

        return new PatientSearchParams({
            ...props,
            filter: {
                patient_id_siresp: props.filter?.patient_id_siresp,
                full_name: props.filter?.full_name,
                categories_id,
                genres_id,
            },
        });
    }

    get filter(): PatientFilter | null {
        return this._filter;
    }

    protected set filter(value: PatientFilter | null) {
        const _value =
            !value || (value as unknown) === '' || typeof value !== 'object'
                ? null
                : value;

        const filter = {
            ...(_value?.patient_id_siresp && { patient_id_siresp: `${_value?.patient_id_siresp}` }),
            ...(_value?.full_name && { full_name: `${_value?.full_name}` }),
            ...(_value?.categories_id &&
                _value.categories_id.length && {
                categories_id: _value.categories_id,
            }),
            ...(_value?.genres_id &&
                _value.genres_id.length && {
                genres_id: _value.genres_id,
            }),
        };

        this._filter = Object.keys(filter).length === 0 ? null : filter;
    }
}

export class PatientSearchResult extends SearchResult<Patient> { }

export interface IPatientRepository
    extends ISearchableRepository<
        Patient,
        PatientId,
        PatientFilter,
        PatientSearchParams,
        PatientSearchResult
    > { }