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
import babelConfig from "../babel.config";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryColor}}>
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
          source={require("../assets/logo_dummy.png")}
          style={{
            //height: 135.0,
            //width: "90%",
            resizeMode: "contain",
            //marginBottom: Sizes.fixPadding * 4.0,
          }}
        />
        <Text
          style={{
            ...Fonts.primaryColor18Bold,
            textAlign: "center",
            marginTop: 0,
          }}
        >
          O N D E M A N D
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
