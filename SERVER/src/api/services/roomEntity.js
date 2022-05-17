const { Op } = require("sequelize");
const Room = require("../models/Room");

const getRoomByName = async (nameRoom) => {
  const room = await Room.findAll({
    where: {
      nameRoom: {
        [Op.like]: !(nameRoom === "all") ? `%${nameRoom}%` : "%",
      },
    },
    raw: true,
  });
  return room;
};

module.exports = {
  getRoomByName,
};
