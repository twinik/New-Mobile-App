import axios from "axios";
const API = "http://10.0.2.2:3000/Task";
import { auth } from "../config/firebase";

export const getTasks = async () => {
  const token = await auth.currentUser.getIdToken();
  try {
    const response = await axios.get(`${API}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTask = async (id, task) => {
  try {
    const response = await axios.put(`${API}/${id}`, task);
    return response.data;
  } catch (error) {
    console.error(error.response.data);
  }
};
