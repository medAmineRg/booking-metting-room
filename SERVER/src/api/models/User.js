const db = require("../../config/db");
const { DataTypes } = require("sequelize");

const User = db.define(
  "User",
  {
    idUser: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(50),
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    fullName: {
      type: DataTypes.STRING(30),
      validate: {
        len: {
          args: [5, 30],
          msg: "Name length must be between 3 and 30",
        },
      },
    },

    password: {
      type: DataTypes.STRING(72),
    },
    phone: {
      type: DataTypes.STRING(10),
      unique: true,
      validate: {
        len: {
          args: [10],
          msg: "Phone length must be 10 numbers",
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = User;
