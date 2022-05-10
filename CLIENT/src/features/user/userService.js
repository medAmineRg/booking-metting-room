import axios from "axios";

const API_URL = "http://localhost:5000/users";

const getAllUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

const createUser = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + "/add", data, config);

  return response.data;
};

const updateUser = async (data, token) => {
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

const activeAccount = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + "/" + id + "/active", id, config);
  return response.data;
};

const deleteUser = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + "/" + id, config);
  return response.data;
};

const userService = {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  activeAccount,
};

export default userService;
