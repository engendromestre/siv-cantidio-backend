import { Chance } from 'chance';
import { PatientFakeBuilder } from '../patient-fake.builder';
import { PatientId } from '../patient.aggregate';
import { CategoryId } from '../../../category/domain/category.aggregate';
import { GenreId } from '../../../genre/domain/genre.aggregate';
import { ThumbnailHalf } from '../thumbnail-half.vo';
import { Thumbnail } from '../thumbnail.vo';
import { Photo } from '../photo.vo';

describe('PatientFakerBuilder Unit Tests', () => {
  
  describe('patient_id prop', () => {
    const faker = PatientFakeBuilder.aPatientWithoutMedias();

    test('should throw error when any with methods has called', () => {
      expect(() => faker.patient_id).toThrow(
        new Error("Property patient_id not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_patient_id']).toBeUndefined();
    });

    test('withPatientId', () => {
      const patient_id = new PatientId();
      const $this = faker.withPatientId(patient_id);
      expect($this).toBeInstanceOf(PatientFakeBuilder);
      expect(faker['_patient_id']).toBe(patient_id);

      faker.withPatientId(() => patient_id);

      //@ts-expect-error _patient_id is a callable
      expect(faker['_patient_id']()).toBe(patient_id);
      expect(faker.patient_id).toBe(patient_id);
    });

    test('should pass index to patient_id factory', () => {
      let mockFactory = jest.fn(() => new PatientId());
      faker.withPatientId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);

      const genreId = new PatientId();
      mockFactory = jest.fn(() => genreId);
      const fakerMany = PatientFakeBuilder.thePatientsWithoutMedias(2);
      fakerMany.withPatientId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].patient_id).toBe(genreId);
      expect(fakerMany.build()[1].patient_id).toBe(genreId);
    });
  });

  describe('full_name prop', () => {
    const faker = PatientFakeBuilder.aPatientWithoutMedias();
    test('should be a function', () => {
      expect(typeof faker['_full_name']).toBe('function');
    });

    test('should call the name method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'name');
      faker['chance'] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('should call the birthday method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'birthday');
      faker['chance'] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });


    test('withPatientIdSiresp', () => {
      const $this = faker.withPatientIdSiresp("12345");
      expect($this).toBeInstanceOf(PatientFakeBuilder);
      expect(faker['_patient_id_siresp']).toBe("12345");

      faker.withPatientIdSiresp(() => "12345");

      // @ts-expect-error
      expect(faker['_patient_id_siresp']()).toBe("12345");
      expect(faker.patient_id_siresp).toBe("12345");
    });
  });

  describe('categories_id prop', () => {
    const faker = PatientFakeBuilder.aPatientWithoutMedias();
    it('should be empty', () => {
      expect(faker['_categories_id']).toBeInstanceOf(Array);
    });

    test('withCategoryId', () => {
      const categoryId1 = new CategoryId();
      const $this = faker.addCategoryId(categoryId1);
      expect($this).toBeInstanceOf(PatientFakeBuilder);
      expect(faker['_categories_id']).toStrictEqual([categoryId1]);

      const categoryId2 = new CategoryId();
      faker.addCategoryId(() => categoryId2);

      expect([
        faker['_categories_id'][0],
        //@ts-expect-error _categories_id is callable
        faker['_categories_id'][1](),
      ]).toStrictEqual([categoryId1, categoryId2]);
    });

    it('should pass index to categories_id factory', () => {
      const categoriesId = [new CategoryId(), new CategoryId()];
      faker.addCategoryId((index) => categoriesId[index]);
      const genre = faker.build();

      expect(genre.categories_id.get(categoriesId[0].id)).toBe(categoriesId[0]);

      const fakerMany = PatientFakeBuilder.thePatientsWithoutMedias(2);
      fakerMany.addCategoryId((index) => categoriesId[index]);
      const genres = fakerMany.build();

      expect(genres[0].categories_id.get(categoriesId[0].id)).toBe(
        categoriesId[0],
      );

      expect(genres[1].categories_id.get(categoriesId[1].id)).toBe(
        categoriesId[1],
      );
    });
  });

  describe('created_at prop', () => {
    const faker = PatientFakeBuilder.aPatientWithoutMedias();

    test('should throw error when any with methods has called', () => {
      const fakerPatient = PatientFakeBuilder.aPatientWithoutMedias();
      expect(() => fakerPatient.created_at).toThrowError(
        new Error("Property created_at not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_created_at']).toBeUndefined();
    });

    test('withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(PatientFakeBuilder);
      expect(faker['_created_at']).toBe(date);

      faker.withCreatedAt(() => date);
      //@ts-expect-error _created_at is a callable
      expect(faker['_created_at']()).toBe(date);
      expect(faker.created_at).toBe(date);
    });

    test('should pass index to created_at factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const genre = faker.build();
      expect(genre.created_at.getTime()).toBe(date.getTime() + 2);

      const fakerMany = PatientFakeBuilder.thePatientsWithoutMedias(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();

      expect(categories[0].created_at.getTime()).toBe(date.getTime() + 2);
      expect(categories[1].created_at.getTime()).toBe(date.getTime() + 3);
    });
  });

  it('should create a patient without medias', () => {
    let patient = PatientFakeBuilder.aPatientWithoutMedias().build();

    expect(patient.patient_id).toBeInstanceOf(PatientId);
    expect(typeof patient.patient_id_siresp === 'string').toBeTruthy();
    expect(typeof patient.patient_chart_number === 'string').toBeTruthy();
    expect(typeof patient.full_name === 'string').toBeTruthy();
    expect(typeof patient.mother_full_name === 'string').toBeTruthy();
    expect(patient.birthdate).toBeInstanceOf(Date);
    expect(patient.is_opened).toBeTruthy();
    expect(patient.is_published).toBeFalsy();
    expect(patient.photo).toBeNull();
    expect(patient.thumbnail).toBeNull();
    expect(patient.thumbnail_half).toBeNull();
    expect(patient.categories_id).toBeInstanceOf(Map);
    expect(patient.categories_id.size).toBe(1);
    expect(patient.categories_id.values().next().value).toBeInstanceOf(
      CategoryId,
    );
    expect(patient.genres_id).toBeInstanceOf(Map);
    expect(patient.genres_id.size).toBe(1);
    expect(patient.genres_id.values().next().value).toBeInstanceOf(GenreId);
    expect(patient.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    const dateOfBird = new Date('2000-02-01');
    const patientId = new PatientId();
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const genreId1 = new GenreId();
    const genreId2 = new GenreId();
    patient = PatientFakeBuilder.aPatientWithoutMedias()
      .withPatientId(patientId)
      .withPatientIdSiresp("12345")
      .withPatientChartNumber("12345")
      .withFullName('Test Full Name')
      .withMotherFullName('Test Mother Full Name')
      .withBirthdate(dateOfBird)
      .withMarkAsNotOpened()
      .addCategoryId(categoryId1)
      .addCategoryId(categoryId2)
      .addGenreId(genreId1)
      .addGenreId(genreId2)
      .withCreatedAt(created_at)
      .build();

    expect(patient.patient_id.id).toBe(patientId.id);
    expect(patient.patient_id_siresp).toBe("12345");
    expect(patient.patient_chart_number).toBe("12345");
    expect(patient.full_name).toBe('Test Full Name');
    expect(patient.mother_full_name).toBe('Test Mother Full Name');
    expect(patient.birthdate).toEqual(dateOfBird);
    expect(patient.is_opened).toBeFalsy();
    expect(patient.is_published).toBeFalsy();
    expect(patient.photo).toBeNull();
    expect(patient.thumbnail).toBeNull();
    expect(patient.thumbnail_half).toBeNull();
    expect(patient.categories_id).toBeInstanceOf(Map);
    expect(patient.categories_id.get(categoryId1.id)).toBe(categoryId1);
    expect(patient.categories_id.get(categoryId2.id)).toBe(categoryId2);
    expect(patient.genres_id).toBeInstanceOf(Map);
    expect(patient.genres_id.get(genreId1.id)).toBe(genreId1);
    expect(patient.genres_id.get(genreId2.id)).toBe(genreId2);
    expect(patient.created_at).toEqual(created_at);
  });

  it('should create a patient with medias', () => {
    let patient = PatientFakeBuilder.aPatientWithAllMedias().build();

    expect(patient.patient_id).toBeInstanceOf(PatientId);
    expect(typeof patient.patient_id_siresp === 'string').toBeTruthy();
    expect(typeof patient.patient_chart_number === 'string').toBeTruthy();
    expect(typeof patient.full_name === 'string').toBeTruthy();
    expect(typeof patient.mother_full_name === 'string').toBeTruthy();
    expect(patient.birthdate).toBeInstanceOf(Date);
    expect(patient.is_opened).toBeTruthy();
    expect(patient.is_published).toBeFalsy();
    expect(patient.photo).toBeInstanceOf(Photo);
    expect(patient.thumbnail).toBeInstanceOf(Thumbnail);
    expect(patient.thumbnail_half).toBeInstanceOf(ThumbnailHalf);
    expect(patient.categories_id).toBeInstanceOf(Map);
    expect(patient.categories_id.size).toBe(1);
    expect(patient.categories_id.values().next().value).toBeInstanceOf(
      CategoryId,
    );
    expect(patient.genres_id).toBeInstanceOf(Map);
    expect(patient.genres_id.size).toBe(1);
    expect(patient.genres_id.values().next().value).toBeInstanceOf(GenreId);
    expect(patient.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    const dateOfBird = new Date('2000-02-01');
    const patientId = new PatientId();
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const genreId1 = new GenreId();
    const genreId2 = new GenreId();
    const photo = new Photo({
      location: 'location',
      name: 'name',
    });
    const thumbnail = new Thumbnail({
      location: 'location',
      name: 'name',
    });
    const thumbnail_half = new ThumbnailHalf({
      location: 'location',
      name: 'name',
    });

    patient = PatientFakeBuilder.aPatientWithAllMedias()
      .withPatientId(patientId)
      .withPatientIdSiresp("12345")
      .withPatientChartNumber("12345")
      .withFullName('Test Full Name')
      .withMotherFullName('Test Mother Full Name')
      .withBirthdate(dateOfBird)
      .withMarkAsNotOpened()
      .addCategoryId(categoryId1)
      .addCategoryId(categoryId2)
      .addGenreId(genreId1)
      .addGenreId(genreId2)
      .withPhoto(photo)
      .withThumbnail(thumbnail)
      .withThumbnailHalf(thumbnail_half)
      .withCreatedAt(created_at)
      .build();

    expect(patient.patient_id.id).toBe(patientId.id);
    expect(patient.patient_id_siresp).toBe("12345");
    expect(patient.patient_chart_number).toBe("12345");
    expect(patient.full_name).toBe('Test Full Name');
    expect(patient.mother_full_name).toBe('Test Mother Full Name');
    expect(patient.birthdate).toEqual(dateOfBird);
    expect(patient.is_opened).toBeFalsy();
    expect(patient.is_published).toBeFalsy();
    expect(patient.photo).toBe(photo);
    expect(patient.thumbnail).toBe(thumbnail);
    expect(patient.thumbnail_half).toBe(thumbnail_half);
    expect(patient.categories_id).toBeInstanceOf(Map);
    expect(patient.categories_id.get(categoryId1.id)).toBe(categoryId1);
    expect(patient.categories_id.get(categoryId2.id)).toBe(categoryId2);
    expect(patient.genres_id).toBeInstanceOf(Map);
    expect(patient.genres_id.get(genreId1.id)).toBe(genreId1);
    expect(patient.genres_id.get(genreId2.id)).toBe(genreId2);
    expect(patient.created_at).toEqual(created_at);
  });

  it('should create many patients without medias', () => {
    const faker = PatientFakeBuilder.thePatientsWithoutMedias(2);
    let patients = faker.build();
    patients.forEach((patient) => {
      expect(patient.patient_id).toBeInstanceOf(PatientId);
      expect(typeof patient.patient_id_siresp === 'string').toBeTruthy();
      expect(typeof patient.patient_chart_number === 'string').toBeTruthy();
      expect(typeof patient.full_name === 'string').toBeTruthy();
      expect(typeof patient.mother_full_name === 'string').toBeTruthy();
      expect(patient.birthdate).toBeInstanceOf(Date);
      expect(patient.is_opened).toBeTruthy();
      expect(patient.is_published).toBeFalsy();
      expect(patient.photo).toBeNull();
      expect(patient.thumbnail).toBeNull();
      expect(patient.thumbnail_half).toBeNull();
      expect(patient.categories_id).toBeInstanceOf(Map);
      expect(patient.categories_id.size).toBe(1);
      expect(patient.categories_id.values().next().value).toBeInstanceOf(
        CategoryId,
      );
      expect(patient.genres_id).toBeInstanceOf(Map);
      expect(patient.genres_id.size).toBe(1);
      expect(patient.genres_id.values().next().value).toBeInstanceOf(GenreId);
      expect(patient.created_at).toBeInstanceOf(Date);
    });

    const birfOfDate = new Date('2000-02-01');
    const created_at = new Date();
    const patientId = new PatientId();
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const genreId1 = new GenreId();
    const genreId2 = new GenreId();

    patients = PatientFakeBuilder.thePatientsWithoutMedias(2)
      .withPatientId(patientId)
      .withPatientIdSiresp("12345")
      .withPatientChartNumber("12345")
      .withFullName('Test Full Name')
      .withMotherFullName('Test Mother Full Name')
      .withBirthdate(birfOfDate)
      .withMarkAsNotOpened()
      .addCategoryId(categoryId1)
      .addCategoryId(categoryId2)
      .addGenreId(genreId1)
      .addGenreId(genreId2)
      .withCreatedAt(created_at)
      .build();

    patients.forEach((patient) => {
      expect(patient.patient_id.id).toBe(patientId.id);
      expect(patient.patient_id_siresp).toBe("12345");
      expect(patient.patient_chart_number).toBe("12345");
      expect(patient.full_name).toBe('Test Full Name');
      expect(patient.mother_full_name).toBe('Test Mother Full Name');
      expect(patient.birthdate).toEqual(birfOfDate);
      expect(patient.is_opened).toBeFalsy();
      expect(patient.is_published).toBeFalsy();
      expect(patient.photo).toBeNull();
      expect(patient.thumbnail).toBeNull();
      expect(patient.thumbnail_half).toBeNull();
      expect(patient.categories_id).toBeInstanceOf(Map);
      expect(patient.categories_id.get(categoryId1.id)).toBe(categoryId1);
      expect(patient.categories_id.get(categoryId2.id)).toBe(categoryId2);
      expect(patient.genres_id).toBeInstanceOf(Map);
      expect(patient.genres_id.get(genreId1.id)).toBe(genreId1);
      expect(patient.genres_id.get(genreId2.id)).toBe(genreId2);
      expect(patient.created_at).toEqual(created_at);
    });
  });

  it('should create many patients with medias', () => {
    const faker = PatientFakeBuilder.thePatientsWithAllMedias(2);
    let patients = faker.build();
    patients.forEach((patient) => {
      expect(patient.patient_id).toBeInstanceOf(PatientId);
      expect(typeof patient.patient_id_siresp === 'string').toBeTruthy();
      expect(typeof patient.patient_chart_number === 'string').toBeTruthy();
      expect(typeof patient.full_name === 'string').toBeTruthy();
      expect(typeof patient.mother_full_name === 'string').toBeTruthy();
      expect(patient.birthdate).toBeInstanceOf(Date);
      expect(patient.is_opened).toBeTruthy();
      expect(patient.is_published).toBeFalsy();
      expect(patient.photo).toBeInstanceOf(Photo);
      expect(patient.thumbnail).toBeInstanceOf(Thumbnail);
      expect(patient.thumbnail_half).toBeInstanceOf(ThumbnailHalf);
      expect(patient.categories_id).toBeInstanceOf(Map);
      expect(patient.categories_id.size).toBe(1);
      expect(patient.categories_id.values().next().value).toBeInstanceOf(
        CategoryId,
      );
      expect(patient.genres_id).toBeInstanceOf(Map);
      expect(patient.genres_id.size).toBe(1);
      expect(patient.genres_id.values().next().value).toBeInstanceOf(GenreId);
      expect(patient.created_at).toBeInstanceOf(Date);
    });

    const dateOfBird = new Date('2000-02-01');
    const created_at = new Date();
    const patientId = new PatientId();
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const genreId1 = new GenreId();
    const genreId2 = new GenreId();
    const photo = new Photo({
      location: 'location',
      name: 'name',
    });
    const thumbnail = new Thumbnail({
      location: 'location',
      name: 'name',
    });
    const thumbnail_half = new ThumbnailHalf({
      location: 'location',
      name: 'name',
    });

    patients = PatientFakeBuilder.thePatientsWithAllMedias(2)
      .withPatientId(patientId)
      .withPatientIdSiresp("12345")
      .withPatientChartNumber("12345")
      .withFullName('Test Full Name')
      .withMotherFullName('Test Mother Full Name')
      .withBirthdate(dateOfBird)
      .withMarkAsNotOpened()
      .addCategoryId(categoryId1)
      .addCategoryId(categoryId2)
      .addGenreId(genreId1)
      .addGenreId(genreId2)
      .withPhoto(photo)
      .withThumbnail(thumbnail)
      .withThumbnailHalf(thumbnail_half)
      .withCreatedAt(created_at)
      .build();
    patients.forEach((patient) => {
      expect(patient.patient_id.id).toBe(patientId.id);
      expect(patient.patient_id_siresp).toBe("12345");
      expect(patient.patient_chart_number).toBe("12345");
      expect(patient.full_name).toBe('Test Full Name');
      expect(patient.mother_full_name).toBe('Test Mother Full Name');
      expect(patient.birthdate).toEqual(dateOfBird);
      expect(patient.is_opened).toBeFalsy();
      expect(patient.is_published).toBeFalsy();
      expect(patient.photo).toBe(photo);
      expect(patient.thumbnail).toBe(thumbnail);
      expect(patient.thumbnail_half).toBe(thumbnail_half);
      expect(patient.categories_id).toBeInstanceOf(Map);
      expect(patient.categories_id.get(categoryId1.id)).toBe(categoryId1);
      expect(patient.categories_id.get(categoryId2.id)).toBe(categoryId2);
      expect(patient.genres_id).toBeInstanceOf(Map);
      expect(patient.genres_id.get(genreId1.id)).toBe(genreId1);
      expect(patient.genres_id.get(genreId2.id)).toBe(genreId2);
      expect(patient.created_at).toEqual(created_at);
    });
  });
});
