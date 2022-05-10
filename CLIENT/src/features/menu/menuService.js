import axios from "axios";

const API_URL = "http://localhost:5000/menu";

const getAllMenus = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

const postMenu = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, data, config);
  return response.data;
};

const updateMenu = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.patch(API_URL + "/" + data.id, data, config);
  return response.data;
};

const deleteMenu = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + "/" + data, config);
  return response.data;
};

const roleService = { getAllMenus, postMenu, updateMenu, deleteMenu };

export default roleService;
