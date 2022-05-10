const db = require("../../config/db");
const { DataTypes } = require("sequelize");

const Menu = db.define(
  "Menu",
  {
    idMenu: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subMenu: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      validate: {
        isNumeric: true,
      },
    },
    nameMenu: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 30],
          msg: "Name length must be between 3 and 30",
        },
      },
    },
    Path: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 30],
          msg: "Path length must be between 3 and 30",
        },
      },
    },
    component: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 30],
          msg: "Comoponent length must be between 3 and 30",
        },
      },
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = Menu;
