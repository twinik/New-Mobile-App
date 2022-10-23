import {
  ref,
  limitToLast,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { fbDatabase } from "../config/firebase";
import { DB_BASE_PATH } from "../constant";

export async function uploadImageAsync(path, uri) {
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

//  Fecth all taks with status_ = created limit last (200)
export async function getRecentTasks(uid) {
  try {
    const path = `${DB_BASE_PATH}/tasks`;
    const queryRef = query(
      ref(fbDatabase, path),
      orderByChild("datetime_start_before_"),

      limitToLast(200)
    );
    const res = await get(queryRef);
    return res.exists() ? Object.values(res.val()) : [];
  } catch (err) {
    console.log(err);
  }
}
