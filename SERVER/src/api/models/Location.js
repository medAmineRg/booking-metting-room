const db = require("../../config/db");
const { DataTypes } = require("sequelize");

const Location = db.define(
  "Location",
  {
    idLoc: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nameLoc: {
      type: DataTypes.STRING(30),
    },
    adrLoc: {
      type: DataTypes.STRING(50),
    },
  },
  { freezeTableName: true }
);

module.exports = Location;
