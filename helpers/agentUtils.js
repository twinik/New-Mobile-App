import { ref, set, get, push, child } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { fbDatabase } from "../config/firebase";
import { DB_BASE_PATH } from "../constant";

/**
 * AGENT ACTIONS
 */
// create agent
export const createAgentAction = async (data) => {
  try {
    const createdAt = Date.now();
    const path = `${DB_BASE_PATH}/agents/${data?.fleet_id_}`;
    const pushRef = child(ref(fbDatabase), path);
    // const updatedUrl = await uploadImageAction(
    //   `${DB_BASE_PATH}/agents/${pushRef.key}/${createdAt}`,
    //   data?.fleet_image_
    // );

    const cloneData = Object.assign(data, {
      id: data.fleet_id_,
      // fleet_image_: updatedUrl,
      createdAt: createdAt,
    });

    await set(pushRef, cloneData);
    // toast.success("Agent created");
  } catch (err) {
    console.log(err);
    // toast.error("Error creating Agent");
  }
};

// UPDATE AGENT ACTION
export const updateAgentAction = async (agentId, data) => {
  try {
    const createdAt = Date.now();
    const path = `${DB_BASE_PATH}/agents/${agentId}`;
    const dbRef = ref(fbDatabase);
    const updatedUrl = await uploadImageAction(
      `${path}/${createdAt}`,
      data?.fleet_image_
    );
    // if (
    //   typeof updatedUrl !== "string" ||
    //   typeof updatedUrl === "undefined" ||
    //   updatedUrl === null
    // ) {
    //   toast.error("Error uploading image");
    //   return;
    // }
    await set(child(dbRef, path), { ...data, fleet_image_: updatedUrl });
    // toast.success("Agent updated");
  } catch (err) {
    console.log(err);
    // toast.error("Something went wrong updating Agent");
  }
};

// DELETE AGENT ACTION
export const deleteAgentAction = async (agentId) => {
  try {
    const dbRef = ref(fbDatabase);
    await set(child(dbRef, `${DB_BASE_PATH}/agents/${agentId}`), null);
    // toast.success("Agent deleted");
  } catch (err) {
    console.log(err);
    // toast.error("Something went wrong deleting Agent");
  }
};

// get agent by id

export const getAgentByIdAction = async (agentId) => {
  try {
    const dbRef = ref(fbDatabase);
    const snapshot = await get(
      child(dbRef, `${DB_BASE_PATH}/agents/${agentId}`)
    );
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};
