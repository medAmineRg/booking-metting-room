const { DataTypes } = require("sequelize");
const db = require("../../config/db");
const Menu = require("./Menu");
const Permission = require("./Permission");
const Role = require("./Role");

const Role_Permission_Menu = db.define(
  "Role_Permission_Menu",
  {
    idRole: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Role,
        key: "idRole",
      },
      validate: {
        isNumeric: true,
      },
    },
    idPer: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Permission,
        key: "idPer",
      },
      validate: {
        isNumeric: true,
      },
    },
    idMenu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Menu,
        key: "idMenu",
      },
      validate: {
        isNumeric: true,
      },
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = Role_Permission_Menu;
