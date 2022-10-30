import axios from "axios";
const API = "http://10.0.2.2:3000";
import { auth } from "../config/firebase";

export const getUserData = async () => {
    const token = await auth.currentUser.getIdToken();
    const uid = await auth.currentUser.uid;
    try {
      const response = await axios.get(`${API}/UserData/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };