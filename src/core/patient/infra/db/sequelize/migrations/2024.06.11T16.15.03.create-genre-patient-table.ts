import { MigrationFn } from 'umzug';
import { Sequelize, DataTypes } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('genre_patient', {
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    genre_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  });
  await sequelize.getQueryInterface().addConstraint('genre_patient', {
    fields: ['patient_id'],
    type: 'foreign key',
    name: 'genre_patient_patient_id',
    references: {
      table: 'patients',
      field: 'patient_id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  });
  await sequelize.getQueryInterface().addConstraint('genre_patient', {
    fields: ['genre_id'],
    type: 'foreign key',
    name: 'genre_patient_genre_id',
    references: {
      table: 'genres',
      field: 'genre_id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  });
};
export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize
    .getQueryInterface()
    .removeConstraint('genre_patient', 'genre_patient_patient_id');
  await sequelize
    .getQueryInterface()
    .removeConstraint('genre_patient', 'genre_patient_genre_id');
  await sequelize.getQueryInterface().dropTable('genre_patient');
};