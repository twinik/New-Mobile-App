import { ref, set, get, push, child } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { fbDatabase } from "../config/firebase";

export const createTemplateAction = async (data) => {
  try {
    const templateRef = ref(fbDatabase, "templates");
    const newTemplateRef = push(templateRef);
    const templateData = Object.assign(
      { templateId: newTemplateRef.key },
      data
    );
    console.log("templateData", templateData);
    await set(newTemplateRef, templateData);
    toast.success("Template created");
  } catch (err) {
    console.log(err);
    toast.error("Error creating template");
  }
};
export const getTemplatesAction = async (data) => {
  try {
    const dbRef = ref(fbDatabase);
    const snapshot = await get(child(dbRef, `templates`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data);
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteTemplateAction = async (templateId) => {
  try {
    const dbRef = ref(fbDatabase);
    await set(child(dbRef, `templates/${templateId}`), null);
    toast.success("Template deleted");
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong deleting template");
  }
};

export const duplicateTemplateAction = async (templateId) => {
  try {
    const dbRef = ref(fbDatabase);
    const snapshot = await get(child(dbRef, `templates/${templateId}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const newTemplateRef = push(child(dbRef, `templates`));
      const templateData = Object.assign(data, {
        templateId: newTemplateRef.key,
        template_name: data?.template_name + " (copy)",
      });
      await set(newTemplateRef, templateData);
      toast.success("Template duplicated");
    } else {
      toast.error("Template does not exist");
    }
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong duplicating template");
  }
};

export const updateTemplateAction = async (templateId, data) => {
  try {
    const dbRef = ref(fbDatabase);
    await set(child(dbRef, `templates/${templateId}`), data);
    toast.success("Template updated");
  } catch (err) {
    console.log(err);
    toast.error("Something went wrong updating template");
  }
};

export async function uploadImageAsync(uri, path) {
  try {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log("XHR", e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    // uuid.v4() is used to generate a unique filename
    const fileRef = storageRef(getStorage(), path);
    const result = await uploadBytes(fileRef, blob);
    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  } catch (err) {
    console.log("[uploadImageAsync]", err);
  }
}

export async function removeImageAsync(path) {
  const fileRef = storageRef(getStorage(), path);
  return deleteObject(fileRef);
}

// TASK FUNCTIONS
export const createTaskAction = async (data, uid) => {
  try {
    const taskRef = ref(fbDatabase, `tasks/${uid}`);
    const newTaskRef = push(taskRef);
    const taskData = Object.assign({ taskId: newTaskRef.key, uid }, data);
    await set(newTaskRef, taskData);
    return taskData;
  } catch (err) {}
};

export const updateTaskAction = async (data) => {
  try {
    if (!data?.taskId || !data?.uid) {
      alert("Task ID or User ID not found");
      return;
    }
    const { taskId, uid } = data;
    const dbRef = ref(fbDatabase);
    await set(child(dbRef, `tasks/${uid}/${taskId}`), data);
    return data;
  } catch (err) {
    alert("Something went wrong updating task");
  }
};
