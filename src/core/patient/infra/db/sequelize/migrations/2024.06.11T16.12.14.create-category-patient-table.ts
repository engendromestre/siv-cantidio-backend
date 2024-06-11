import { MigrationFn } from 'umzug';
import { Sequelize, DataTypes } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('category_patient', {
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  });
  await sequelize.getQueryInterface().addConstraint('category_patient', {
    fields: ['patient_id'],
    type: 'foreign key',
    name: 'category_patient_patient_id',
    references: {
      table: 'patients',
      field: 'patient_id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  });
  await sequelize.getQueryInterface().addConstraint('category_patient', {
    fields: ['category_id'],
    type: 'foreign key',
    name: 'category_patient_category_id',
    references: {
      table: 'categories',
      field: 'category_id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  });
};
export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .removeConstraint('category_patient', 'category_patient_patient_id');
  await sequelize
    .getQueryInterface()
    .removeConstraint('category_patient', 'category_patient_category_id');
  await sequelize.getQueryInterface().dropTable('category_patient');
};