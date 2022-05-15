import axios from "axios";

const API_URL = "http://localhost:5000/role";

const getAllRoles = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

const postRole = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, data, config);
  return response.data;
};

const updateRole = async ({ id, nameRole }, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(API_URL + "/" + id, { nameRole }, config);
  return response.data;
};

const deleteRole = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + "/" + data, config);
  return response.data;
};

const roleService = { getAllRoles, postRole, deleteRole, updateRole };

export default roleService;
