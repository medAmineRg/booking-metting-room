const db = require("../../config/db");
const { DataTypes } = require("sequelize");
const sequelize = require("sequelize");
const Booking = db.define(
  "Booking",
  {
    idBooking: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    isConfirm: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    subject: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: {
          args: [3, 30],
          msg: "Subject length must be between 3 and 30",
        },
      },
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: false,
      validate: {
        len: {
          args: [15, 250],
          msg: "Description length must be between 15 and 250",
        },
      },
    },
    updatedBy: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
    beginAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isCancled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    cancledBy: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Booking;
