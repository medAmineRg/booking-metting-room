const db = require("../../config/db");
const { DataTypes } = require("sequelize");

const Role = db.define(
  "Role",
  {
    idRole: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nameRole: {
      type: DataTypes.STRING(20),
      unique: true,
      validate: {
        len: {
          args: [3, 20],
          msg: "Name length must be between 3 and 20",
        },
      },
    },
  },
  { freezeTableName: true, timestamps: false }
);

module.exports = Role;
