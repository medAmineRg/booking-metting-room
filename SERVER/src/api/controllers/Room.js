const Room = require("../models/Room");
const { roomArentAvailable } = require("../services/bookingEntity");
const { Op } = require("sequelize");
const { checkDate } = require("../helpers/bookingHelper");
const { getRoomByName } = require("../services/roomEntity");

const GetRoom = async (req, res) => {
  try {
    const response = await Room.findAll();
    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: error.errors[0].message || "something went wrong try again",
      code: 400,
      method: "GET",
      api: "rooms",
    });
  }
};

const GetRoomByName = async (req, res) => {
  try {
    const room = await getRoomByName(req.params.name);
    return res.status(200).json({
      status: "OK",
      message: room.length + " room found",
      room,
      code: 200,
      api: "/room/:name",
      method: "get",
    });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "something went wrong try again",
      code: 400,
      method: "GET",
      api: "room/:name",
    });
  }
};

const SearchRoom = async (req, res) => {
  const dateIsntValid = checkDate(req.body.start, req.body.end);
  if (dateIsntValid)
    return res.status(400).json({
      api: "/bookings",
      code: 400,
      message: dateIsntValid,
      status: "Error",
      method: "POST",
    });
  if (req.body.capacity <= 1) {
    return res.status(400).json({
      status: "Error",
      code: 400,
      message: "Room capacity must be greater than 1.",
      api: "search-room",
      method: "POST",
    });
  }
  req.body.capacity = 2;
  try {
    const nonAvailableRoom = await roomArentAvailable(
      req.body.start,
      req.body.end
    );
    let idRoom = [];
    if (nonAvailableRoom[0].length) {
      for (let i = 0; i < nonAvailableRoom[0].length; i++) {
        idRoom.push(nonAvailableRoom[0][i].idRoom);
      }
    }
    const availableRoom = await Room.findAll({
      where: {
        idRoom: { [Op.not]: idRoom },
        capacity: { [Op.gt]: req.body.capacity },
      },
      attributes: ["idRoom", "typeRoom", "capacity", "nameRoom"],
      raw: true,
    });
    return res.status(200).send(availableRoom);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      code: 400,
      message:
        (error.errors && error.errors[0].message) || "Something went wrong",
      api: "search-room ",
      method: "POST",
    });
  }
};

const CreateRoom = async (req, res) => {
  const { typeRoom, nameRoom, capacity } = req.body;
  try {
    const response = await Room.create({ typeRoom, nameRoom, capacity });
    return res
      .status(201)
      .send({ response, message: "Room created succefully" });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: error.errors[0].message || "Can't create room try again",
      code: 400,
      api: "rooms",
      method: "POST",
    });
  }
};

const UpdateRoom = async (req, res) => {
  try {
    const response = await Room.update(req.body, {
      where: {
        idRoom: req.params.id,
      },
    });
    return res
      .status(201)
      .send({ response, message: "Room updated succefully" });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "Can't update room",
      code: 400,
      api: "room",
      method: "PATCH",
    });
  }
};

const DeleteRoom = async (req, res) => {
  try {
    await Room.destroy({
      where: {
        idRoom: req.params.id,
      },
    });
    return res
      .status(200)
      .send({ id: req.params.id, message: "Room deleted succefully" });
  } catch (error) {
    return res.status(400).json({
      error: "Error",
      api: "users",
      message: "Something went wrong try again!",
      method: "DELETE",
    });
  }
};

module.exports = {
  GetRoom,
  CreateRoom,
  SearchRoom,
  UpdateRoom,
  DeleteRoom,
  GetRoomByName,
};
