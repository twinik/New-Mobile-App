import axios from "axios";
const API = "https://react-ondemand-backend-hu0tq0d2u-gfalotico.vercel.app/Task";

export const getTasks = async () => {
  try {
    const response = await axios.get(`${API}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTask = async (id, task) => {
  try {
    await axios.put(`${API}/${id}`, task);
  } catch (error) {
    console.error(error.response.data);
  }
  
}
