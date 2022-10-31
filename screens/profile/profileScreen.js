import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Dialog from "react-native-dialog";
import { TransitionPresets } from "react-navigation-stack";
import { auth } from "../../config/firebase";
import { useQueryClient } from "@tanstack/react-query";

const { width } = Dimensions.get("screen");
class ProfileScreen extends Component {
  state = {
    logoutDialog: false,
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <StatusBar backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1 }}>
          {this.header()}
          {this.userInfo()}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: "#F4F4F4" }}
          >
            {this.settingsInfo()}
            {this.logOutInfo()}
          </ScrollView>
        </View>
        {this.logoutDialog()}
      </SafeAreaView>
    );
  }

  handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("Sign-out successful");
      this.props.navigation.navigate("Loading");
    } catch (e) {
      console.log(e);
    }
  };

  logoutDialog() {
    return (
      <Dialog.Container
        visible={this.state.logoutDialog}
        contentStyle={styles.dialogContainerStyle}
      >
        <View style={{ backgroundColor: "white", alignItems: "center" }}>
          <Text
            style={{
              ...Fonts.blackColor19Medium,
              paddingBottom: Sizes.fixPadding - 5.0,
            }}
          >
            You sure want to logout?
          </Text>
          <View style={styles.cancelAndLogoutButtonWrapStyle}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.setState({ logoutDialog: false })}
              style={styles.cancelButtonStyle}
            >
              <Text style={{ ...Fonts.blackColor18Medium }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                this.setState({ logoutDialog: false });
                this.handleSignOut();
              }}
              style={styles.logOutButtonStyle}
            >
              <Text style={{ ...Fonts.whiteColor18Medium }}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Dialog.Container>
    );
  }

  logOutInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.setState({ logoutDialog: true })}
        style={styles.logOutInfoWrapStyle}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="login-variant"
            size={27}
            color={Colors.grayColor}
          />
          <Text
            style={{
              ...Fonts.blackColor16Medium,
              marginLeft: Sizes.fixPadding + 5.0,
              width: width / 1.8,
            }}
          >
            Logout
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={18}
          color={Colors.grayColor}
        />
      </TouchableOpacity>
    );
  }

  settingsInfo() {
    return (
      <View style={styles.settingInfoWrapStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => this.props.navigation.navigate("Notifications")}
        >
          {this.settings({
            icon: (
              <MaterialIcons
                name="notifications"
                size={25}
                color={Colors.grayColor}
              />
            ),
            setting: "Notifications",
          })}
        </TouchableOpacity>
        {this.settings({
          icon: <AntDesign name="earth" size={23} color={Colors.grayColor} />,
          setting: "Language",
        })}
        {this.settings({
          icon: (
            <MaterialIcons name="settings" size={25} color={Colors.grayColor} />
          ),
          setting: "Settings",
        })}
        {this.settings({
          icon: (
            <MaterialIcons
              name="group-add"
              size={27}
              color={Colors.grayColor}
            />
          ),
          setting: "Invite Friends",
        })}
        {this.settings({
          icon: (
            <MaterialIcons
              name="headset-mic"
              size={25}
              color={Colors.grayColor}
            />
          ),
          setting: "Support",
        })}
      </View>
    );
  }

  settings({ icon, setting }) {
    return (
      <View style={styles.settingStyle}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {icon}
          <Text
            style={{
              ...Fonts.blackColor16Medium,
              marginLeft: Sizes.fixPadding + 5.0,
              width: width / 1.8,
            }}
          >
            {setting}
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={18}
          color={Colors.grayColor}
        />
      </View>
    );
  }

  userInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.props.navigation.navigate("EditProfile")}
        style={styles.userInfoWrapStyle}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/images/delivery_boy.jpg")}
            style={{
              width: 80.0,
              height: 80.0,
              borderRadius: Sizes.fixPadding - 5.0,
            }}
            resizeMode="cover"
          />
          <View style={styles.userInfoStyle}>
            <Text
              style={{
                ...Fonts.blackColor19Medium,
                width: width / 2.3,
              }}
            >
              John Doe
            </Text>
            <Text style={{ ...Fonts.grayColor16Medium }}>123456789</Text>
          </View>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={18}
          color={Colors.grayColor}
        />
      </TouchableOpacity>
    );
  }

  header() {
    return (
      <Text
        style={{
          ...Fonts.blackColor22Medium,
          paddingHorizontal: Sizes.fixPadding * 2.0,
          paddingVertical: Sizes.fixPadding * 2.0,
        }}
      >
        Profile
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  userInfoWrapStyle: {
    flexDirection: "row",
    marginHorizontal: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Sizes.fixPadding * 2.0,
  },
  userInfoStyle: {
    height: 80.0,
    justifyContent: "space-between",
    paddingVertical: Sizes.fixPadding,
    marginLeft: Sizes.fixPadding,
  },
  logOutInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding + 7.0,
    flexDirection: "row",
    marginVertical: Sizes.fixPadding,
    paddingLeft: Sizes.fixPadding * 2.0,
    paddingRight: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#F1F1F1",
    borderWidth: 2.0,
  },
  settingInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    margin: Sizes.fixPadding,
    paddingLeft: Sizes.fixPadding * 2.0,
    paddingRight: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    borderColor: "#F1F1F1",
    borderWidth: 2.0,
  },
  settingStyle: {
    flexDirection: "row",
    marginVertical: Sizes.fixPadding - 1.0,
    alignItems: "center",
    justifyContent: "space-between",
  },
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 90,
    alignSelf: "center",
    paddingHorizontal: Sizes.fixPadding * 3.0,
    paddingTop: -Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding * 2.0,
  },
  cancelButtonStyle: {
    flex: 0.5,
    backgroundColor: "#E0E0E0",
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding,
    marginRight: Sizes.fixPadding + 5.0,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Sizes.fixPadding + 5.0,
  },
  cancelAndLogoutButtonWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding * 2.0,
  },
});

ProfileScreen.navigationOptions = () => {
  return {
    header: () => null,
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default withNavigation(ProfileScreen);
