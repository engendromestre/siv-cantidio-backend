import { CategoryId } from '../../../../category/domain/category.aggregate';
import { GenreId } from '../../../../genre/domain/genre.aggregate';
import { Patient } from '../../../domain/patient.aggregate';
import { PatientInMemoryRepository } from './patient-in-memory.repository';

describe('PatientInMemoryRepository', () => {
  let repository: PatientInMemoryRepository;

  beforeEach(() => (repository = new PatientInMemoryRepository()));
  it('should no filter items when filter object is null', async () => {
    const items = [
      Patient.fake().aPatientWithoutMedias().build(),
      Patient.fake().aPatientWithoutMedias().build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it('should filter items by patient_id_siresp', async () => {
    const faker = Patient.fake().aPatientWithAllMedias();
    const items = [
      faker.withPatientIdSiresp("12345").build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, {
      patient_id_siresp: '12345',
    });
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0]]);
  });

  it('should filter items by full_name', async () => {
    const faker = Patient.fake().aPatientWithAllMedias();
    const items = [
      faker.withFullName('test').build(),
      faker.withFullName('TEST').build(),
      faker.withFullName('fake').build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, {
      full_name: 'TEST',
    });
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it('should filter items by categories_id', async () => {
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const categoryId3 = new CategoryId();
    const categoryId4 = new CategoryId();
    const items = [
      Patient.fake()
        .aPatientWithoutMedias()
        .addCategoryId(categoryId1)
        .addCategoryId(categoryId2)
        .build(),
      Patient.fake()
        .aPatientWithoutMedias()
        .addCategoryId(categoryId3)
        .addCategoryId(categoryId4)
        .build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    let itemsFiltered = await repository['applyFilter'](items, {
      categories_id: [categoryId1],
    });
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0]]);

    itemsFiltered = await repository['applyFilter'](items, {
      categories_id: [categoryId2],
    });
    expect(filterSpy).toHaveBeenCalledTimes(2);
    expect(itemsFiltered).toStrictEqual([items[0]]);

    itemsFiltered = await repository['applyFilter'](items, {
      categories_id: [categoryId1, categoryId2],
    });
    expect(filterSpy).toHaveBeenCalledTimes(3);
    expect(itemsFiltered).toStrictEqual([items[0]]);

    itemsFiltered = await repository['applyFilter'](items, {
      categories_id: [categoryId1, categoryId3],
    });
    expect(filterSpy).toHaveBeenCalledTimes(4);
    expect(itemsFiltered).toStrictEqual([...items]);

    itemsFiltered = await repository['applyFilter'](items, {
      categories_id: [categoryId3, categoryId1],
    });
    expect(filterSpy).toHaveBeenCalledTimes(5);
    expect(itemsFiltered).toStrictEqual([...items]);
  });

  it('should filter items by full_name and categories_id', async () => {
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const categoryId3 = new CategoryId();
    const categoryId4 = new CategoryId();
    const items = [
      Patient.fake()
        .aPatientWithoutMedias()
        .withFullName('test')
        .addCategoryId(categoryId1)
        .addCategoryId(categoryId2)
        .build(),
      Patient.fake()
        .aPatientWithoutMedias()
        .withFullName('fake')
        .addCategoryId(categoryId3)
        .addCategoryId(categoryId4)
        .build(),
      Patient.fake()
        .aPatientWithoutMedias()
        .withFullName('test fake')
        .addCategoryId(categoryId1)
        .build(),
    ];

    let itemsFiltered = await repository['applyFilter'](items, {
      full_name: 'test',
      categories_id: [categoryId1],
    });
    expect(itemsFiltered).toStrictEqual([items[0], items[2]]);

    itemsFiltered = await repository['applyFilter'](items, {
      full_name: 'test',
      categories_id: [categoryId3],
    });
    expect(itemsFiltered).toStrictEqual([]);

    itemsFiltered = await repository['applyFilter'](items, {
      full_name: 'fake',
      categories_id: [categoryId4],
    });
    expect(itemsFiltered).toStrictEqual([items[1]]);
  });

  it('should filter items by full_name and categories_id and genres_id', async () => {
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const categoryId3 = new CategoryId();
    const categoryId4 = new CategoryId();

    const genreId1 = new GenreId();
    const items = [
      Patient.fake()
        .aPatientWithoutMedias()
        .withFullName('test')
        .addCategoryId(categoryId1)
        .addCategoryId(categoryId2)
        .build(),
      Patient.fake()
        .aPatientWithoutMedias()
        .withFullName('fake')
        .addCategoryId(categoryId3)
        .addCategoryId(categoryId4)
        .build(),
      Patient.fake()
        .aPatientWithoutMedias()
        .withFullName('test fake')
        .addCategoryId(categoryId1)
        .addGenreId(genreId1)
        .build(),
    ];

    const itemsFiltered = await repository['applyFilter'](items, {
      full_name: 'test',
      categories_id: [categoryId1],
      genres_id: [genreId1],
    });
    expect(itemsFiltered).toStrictEqual([items[2]]);
  });

  it('should sort by created_at when sort param is null', async () => {
    const items = [
      Patient.fake().aPatientWithoutMedias().withCreatedAt(new Date()).build(),
      Patient.fake()
        .aPatientWithoutMedias()
        .withCreatedAt(new Date(new Date().getTime() + 1))
        .build(),
      Patient.fake()
        .aPatientWithoutMedias()
        .withCreatedAt(new Date(new Date().getTime() + 2))
        .build(),
    ];

    const itemsSorted = await repository['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by full_name', async () => {
    const items = [
      Patient.fake().aPatientWithoutMedias().withFullName('c').build(),
      Patient.fake().aPatientWithoutMedias().withFullName('b').build(),
      Patient.fake().aPatientWithoutMedias().withFullName('a').build(),
    ];

    let itemsSorted = await repository['applySort'](items, 'full_name', 'asc');
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository['applySort'](items, 'full_name', 'desc');
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
