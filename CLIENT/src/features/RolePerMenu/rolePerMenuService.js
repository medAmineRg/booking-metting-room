import axios from "axios";

const API_URL = "http://localhost:5000/role-permission-menu";

const getRolePerMenu = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

const postRolePerMenu = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, data, config);
  return response.data;
};

const updateRolePerMenu = async ({ id, nameRole }, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.patch(API_URL + "/" + id, { nameRole }, config);
  return response.data;
};

const deleteRolePerMenu = async (body, token) => {
  // axios.defaults.headers.common["Authorization"] = token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { body },
  };
  const response = await axios.delete(API_URL, config);
  return response.data;
};

const rolePerMenuService = {
  getRolePerMenu,
  postRolePerMenu,
  updateRolePerMenu,
  deleteRolePerMenu,
};

export default rolePerMenuService;
