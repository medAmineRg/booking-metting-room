const db = require("../../config/db");
const { DataTypes } = require("sequelize");

const Permission = db.define(
  "Permission",
  {
    idPer: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    namePer: {
      type: DataTypes.STRING(20),
      unique: true,
      validate: {
        len: {
          args: [3, 30],
          msg: "Name length must be between 3 and 30",
        },
      },
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = Permission;
