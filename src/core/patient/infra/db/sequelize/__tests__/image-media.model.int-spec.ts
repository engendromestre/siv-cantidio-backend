import { DataType } from 'sequelize-typescript';
import { ImageMediaModel } from '../image-media.model';
import { setupSequelizeForPatient } from '../testing/helpers';

describe('ImageMediaModel Unit Tests', () => {
  setupSequelizeForPatient();

  test('table name', () => {
    expect(ImageMediaModel.tableName).toBe('image_medias');
  });

  test('mapping props', () => {
    const uniqueIndex = ImageMediaModel.options.indexes![0];
    expect(uniqueIndex).toMatchObject({
      fields: ['patient_id', 'patient_related_field'],
      unique: true,
    });

    const attributesMap = ImageMediaModel.getAttributes();
    const attributes = Object.keys(ImageMediaModel.getAttributes());
    expect(attributes).toStrictEqual([
      'image_media_id',
      'name',
      'location',
      'patient_id',
      'patient_related_field',
    ]);

    const imageMediaIdAttr = attributesMap.image_media_id;
    expect(imageMediaIdAttr).toMatchObject({
      field: 'image_media_id',
      fieldName: 'image_media_id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const locationAttr = attributesMap.location;
    expect(locationAttr).toMatchObject({
      field: 'location',
      fieldName: 'location',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const patietnIdAttr = attributesMap.patient_id;
    expect(patietnIdAttr).toMatchObject({
      field: 'patient_id',
      fieldName: 'patient_id',
      allowNull: false,
      type: DataType.UUID(),
      references: {
        model: 'patients',
        key: 'patient_id',
      },
    });

    const patientRelatedFieldAttr = attributesMap.patient_related_field;
    expect(patientRelatedFieldAttr).toMatchObject({
      field: 'patient_related_field',
      fieldName: 'patient_related_field',
      allowNull: false,
      type: DataType.STRING(20),
    });
  });
});
