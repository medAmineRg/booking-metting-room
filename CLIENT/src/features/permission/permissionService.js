import axios from "axios";
const API_URL = "http://localhost:5000/permission";

const getAllPermissions = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const createPermission = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, data, config);
  return response.data;
};

const updatePermission = async ({ id, perName }, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(API_URL + "/" + id, { perName }, config);
  return response.data;
};

const deletePermission = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + "/" + data, config);
  return response.data;
};

const permissionService = {
  getAllPermissions,
  createPermission,
  deletePermission,
  updatePermission,
};

export default permissionService;
