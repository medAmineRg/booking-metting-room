const db = require("../../config/db");
const { DataTypes } = require("sequelize");

const Room = db.define(
  "Room",
  {
    idRoom: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    typeRoom: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    nameRoom: {
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
  { freezeTableName: true }
);

module.exports = Room;
