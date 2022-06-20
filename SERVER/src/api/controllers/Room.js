const Room = require("../models/Room");
const { Op } = require("sequelize");
const { checkDate } = require("../helpers/bookingHelper");
const { getRoomByName } = require("../services/roomEntity");
const { getFreeRooms } = require("../services/bookingEntity");

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
  if (!req.body.capacity || req.body.capacity <= 1 || isNaN(req.body.capacity)) {
    return res.status(400).json({
      status: "Error",
      code: 400,
      message: "Room capacity must be greater than 1.",
      api: "search-room",
      method: "POST",
    });
  }
  try {
    const freeRooms = await getFreeRooms(req.body.start, req.body.end, req.body.capacity)
    return res.status(200).send({freeRooms,status: "OK",
    code: 200,
    message: `${freeRooms.length} room found`,
    api: "search-room",
    method: "get", });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "Error",
      code: 400,
      message:
        "Something went wrong",
      api: "search-room ",
      method: "POST",
    });
  }
};

const CreateRoom = async (req, res) => {
  let { typeRoom, nameRoom, capacity } = req.body;
  try {
    capacity = Number(capacity);
    const response = await Room.create({ typeRoom, capacity, nameRoom });
    return res
      .status(201)
      .send({ response, message: "Room created succefully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "Error",
      message: "Can't create room try again",
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
