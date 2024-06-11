import { Chance } from 'chance';
import { Patient, PatientId } from './patient.aggregate';
import { CategoryId } from '../../category/domain/category.aggregate';
import { ImageMedia } from '../../shared/domain/value-objects/image-media.vo';
import { GenreId } from '../../genre/domain/genre.aggregate';
import { Photo } from './photo.vo';
import { Thumbnail } from './thumbnail.vo';
import { ThumbnailHalf } from './thumbnail-half.vo';


type PropOrFactory<T> = T | ((index: number) => T);

export class PatientFakeBuilder<TBuild = any> {
  // auto generated in entity
  private _patient_id: PropOrFactory<PatientId> | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _patient_id_siresp: PropOrFactory<string> = (_index) =>
    // @ts-ignore
    this.chance.unique(this.chance.integer, 5, { min: 0, max: 9 }).join('').toString();
  private _patient_chart_number: PropOrFactory<string> = (_index) =>
    // @ts-ignore
    this.chance.unique(this.chance.integer, 5, { min: 0, max: 9 }).join('').toString();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _full_name: PropOrFactory<string> = (_index) => this.chance.name({ nationality: 'it' });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _mother_full_name: PropOrFactory<string> = (_index) => this.chance.name({ nationality: 'it', gender: 'female' });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _birthdate: PropOrFactory<Date> = (_index) => this.chance.birthday();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _opened: PropOrFactory<boolean> = (_index) => true;
  private _photo: PropOrFactory<Photo | null> | undefined = new Photo({
    name: 'test-name-photo.png',
    location: 'test path photo',
  });
  private _thumbnail: PropOrFactory<Thumbnail | null> | undefined =
    new Thumbnail({
      name: 'test-name-thumbnail.png',
      location: 'test path thumbnail',
    });
  private _thumbnail_half: PropOrFactory<ThumbnailHalf | null> | undefined =
    new ThumbnailHalf({
      name: 'test-name-thumbnail-half.png',
      location: 'test path thumbnail half',
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _categories_id: PropOrFactory<CategoryId>[] = [];
  private _genres_id: PropOrFactory<GenreId>[] = [];
  // auto generated in entity
  private _created_at: PropOrFactory<Date> | undefined = undefined;

  private countObjs;

  static aPatientWithoutMedias() {
    return new PatientFakeBuilder<Patient>()
      .withPatientIdSiresp("12345")
      .withoutPhoto()
      .withoutThumbnail()
      .withoutThumbnailHalf()
  }

  static aPatientWithAllMedias() {
    return new PatientFakeBuilder<Patient>()
    .withPatientIdSiresp("12345");
  }

  static thePatientsWithoutMedias(countObjs: number) {
    return new PatientFakeBuilder<Patient[]>(countObjs)
      .withPatientIdSiresp("12345")
      .withoutPhoto()
      .withoutThumbnail()
      .withoutThumbnailHalf();
  }

  static thePatientsWithAllMedias(countObjs: number) {
    return new PatientFakeBuilder<Patient[]>(countObjs).withPatientIdSiresp("12345");
  }

  private chance: Chance.Chance;



  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withPatientId(valueOrFactory: PropOrFactory<PatientId>) {
    this._patient_id = valueOrFactory;
    return this;
  }

  withPatientIdSiresp(valueOrFactory: PropOrFactory<string>) {
    this._patient_id_siresp = valueOrFactory;
    return this;
  }

  withPatientChartNumber(valueOrFactory: PropOrFactory<string>) {
    this._patient_chart_number = valueOrFactory;
    return this;
  }

  withFullName(valueOrFactory: PropOrFactory<string>) {
    this._full_name = valueOrFactory;
    return this;
  }

  withMotherFullName(valueOrFactory: PropOrFactory<string>) {
    this._mother_full_name = valueOrFactory;
    return this;
  }

  withBirthdate(valueOrFactory: PropOrFactory<Date>) {
    this._birthdate = valueOrFactory;
    return this;
  }

  withMarkAsOpened() {
    this._opened = true;
    return this;
  }

  withMarkAsNotOpened() {
    this._opened = false;
    return this;
  }

  withPhoto(valueOrFactory: PropOrFactory<ImageMedia | null>) {
    this._photo = valueOrFactory;
    return this;
  }

  withoutPhoto() {
    this._photo = null;
    return this;
  }

  withThumbnail(valueOrFactory: PropOrFactory<ImageMedia | null>) {
    this._thumbnail = valueOrFactory;
    return this;
  }

  withoutThumbnail() {
    this._thumbnail = null;
    return this;
  }

  withThumbnailHalf(valueOrFactory: PropOrFactory<ImageMedia | null>) {
    this._thumbnail_half = valueOrFactory;
    return this;
  }

  withoutThumbnailHalf() {
    this._thumbnail_half = null;
    return this;
  }

  addCategoryId(valueOrFactory: PropOrFactory<CategoryId>) {
    this._categories_id.push(valueOrFactory);
    return this;
  }

  addGenreId(valueOrFactory: PropOrFactory<GenreId>) {
    this._genres_id.push(valueOrFactory);
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  // Novo método para gerar strings sequenciais
  generateRandomString(length: number = 5): string {
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += this.chance.integer({ min: 0, max: 9 }).toString();
    }
    return randomString;
  }

  build(): TBuild {
    const patients = new Array(this.countObjs).fill(undefined).map((_, index) => {
      const categoryId = new CategoryId();
      const categoriesId = this._categories_id.length
        ? this.callFactory(this._categories_id, index)
        : [categoryId];

      const genreId = new GenreId();
      const genresId = this._genres_id.length
        ? this.callFactory(this._genres_id, index)
        : [genreId];

      const patient = Patient.create({
        patient_id_siresp: this.callFactory(this._patient_id_siresp, index),
        patient_chart_number: this.callFactory(this._patient_chart_number, index),
        full_name: this.callFactory(this._full_name, index),
        mother_full_name: this.callFactory(this._mother_full_name, index),
        birthdate: this.callFactory(this._birthdate, index),
        is_opened: this.callFactory(this._opened, index),
        photo: this.callFactory(this._photo, index),
        thumbnail: this.callFactory(this._thumbnail, index),
        thumbnail_half: this.callFactory(this._thumbnail_half, index),
        categories_id: categoriesId,
        genres_id: genresId,
        ...(this._created_at && {
          created_at: this.callFactory(this._created_at, index),
        }),
      });
      patient['patient_id'] = !this._patient_id
        ? patient['patient_id']
        : this.callFactory(this._patient_id, index);
      patient.validate();
      return patient;
    });
    return this.countObjs === 1 ? (patients[0] as any) : patients;
  }

  get patient_id() {
    return this.getValue('patient_id');
  }

  get patient_id_siresp() {
    return this.getValue('patient_id_siresp');
  }

  get patient_chart_number() {
    return this.getValue('patient_chart_number');
  }

  get full_name() {
    return this.getValue('full_name');
  }

  get mother_full_name() {
    return this.getValue('mother_full_name');
  }

  get birthdate() {
    return this.getValue('birthdate');
  }

  get is_opened() {
    return this.getValue('is_opened');
  }

  get photo() {
    const photo = this.getValue('photo');
    return (
      photo ??
      new Photo({
        name: 'test-name-photo.png',
        location: 'test path photo',
      })
    );
  }

  get thumbnail() {
    const thumbnail = this.getValue('thumbnail');
    return (
      thumbnail ??
      new Thumbnail({
        name: 'test-name-thumbnail.png',
        location: 'test path thumbnail',
      })
    );
  }

  get thumbnail_half() {
    const thumbnailHalf = this.getValue('thumbnail_half');
    return (
      thumbnailHalf ??
      new ThumbnailHalf({
        name: 'test-name-thumbnail-half.png',
        location: 'test path thumbnail half',
      })
    );
  }

  get categories_id(): CategoryId[] {
    let categories_id = this.getValue('categories_id');

    if (!categories_id.length) {
      categories_id = [new CategoryId()];
    }
    return categories_id;
  }

  get genres_id(): GenreId[] {
    let genres_id = this.getValue('genres_id');

    if (!genres_id.length) {
      genres_id = [new GenreId()];
    }
    return genres_id;
  }

  get created_at() {
    return this.getValue('created_at');
  }

  private getValue(prop: any) {
    const optional = ['patient_id', 'created_at'];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`,
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    if (typeof factoryOrValue === 'function') {
      return factoryOrValue(index);
    }

    if (factoryOrValue instanceof Array) {
      return factoryOrValue.map((value) => this.callFactory(value, index));
    }

    return factoryOrValue;
  }
}
