import axios from "axios";

const API_URL = "http://localhost:5000/user/";

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("whereAt");
};

const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);
  localStorage.setItem("user", JSON.stringify(response.data));
  localStorage.setItem(
    "whereAt",
    JSON.stringify(response.data.user.Role.Menu[0])
  );
  return response.data;
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
