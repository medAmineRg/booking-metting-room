import axios from "axios";

const API_URL = "http://localhost:5000/video-call";

const getAllVirtualRooms = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const videoService = {
  getAllVirtualRooms,
};

export default videoService;
