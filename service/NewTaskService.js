import axios from "axios";
const API = "http://10.0.2.2:3000";
import { auth } from "../config/firebase";

export const createTask = async (task) => {
  const token = await auth.currentUser.getIdToken();
  try {
    const response = await axios.post(`${API}/Task`, task, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data);
    throw error;
  }
};

export const getCustomers = async () => {
  const token = await auth.currentUser.getIdToken();
  try {
    const response = await axios.get(`${API}/Customer`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTeams = async () => {
  const token = await auth.currentUser.getIdToken();
  try {
    const response = await axios.get(`${API}/Team`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTemplates = async () => {
  const token = await auth.currentUser.getIdToken();
  try {
    const response = await axios.get(`${API}/Template`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
