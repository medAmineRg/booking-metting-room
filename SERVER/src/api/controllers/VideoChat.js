const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { createRoom, getRoom } = require("../helpers/videoHelper");
const API_KEY = process.env.daily_API_KEY;
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Bearer " + API_KEY,
};
const getAllVirtualRooms = async (req, res) => {
  try {
    const result = await fetch("https://api.daily.co/v1/rooms", {
      headers,
    });
    const data = await result.json();
    return res.status(200).send(data);
  } catch (error) {
    return res.status(400).send({
      status: "Error",
      message: "something went wrong try again!",
      code: 400,
      method: "GET",
      api: "/video-call",
    });
  }
};

const call = async (req, res) => {
  const roomId = req.params.id;

  const room = await getRoom(roomId);
  if (room.error) {
    const newRoom = await createRoom(roomId);
    res.status(200).send(newRoom);
  } else {
    res.status(200).send(room);
  }
};

module.exports = { call, getAllVirtualRooms };
