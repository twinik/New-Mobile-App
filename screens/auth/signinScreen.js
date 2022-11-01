import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { Fragment, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ImageBackground,
  Alert,
} from "react-native";
import { ThemeColors, withNavigation } from "react-navigation";
import CollapsingToolbar from "../../components/sliverAppBar";
import { Fonts, Sizes, Colors } from "../../constant/styles";
import { Input } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { getUserData, loginAction } from "../../redux/slices/authSlice";

export default function SigninScreen({ navigation }) {
  const dispatch = useDispatch();
  const [passwordVisible, setpasswordVisible] = React.useState(false);
  const [passwordFocus, setpasswordFocus] = React.useState(false);
  const [usernameFocus, setusernameFocus] = React.useState(false);

  const [email, setEmail] = React.useState("antonio.salguero@agnitu.com");
  const [password, setPassword] = React.useState("Antonio1.");

  const onHandleLogin = async () => {
    //console.log(email, password)
    if (email !== "" && password !== "") {
      try {
        await dispatch(loginAction({ email, password })).unwrap();
        navigation.navigate("BottomTabBar");
      } catch (err) {
        console.log("[login]", err.message);
        if (err.message.includes("auth/invalid-email")) {
          Alert.alert(
            "invlid email or wrong password, please check and try again."
          );
        } else if (err.message.includes("network-request-failed")) {
          Alert.alert(
            "Network error",
            "Try again later or check your internet connection."
          );
        } else {
          Alert.alert("Unknown Error", "Try again later.");
        }
      }
    } else {
      alert("email and password must be filled!");
    }
  };

  return (
    <Fragment>
      <ImageBackground
        style={{ height: 200 }}
        source={require("../../assets/images/bgmain.png")}
      >
        <Text
          style={{ ...Fonts.primaryColor30Medium, top: 120, marginLeft: 30 }}
        >
          Let's get started.
        </Text>
      </ImageBackground>

      <ScrollView
        style={{
          flex: 1,
          paddingVertical: Sizes.fixPadding * 5.0,
          paddingHorizontal: Sizes.fixPadding * 2.0,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          backgroundColor: "white",
          //borderColor:Colors.primaryColor,
          //borderWidth :4,
          marginTop: -20,
          zIndex: 2,
        }}
      >
        <Text
          style={{
            ...Fonts.lightGrayColor14Medium,
            textAlign: "center",
            top: -20,
            marginBottom: 10,
          }}
        >
          | Login with email and password |
        </Text>

        {userNameTextField()}
        {passwordTextField()}
        {signinButton()}
        {signUpText()}
      </ScrollView>
    </Fragment>
  );

  function forgotPasswordText() {
    return (
      <Text style={{ ...Fonts.blackColor14Regular, textAlign: "center" }}>
        Forgot your password?
      </Text>
    );
  }

  function signUpText() {
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            ...Fonts.blackColor14Regular,
            textAlign: "center",
            marginTop: Sizes.fixPadding - 5.0,
            marginBottom: Sizes.fixPadding,
          }}
        >
          Don't have an account?
        </Text>
        <Text
          style={{
            ...Fonts.primaryColor16Bold,
            textAlign: "center",
            marginTop: Sizes.fixPadding - 15.0,
            marginBottom: Sizes.fixPadding,
          }}
          onPress={() => navigation.navigate("Signup")}
        >
          Sign up
        </Text>
      </View>
    );
  }

  function signinButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          onHandleLogin();
        }}
        style={styles.signinButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor17Regular }}>Login</Text>
      </TouchableOpacity>
    );
  }

  function passwordTextField() {
    return (
      <Input
        autoCapitalize="none"
        placeholder="Password"
        secureTextEntry={passwordVisible ? false : true}
        style={{ ...Fonts.black17Regular }}
        inputContainerStyle={{
          borderBottomColor: passwordFocus ? Colors.primaryColor : "#898989",
        }}
        rightIcon={
          <MaterialIcons
            name="remove-red-eye"
            size={24}
            color={passwordFocus ? Colors.primaryColor : "#898989"}
            onPress={() => setpasswordVisible(true)}
          />
        }
        onFocus={() => setpasswordFocus(true)}
        onBlur={() => setpasswordFocus(true)}
        onChangeText={(text) => setPassword(text)}
      />
    );
  }

  function userNameTextField() {
    return (
      <Input
        autoCapitalize="none"
        placeholder="email"
        inputContainerStyle={{
          borderBottomColor: usernameFocus ? Colors.primaryColor : "#898989",
        }}
        style={{ ...Fonts.black17Regular }}
        onFocus={() => setusernameFocus(true)}
        onBlur={() => setusernameFocus(true)}
        onChangeText={(text) => setEmail(text.trim().toLowerCase())}
      />
    );
  }
}

const styles = StyleSheet.create({
  signinButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 5.0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Sizes.fixPadding - 5.0,
    marginVertical: Sizes.fixPadding + 5.0,
  },
  loginWithFacebookButtonStyle: {
    flexDirection: "row",
    backgroundColor: "#3B5998",
    paddingVertical: Sizes.fixPadding + 3.0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding * 3.5,
  },
  loginWithGoogleButtonStyle: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: Sizes.fixPadding + 3.0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding - 5.0,
    marginTop: Sizes.fixPadding * 2.5,
  },
});

SigninScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};
