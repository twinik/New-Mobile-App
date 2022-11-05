import axios from "axios";
const API = "https://nameless-bastion-86978.herokuapp.com/Task";
import { auth } from "../config/firebase";

function formatDate(date) {
  var d = date,
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export const getTasks = async (params) => {
  const token = await auth.currentUser.getIdToken();

  let date;
  let realToday;

  if (params?.date) {
    date = new Date(formatDate(params.date));
    realToday = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  }

  try {
    console.log("token", token);
    const response = await axios.get(`${API}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        ...{
          ...(params.agents.length != 0 && {
            agents: JSON.stringify(params.agents),
          }),
          ...(params.teams.length != 0 && {
            teams: JSON.stringify(params.teams),
          }),
          ...(params?.date && { date: realToday.toISOString() }),
          ...(params?.taskStatus.length != 0 && {
            status: JSON.stringify(params.taskStatus),
          }),
          ...(params?.templates.length != 0 && {
            templates: JSON.stringify(params.templates),
          }),
        },
      },
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
