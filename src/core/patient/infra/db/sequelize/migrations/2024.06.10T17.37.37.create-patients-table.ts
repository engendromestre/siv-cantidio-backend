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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    year_launched: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.ENUM(...Object.values(RatingValues)),
      allowNull: false,
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
  await sequelize.getQueryInterface().dropTable('videos');
};