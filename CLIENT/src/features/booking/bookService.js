import axios from "axios";

const API_URL = "http://localhost:5000/bookings";

const getBooking = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + "/all", config);
  return response.data;
};

const createBooking = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, data, config);
  return response.data;
};

const filterBooking = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { idUser, idRoom } = data;
  const API_FILTER =
    "/" + (idUser ? idUser : "none") + "/" + (idRoom ? idRoom : "none");
  const response = await axios.get(API_URL + API_FILTER, config);
  return response.data;
};

const updateBooking = async (data, token) => {
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

const deleteBooking = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + "/" + id, config);
  return response.data;
};

const bookService = {
  getBooking,
  createBooking,
  filterBooking,
  updateBooking,
  deleteBooking,
};

export default bookService;
