import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  signOut,
  updatePassword,
  sendPasswordResetEmail,
  getAdditionalUserInfo,
} from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { auth, firestoreDb, fbDatabase } from "../../config/firebase";
import { DB_BASE_PATH } from "../../constant";
import { agentDefaultValue } from "../../constant/formDefaultValues";
import {
  createAgentAction,
  getAgentByIdAction,
} from "../../helpers/agentUtils";

const initialState = {
  isLoggedIn: false,
  user: null,
  loading: true,
  userProfileStatus: null, //
};

export const updateUsername = createAsyncThunk(
  "auth/updateUsername",
  async ({ username, uid }, thunkApi) => {
    try {
      const docRef = doc(firestoreDb, "users", uid);
      const res = await updateDoc(docRef, { username });
      const userData = await thunkApi.dispatch(getUserData(uid));
      return userData;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message || "Couldn't Login");
    }
  }
);
export const getUserData = createAsyncThunk(
  "auth/getUserData",
  async (_, thunkApi) => {
    
    return null
  }
);

export const onUserSnapshot = createAsyncThunk(
  "auth/onUserSnapshot",
  (uid, { dispatch }) => {
    let unsubDoc;
    const docRef = doc(firestoreDb, "users", uid);
    unsubDoc = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists) {
          const data = snapshot.data();
          dispatch(updateUserData(data));
        }
      },
      (error) => {
        console.log(`error`, error);
      }
    );
    return unsubDoc;
  }
);
export const signupAction = createAsyncThunk(
  "auth/signup",
  async (
    { email, password, phoneNumber, username, userRole = "user" },
    thunkApi
  ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const docRef = doc(firestoreDb, "users", user?.uid);

      await setDoc(docRef, {
        uid: user?.uid,
        email: user?.email,
        username,
        userRole: userRole,
        status: "active",
        phoneNumber,
      });

      if (userRole === "agent") {
        await createAgentAction({
          ...agentDefaultValue,
          fleet_id_: user?.uid,
          email_: user?.email,
          phone_: phoneNumber,
        });
      }

      const userData = await thunkApi.dispatch(getUserData(user?.uid));
      thunkApi.dispatch(updateAuthLoading(false));
      return userData;
    } catch (err) {
      console.log(`[err-auth-signup]`, err);
      return thunkApi.rejectWithValue(err.message || "Couldn't signup user");
    }
  }
);
export const authWithGoogleAction = createAsyncThunk(
  "auth/signup",
  async (_, thunkApi) => {
    try {
      const userRole = "user";
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const additionalUserInfo = getAdditionalUserInfo(result);
      const { user } = result;
      if (additionalUserInfo?.isNewUser) {
        console.log(`isNewUser`);
        const docRef = doc(firestoreDb, "users", user?.uid);

        await setDoc(docRef, {
          uid: user?.uid,
          email: user?.email,
          username: user?.displayName || "N/A",
          fullname: user?.displayName || "N/A",
          role: userRole,
          photoURL: user?.photoURL || "",
          status: "onboarding",
          statusDetails: ONBOARDING_STEPS.WELCOME, // welcome | room | feedback
        });
      }
      const userData = await thunkApi.dispatch(getUserData(user?.uid));
      thunkApi.dispatch(updateAuthLoading(false));
      return userData;
    } catch (err) {
      console.log(`err`, err);
      thunkApi.dispatch(updateAuthLoading(false));
      return thunkApi.rejectWithValue(err.message || "Couldn't signup user");
    }
  }
);

export const loginPasswordlessAction = createAsyncThunk(
  "auth/loginPasswordlessAction",
  async (data, thunkApi) => {
    try {
      const user = auth.currentUser;
      if (!user && !data?.email) {
        toast.error("Please login with email");
        thunkApi.dispatch(logoutAction());
        return;
      }
      const userEmail = user?.email || data?.email;
      const actionCodeSettings = {
        url: VERIFYING_CALLBACK_URL,
        handleCodeInApp: true,
      };
      window.localStorage.setItem("emailForSignIn", userEmail);
      await sendSignInLinkToEmail(auth, userEmail, actionCodeSettings);
      return;
    } catch (err) {
      console.log(`err`, err);
      return thunkApi.rejectWithValue(err || "Couldn't Login");
    }
  }
);
export const verifyPasswordlessAction = createAsyncThunk(
  "auth/verifyPasswordlessAction",
  async (url, thunkApi) => {
    try {
      if (isSignInWithEmailLink(auth, url)) {
        let email = window.localStorage.getItem("emailForSignIn");

        // If missing email, prompt user for it
        if (!email) {
          email = window.prompt("Please provide your email for confirmation");
        }

        // Signin user and remove the email localStorage
        const result = await signInWithEmailLink(auth, email, url);
        const additionalUserInfo = getAdditionalUserInfo(result);
        const { user } = result;
        if (additionalUserInfo?.isNewUser) {
          const docRef = doc(firestoreDb, "users", user?.uid);

          await setDoc(docRef, {
            uid: user?.uid,
            email: user?.email,
            username: user?.displayName || "",
            fullname: user?.displayName || "N/A",
            role: "user",
            photoURL: user?.photoURL || "",
            status: "onboarding",
            statusDetails: ONBOARDING_STEPS.WELCOME, // welcome | room | feedback
          });
        }
        const userData = await thunkApi.dispatch(getUserData(user?.uid));

        window.localStorage.removeItem("emailForSignIn");
        return userData;
      }
      return;
    } catch (err) {
      console.log(`err`, err);
      return thunkApi.rejectWithValue(err?.message || "Couldn't Login");
    }
  }
);
export const loginAction = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkApi) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      thunkApi.dispatch(updateAuthLoading(false));
      return user;
    } catch (err) {
      console.log(`err`, err);
      return thunkApi.rejectWithValue(err || "Couldn't Login");
    }
  }
);
export const logoutAction = createAsyncThunk(
  "auth/logout",
  async (_, thunkApi) => {
    try {
      await signOut(auth);
      console.log("logout successfully");
      return null;
    } catch (err) {
      return thunkApi.rejectWithValue(err.message || "Couldn't Logout");
    }
  }
);
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (password, thunkApi) => {
    try {
      const user = auth.currentUser;
      await updatePassword(user, password);
      return true;
    } catch (err) {
      return thunkApi.rejectWithValue(err || "Couldn't Change Password");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email, thunkApi) => {
    try {
      return await sendPasswordResetEmail(auth, email);
    } catch (err) {
      toast.error(err.message);
      return thunkApi.rejectWithValue(
        err.message || "Couldn't Send Password Reset Email"
      );
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateRedirectUrl: (state, action) => {
      state.redirectUrl = action.payload;
    },
    updateUserData: (state, action) => {
      state.user = action.payload;
    },
    updateAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    updatePhotoURL: (state, action) => {
      state.user.photoURL = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.fulfilled, (state, action) => {
        const data = action.payload;
        state.user = data;
        state.isLoggedIn = !!action.payload;
        state.loading = false;
      })
      .addCase(getUserData.rejected, (state) => {
        console.log(`getUserData.rejected`, action);
        state.user = null;
        state.isLoggedIn = false;
        state.loading = false;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
      })
      .addCase(loginAction.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

// Selectors
export const getAuthState = (state) => state.auth;
export const useAuthSelector = () => useSelector(getAuthState);
// Reducers and actions
export const {
  updateRedirectUrl,
  updateUserData,
  updateAuthLoading,
  updatePhotoURL,
} = authSlice.actions;

export default authSlice.reducer;
