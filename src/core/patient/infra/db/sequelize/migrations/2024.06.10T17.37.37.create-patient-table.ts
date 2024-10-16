import { MigrationFn } from 'umzug';
import { Sequelize, DataTypes } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('patients', {
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    patient_id_siresp: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true,
    },
    patient_chart_number: {
      type: DataTypes.STRING(5),
      allowNull: true,
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mother_full_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    birthdate: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    is_opened: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
    },
  });
};
export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('patients');
};