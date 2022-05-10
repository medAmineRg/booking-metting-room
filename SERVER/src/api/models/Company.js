const db = require("../../config/db");
const { DataTypes } = require("sequelize");

const Company = db.define(
  "Company",
  {
    idCompany: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nameCompany: {
      type: DataTypes.STRING(30),
      unique: true,
    },
  },
  { freezeTableName: true }
);

module.exports = Company;
