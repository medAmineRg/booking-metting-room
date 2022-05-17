import axios from "axios";

const API_URL = "http://localhost:5000/room";

const getAllRooms = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

const getRoomByName = async (name, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + `/${name}`, config);
  return response.data;
};

const getAvailableRooms = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + "/search-room", data, config);
  return response.data;
};

const createRoom = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, data, config);
  return response.data;
};

const updateRoom = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { id } = data;
  delete data.id;

  const response = await axios.patch(API_URL + "/" + id, data, config);
  return response.data;
};

const deleteRoom = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + "/" + id, config);
  return response.data;
};

const roomService = {
  getAllRooms,
  getRoomByName,
  getAvailableRooms,
  createRoom,
  updateRoom,
  deleteRoom,
};

export default roomService;
