import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { database } from "../../config/firebase";
import React, { Component, useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { withNavigation } from "react-navigation";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { TabView, TabBar } from "react-native-tab-view";

import OpenTasks from "./components/OpenTasks";
import MyTasks from "./components/MyTasks";
import HistoryTasks from "./components/HistoryTasks";

import { useDispatch } from "react-redux";
import Headerx from "./header";
import BottomSheetComponente from "./BottomSheet";
import { getAgentTasksAction } from "../../redux/slices/taskSlice";
import { logoutAction } from "../../redux/slices/authSlice";

const { width } = Dimensions.get("screen");

const OrdersScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      dispatch(getAgentTasksAction());
      console.log("getAgentTasksAction");
    })();
  }, []);

  function AddTaskButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        // onPress={() => {
        //     if (darkMapStyle==false){ setdarkMapStyle(true); }
        //     else { setdarkMapStyle(false)  }
        // }}
        style={{
          bottom: 100.0,
          ...styles.iconWrapStyle,
        }}
      >
        <MaterialCommunityIcons
          name="plus"
          size={27}
          color={Colors.whiteColor}
          onPress={() => navigation.navigate("NewTask")}
        />
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <Headerx />

      <Orders navigation={navigation} />
      <BottomSheetComponente />
      <AddTaskButton />
    </SafeAreaView>
  );
};

const Orders = ({ navigation }) => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Open " },
    { key: "second", title: "My Tasks " },
    { key: "third", title: "History" },
  ]);

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case "first":
        return <OpenTasks navigation={navigation} />;
      case "second":
        return <MyTasks navigation={navigation} />;
      case "third":
        return <HistoryTasks navigation={navigation} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: Colors.primaryColor,
              height: 3.0,
            }}
            tabStyle={{
              width: width / 3.0,
            }}
            scrollEnabled={true}
            style={{ backgroundColor: "white" }}
            renderLabel={({ route, focused, color }) => (
              <Text
                style={
                  focused
                    ? {
                        ...Fonts.primaryColor16Medium,
                      }
                    : {
                        ...Fonts.grayColor14Medium,
                      }
                }
              >
                {route.title}
              </Text>
            )}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: "row",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.whiteColor,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding + 5.0,
  },
  specialistInfoContainer: {
    height: 100.0,
    width: 120.0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: Colors.lightGray,
    borderWidth: 1.0,
    marginHorizontal: 10.0,
    marginVertical: 1.0,
    borderRadius: 15,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5.0,
  },
  surveIconAndCloseButtonWrapStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: Sizes.fixPadding * 2.0,
    alignItems: "center",
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 31,
    backgroundColor: Colors.primaryColor,
    position: "absolute",
    bottom: 75,
    right: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1.5,
    shadowRadius: 5,
    elevation: 5,
  },
  plus: {
    fontSize: 30,
    color: "#fff",
    position: "absolute",
    top: 2,
    left: 16,
  },
  iconWrapStyle: {
    position: "absolute",
    right: 20.0,
    backgroundColor: Colors.primaryColor,
    elevation: 3.0,
    width: 60.0,
    height: 60.0,
    borderRadius: 30.0,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapStyle2: {
    position: "absolute",
    left: 20.0,
    backgroundColor: Colors.whiteColor,
    elevation: 3.0,
    width: 60.0,
    height: 60.0,
    borderRadius: 30.0,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default withNavigation(OrdersScreen);
