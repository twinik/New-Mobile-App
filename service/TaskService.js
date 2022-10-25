import axios from "axios";
const API = "https://react-ondemand-backend-edyl1z4ty-gfalotico.vercel.app";

export const getTasks = async () => {
  try {
    const response = await axios.get(`${API}/Task`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
