import { CategoryId } from '../../../category/domain/category.aggregate';
import { GenreId } from '../../../genre/domain/genre.aggregate';
import { Photo } from '../photo.vo';
import { ThumbnailHalf } from '../thumbnail-half.vo';
import { Thumbnail } from '../thumbnail.vo';
import { Patient, PatientId } from '../patient.aggregate';

describe('Patient Unit Tests', () => {
  beforeEach(() => {
    Patient.prototype.validate = jest
      .fn()
      .mockImplementation(Patient.prototype.validate);
  });
  test('constructor of patient', () => {
    const categoryId = new CategoryId();
    const categoriesId = new Map<string, CategoryId>([
      [categoryId.id, categoryId],
    ]);
    const genreId = new GenreId();
    const genresId = new Map<string, GenreId>([[genreId.id, genreId]]);

    let patient = new Patient({
      patient_id_siresp: '12345',
      full_name: 'Test Patient Full Name',
      mother_full_name: 'Test Patient Mother Full Name',
      birthdate: new Date('2000-06-01'),
      is_opened: true,
      is_published: true,
      categories_id: categoriesId,
      genres_id: genresId,
    });

    expect(patient).toBeInstanceOf(Patient);
    expect(patient.patient_id).toBeInstanceOf(PatientId);
    expect(patient.patient_id_siresp).toBe('12345');
    expect(patient.patient_chart_number).toBeNull();
    expect(patient.full_name).toBe('Test Patient Full Name');
    expect(patient.mother_full_name).toBe('Test Patient Mother Full Name');
    expect(patient.birthdate).toBeInstanceOf(Date);
    expect(patient.is_opened).toBe(true);
    expect(patient.is_published).toBe(true);
    expect(patient.photo).toBeNull();
    expect(patient.thumbnail).toBeNull();
    expect(patient.thumbnail_half).toBeNull();
    expect(patient.categories_id).toEqual(categoriesId);
    expect(patient.genres_id).toEqual(genresId);
    expect(patient.created_at).toBeInstanceOf(Date);

    const photo = new Photo({
      name: 'test name photo',
      location: 'test location photo',
    });

    const thumbnail = new Thumbnail({
      name: 'test name thumbnail',
      location: 'test location thumbnail',
    });

    const thumbnailHalf = new ThumbnailHalf({
      name: 'test name thumbnail half',
      location: 'test location thumbnail half',
    });

    patient = new Patient({
      patient_id_siresp: '12345',
      patient_chart_number: '12345',
      full_name: 'Test Patient Full Name',
      mother_full_name: 'Test Patient Mother Full Name',
      birthdate: new Date('2000-06-01'),
      is_opened: true,
      is_published: true,
      categories_id: categoriesId,
      genres_id: genresId,
      photo,
      thumbnail,
      thumbnail_half: thumbnailHalf,
    });

    expect(patient).toBeInstanceOf(Patient);
    expect(patient.patient_id).toBeInstanceOf(PatientId);
    expect(patient.patient_id_siresp).toBe('12345');
    expect(patient.patient_chart_number).toBe('12345');
    expect(patient.full_name).toBe('Test Patient Full Name');
    expect(patient.mother_full_name).toBe('Test Patient Mother Full Name');
    expect(patient.birthdate).toBeInstanceOf(Date);
    expect(patient.is_opened).toBe(true);
    expect(patient.is_published).toBe(true);
    expect(patient.photo).toEqual(photo);
    expect(patient.thumbnail).toEqual(thumbnail);
    expect(patient.thumbnail_half).toEqual(thumbnailHalf);
    expect(patient.categories_id).toEqual(categoriesId);
    expect(patient.genres_id).toEqual(genresId);
    expect(patient.created_at).toBeInstanceOf(Date);
    expect(patient.thumbnail).toEqual(thumbnail);
    expect(patient.thumbnail_half).toEqual(thumbnailHalf);
  });

  describe('patient_id field', () => {
    const arrange = [
      {},
      { id: null },
      { id: undefined },
      { id: new PatientId() },
    ];

    test.each(arrange)('when props is %j', (item) => {
      const genre = new Patient(item as any);
      expect(genre.patient_id).toBeInstanceOf(PatientId);
    });
  });

  describe('create command', () => {

    test('should create a patient and no publish patient media', () => {
      const categories_id = [new CategoryId()];
      const genres_id = [new GenreId()];

      const patient = Patient.create({
        patient_id_siresp: '12345',
        patient_chart_number: '12345',
        full_name: 'Test Patient Full Name',
        mother_full_name: 'Test Patient Mother Full Name',
        birthdate: new Date('2000-06-01'),
        is_opened: true,
        categories_id,
        genres_id,
      });

      expect(patient.patient_id).toBeInstanceOf(PatientId);
      expect(patient.patient_id_siresp).toBe('12345');
      expect(patient.patient_chart_number).toBe('12345');
      expect(patient.full_name).toBe('Test Patient Full Name');
      expect(patient.mother_full_name).toBe('Test Patient Mother Full Name');
      expect(patient.birthdate).toBeInstanceOf(Date);
      expect(patient.is_opened).toBe(true);
      expect(patient.is_published).toBe(false);
      expect(patient.photo).toBeNull();
      expect(patient.thumbnail).toBeNull();
      expect(patient.thumbnail_half).toBeNull();
      expect(patient.categories_id).toEqual(
        new Map(categories_id.map((id) => [id.id, id])),
      );
      expect(patient.genres_id).toEqual(
        new Map(genres_id.map((id) => [id.id, id])),
      );
      expect(patient.created_at).toBeInstanceOf(Date);
      expect(patient.is_published).toBeFalsy();
    });
  });

  describe('changePatienIdSiresp method', () => {
    test('should change patient_id_siresp', () => {
      const patient = Patient.fake().aPatientWithoutMedias().build();
      patient.changePatienIdSiresp('12345');
      expect(patient.patient_id_siresp).toBe('12345');
      expect(Patient.prototype.validate).toHaveBeenCalledTimes(3);
    });
  });

  describe('changePatientChartNumber method', () => {
    test('should change patient_chart_number', () => {
      const patient = Patient.fake().aPatientWithoutMedias().build();
      patient.changePatientChartNumber('12345');
      expect(patient.patient_chart_number).toBe('12345');
    });
  });

  describe('changeFullName method', () => {
    test('should change full_name', () => {
      const patient = Patient.fake().aPatientWithoutMedias().build();
      patient.changeFullName('Test Patient Full Name');
      expect(patient.full_name).toBe('Test Patient Full Name');
    });
  });

  describe('changeMotherFullName method', () => {
    test('should change mother_full_name', () => {
      const patient = Patient.fake().aPatientWithoutMedias().build();
      patient.changeMotherFullName('Test Patient Mother Full Name');
      expect(patient.mother_full_name).toBe('Test Patient Mother Full Name');
    });
  });

  describe('changeBirthdate method', () => {
    test('should change birthdate', () => {
      const patient = Patient.fake().aPatientWithoutMedias().build();
      const birthdate = new Date('2000-06-01');
      patient.changeBirthdate(birthdate);
      expect(patient.birthdate).toBe(birthdate);
    });
  });

  describe('markAsOpened method', () => {
    test('should mark as opened', () => {
      const patient = Patient.fake().aPatientWithoutMedias().build();
      patient.markAsOpened();
      expect(patient.is_opened).toBeTruthy();
    });
  });

  describe('markAsNotOpened method', () => {
    test('should mark as not opened', () => {
      const patient = Patient.fake().aPatientWithoutMedias().build();
      patient.markAsNotOpened();
      expect(patient.is_opened).toBeFalsy();
    });
  });

  describe('replaceimage method', () => {
    test('should replace image', () => {
      const patient = Patient.fake().aPatientWithoutMedias().build();
      const photo = new Photo({
        name: 'test name photo',
        location: 'test location photo',
      });
      patient.replacePhoto(photo);
      expect(patient.photo).toEqual(photo);
    });
  });

  describe('replaceThumbnail method', () => {
    test('should replace thumbnail', () => {
      const patient = Patient.fake().aPatientWithoutMedias().build();
      const thumbnail = new Thumbnail({
        name: 'test name thumbnail',
        location: 'test location thumbnail',
      });
      patient.replaceThumbnail(thumbnail);
      expect(patient.thumbnail).toEqual(thumbnail);
    });
  });

  describe('replaceThumbnailHalf method', () => {
    test('should replace thumbnail half', () => {
      const patient = Patient.fake().aPatientWithoutMedias().build();
      const thumbnailHalf = new ThumbnailHalf({
        name: 'test name thumbnail half',
        location: 'test location thumbnail half',
      });
      patient.replaceThumbnailHalf(thumbnailHalf);
      expect(patient.thumbnail_half).toEqual(thumbnailHalf);
    });
  });

  test('should add category id', () => {
    const categoryId = new CategoryId();
    const patient = Patient.fake().aPatientWithoutMedias().build();
    patient.addCategoryId(categoryId);
    expect(patient.categories_id.size).toBe(2);
    expect(patient.categories_id.get(categoryId.id)).toBe(categoryId);
  });
});
