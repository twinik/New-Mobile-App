import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ImageBackground,
  Alert,
  Dimensions,
} from "react-native";
import { Fonts, Sizes, Colors } from "../../constant/styles";
import { Input } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import IntlPhoneInput from "react-native-intl-phone-input";
import SelectDropdown from "react-native-select-dropdown";

import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signupAction } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const { width } = Dimensions.get("screen");

export default function SigninScreen({ navigation }) {
  const dispatch = useDispatch();
  const [passwordVisible, setpasswordVisible] = React.useState(false);
  const [passwordFocus, setpasswordFocus] = React.useState(false);
  const [usernameFocus, setusernameFocus] = React.useState(false);
  const [phoneNumber, setphoneNumber] = React.useState(false);
  const [project, setproject] = React.useState("");

  const [email, setEmail] = React.useState("antonio.salguero@agnitu.com");
  const [password, setPassword] = React.useState("Antonio1.");

  const onHandleSingup = async () => {
    //console.log(email, password)
    if (email !== "" && password !== "" && phoneNumber !== "") {
      try {
        const name = email.split("@")[0];
        await dispatch(
          signupAction({
            email,
            password,
            phoneNumber,
            username: name,
            userRole: "agent",
          })
        ).unwrap();
      } catch (err) {
        const msg = err;
        if (msg.includes("auth/invalid-email")) {
          Alert.alert(
            "invlid email or wrong password, please check and try again."
          );
        } else if (msg.includes("network-request-failed")) {
          Alert.alert(
            "Network error",
            "Try again later or check your internet connection."
          );
        } else if (msg.includes("auth/email-already-in-use")) {
          Alert.alert("Email already in use");
        } else {
          Alert.alert("Unknown Error", "Try again later.");
        }
      }
    } else {
      alert("All fileds are mandatories.. try again");
    }
  };

  const accountTypeList = [
    "DEFAULT",
    "AXIS BANK",
    "CITI BANK",
    "FEDERAL BANK LTD.",
    "HDFC BANK LTD",
    "KOTAK MAHINDRA BANK",
    "OTHER BANKS",
    "DEFAULT",
    "AXIS BANK",
    "CITI BANK",
    "FEDERAL BANK LTD.",
    "HDFC BANK LTD",
    "KOTAK MAHINDRA BANK",
    "OTHER BANKS",
    "DEFAULT",
    "AXIS BANK",
    "CITI BANK",
    "FEDERAL BANK LTD.",
    "HDFC BANK LTD",
    "KOTAK MAHINDRA BANK",
    "OTHER BANKS",
    "DEFAULT",
    "AXIS BANK",
    "CITI BANK",
    "FEDERAL BANK LTD.",
    "HDFC BANK LTD",
    "KOTAK MAHINDRA BANK",
    "OTHER BANKS",
    "DEFAULT",
    "AXIS BANK",
    "CITI BANK",
    "FEDERAL BANK LTD.",
    "HDFC BANK LTD",
    "KOTAK MAHINDRA BANK",
    "OTHER BANKS",
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        style={{ height: 130 }}
        source={require("../../assets/images/bgmain.png")}
      >
        <Text
          style={{ ...Fonts.primaryColor30Medium, top: 60, marginLeft: 30 }}
        >
          Create new account
        </Text>
      </ImageBackground>

      <View
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
        <Input
          keyboardType="email-address"
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
              onPress={() => setpasswordVisible((p) => !p)}
            />
          }
          onFocus={() => setpasswordFocus(true)}
          onBlur={() => setpasswordFocus(true)}
          onChangeText={(text) => setPassword(text)}
        />
        {/* {selectAccountTypeDropDown()} */}
        {phoneNumberTextField()}
        {signupButton()}
        {signinText()}
      </View>
    </SafeAreaView>
  );

  function selectAccountTypeDropDown() {
    return (
      <View
        style={{
          marginLeft: Sizes.fixPadding,
          marginTop: Sizes.fixPadding - 15,
          marginRight: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding + 5,
        }}
      >
        <SelectDropdown
          data={accountTypeList}
          defaultButtonText="Select Project"
          buttonTextStyle={{
            ...Fonts.lightGrayColor18Medium,
            textAlign: "left",
          }}
          buttonStyle={styles.accountTypeDropDownFieldStyle}
          renderDropdownIcon={() => (
            <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
          )}
          rowStyle={{
            borderBottomWidth: 0.0,
            height: 35.0,
          }}
          rowTextStyle={{
            marginHorizontal: Sizes.fixPadding + 5.0,
            textAlign: "left",
          }}
          onSelect={() => {}}
          buttonTextAfterSelection={(selectedItem, index) => {
            setproject(selectedItem.trim().toLowerCase());
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          dropdownStyle={{
            borderRadius: Sizes.fixPadding - 5.0,
          }}
        />
        <View style={styles.accountTypeDropDownBottomBorderStyle}></View>
      </View>
    );
  }

  function phoneNumberTextField() {
    return (
      <IntlPhoneInput
        style={{ marginLeft: Sizes.fixPadding, marginTop: Sizes.fixPadding }}
        onChangeText={({ phoneNumber }) => setphoneNumber(phoneNumber.trim())}
        defaultCountry="US"
        placeholder="Phone Number"
        containerStyle={{
          backgroundColor: Colors.whiteColor,
          borderBottomColor: "#898989",
          borderBottomWidth: 1,
          marginBottom: 40,
        }}
        dialCodeTextStyle={{ ...Fonts.primaryColor }}
        phoneInputStyle={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}
      />
    );
  }

  function forgotPasswordText() {
    return (
      <Text style={{ ...Fonts.blackColor14Regular, textAlign: "center" }}>
        Forgot your password?
      </Text>
    );
  }

  function signinText() {
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
          Already have an account?
        </Text>
        <Text
          style={{
            ...Fonts.primaryColor16Bold,
            textAlign: "center",
            marginTop: Sizes.fixPadding - 15.0,
            marginBottom: Sizes.fixPadding,
          }}
          onPress={() => navigation.navigate("Signin")}
        >
          Login
        </Text>
      </View>
    );
  }

  function signupButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          onHandleSingup();
        }}
        style={styles.signinButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor17Regular }}>Sign up</Text>
      </TouchableOpacity>
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
  phoneNumberContainerStyle: {
    backgroundColor: Colors.whiteColor,
    //borderRadius: Sizes.fixPadding,
    //marginHorizontal: Sizes.fixPadding * 2.0,
    //elevation: 1.0,
    borderBottomColor: "#898989",
    borderBottomWidth: 1,
    height: 55.0,
  },
  accountTypeDropDownFieldStyle: {
    backgroundColor: "white",
    width: width - 51,
    paddingHorizontal: -20,
    left: -8.0,
    top: Sizes.fixPadding - 10.0,
  },
  accountTypeDropDownBottomBorderStyle: {
    position: "absolute",
    bottom: 1.0,
    left: 0.0,
    right: 0.0,
    backgroundColor: "black",
    height: 0.7,
  },
});

SigninScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};
