import React, { Component, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  Image,
  ImageBackground,
  Text,
} from "react-native";
import { withNavigation } from "react-navigation";
import { Fonts, Colors, Sizes } from "../constant/styles";
import { Bounce } from "react-native-animated-spinkit";
import LottieView from "lottie-react-native";
import { auth } from "../config/firebase";
import { useDispatch } from "react-redux";
import { getUserData } from "../redux/slices/authSlice";

const image = "../assets/images/bgmain.png";
const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  setTimeout(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(getUserData(user.uid))
          .unwrap()
          .then(() => {
            navigation.navigate("BottomTabBar");
          });
      } else {
        navigation.navigate("Signin");
      }
    });
  }, 3000);

  const image = "../";
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LottieView
          style={{}}
          source={require("../assets/animations/100485-circle-waves-white-dots.json")}
          autoPlay
          speed={1}
          loop={true}
        />

        <Image
          source={require("../assets/agnitu_logo.png")}
          style={{
            height: 135.0,
            width: "60%",
            resizeMode: "contain",
            //marginBottom: Sizes.fixPadding * 4.0,
          }}
        />
        <Text
          style={{
            ...Fonts.primaryColor18Bold,
            textAlign: "center",
            marginTop: -40,
          }}
        >
          F I E L D | W O R K F O R C E
        </Text>
      </View>
    </SafeAreaView>
  );
};

SplashScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default withNavigation(SplashScreen);
