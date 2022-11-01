import axios from "axios";
const API = "https://nameless-bastion-86978.herokuapp.com/Task";
import { auth } from "../config/firebase";

export const getTasks = async () => {
  const token = await auth.currentUser.getIdToken();
  try {
    console.log("token", token);
    const response = await axios.get(`${API}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
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
