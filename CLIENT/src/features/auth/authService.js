import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/users/";

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
  return response.data;
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
