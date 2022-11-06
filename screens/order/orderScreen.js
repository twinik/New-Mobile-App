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
  ToastAndroid,
} from "react-native";
import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { TabView, TabBar } from "react-native-tab-view";
import Lottie from "lottie-react-native";
import OpenTasks from "./components/OpenTasks";
import MyTasks from "./components/MyTasks";
import HistoryTasks from "./components/HistoryTasks";
import { useDispatch } from "react-redux";
import Headerx from "./header";
import BottomSheetComponente from "./BottomSheet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks } from "../../service/TaskService";
import {
  getCustomers,
  getTeams,
  getTemplates,
} from "../../service/NewTaskService";
import { getUserData } from "../../service/UserService";
import { store } from "../../redux/store";

const { width } = Dimensions.get("screen");
import { useForm, FormProvider, useFormContext } from "react-hook-form";

const OrdersScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const customersQuery = useQuery(["customers"], () => getCustomers());
  const teamsQuery = useQuery(["teams"], () => getTeams());
  const templatesQuery = useQuery(["templates"], () => getTemplates());
  const userDataQuery = useQuery(["userData"], () => getUserData());
  const methods = useForm({
    defaultValues: {
      date: null,
      teams: [],
      templates: [],
      taskStatus: [],
      agents: [],
      active: false,
    },
  });

  let values = methods.watch();

  useEffect(() => {
    console.log("values", values);
  }, [values]);

  function AddTaskButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          bottom: 100.0,
          ...styles.iconWrapStyle,
        }}
        onPress={() =>
          navigation.navigate("NewTask", {
            customersQuery,
            teamsQuery,
            templatesQuery,
            userDataQuery,
          })
        }
      >
        <MaterialCommunityIcons
          name="plus"
          size={27}
          color={Colors.whiteColor}
        />
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FormProvider {...methods}>
        <StatusBar />
        <Headerx />
        <Orders navigation={navigation} />
        <BottomSheetComponente />
        <AddTaskButton />
      </FormProvider>
    </SafeAreaView>
  );
};

const Orders = ({ navigation }) => {
  const queryClient = useQueryClient();
  const { watch, getValues } = useFormContext();

  let values = watch("active");
  
  let vals = getValues();
  const queryFn = async () => {
    return new Promise((resolve, reject) => {
      getTasks({ values, ...vals })
        .then(resolve)
        .catch((err) => {
          reject(err);
        });
    });
  };

  console.log("vals", ["tasks", values]);

  const { data, isLoading, error, isError, isFetching,isRefetching } = useQuery(
    ["tasks", values],
    queryFn
  );

  const [createdTasks, setCreatedTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  let type = store.getState().auth.user.type;
  let id = store.getState().auth.user._id;


  const [index, setIndex] = useState(navigation.getParam("index") || 0);
  const [showModalParam, setShowModalParam] = useState(
    navigation.getParam("showModalParam") || false
  );
  const [taskCreated, setTaskCreated] = useState(
    navigation.getParam("taskCreated") || null
  );
  const [routes] = useState([
    {
      key: "first",
      title: "Open",
    },
    {
      key: "second",
      title: type == "agent" ? "My Tasks" : "My Team Tasks",
    },
    {
      key: "third",
      title: "History",
    },
  ]);

  useEffect(() => {
    filterTasks();
    StatusBar.setBarStyle("dark-content", true);
    StatusBar.setBackgroundColor("#fff");
  }, [data]);

  const filterTasks = () => {
    const createdTasks = data?.filter((task) => task.job_status_ == "created");
    setCreatedTasks(createdTasks);
    const assignedTasks = data?.filter(
      (task) =>
        (task.job_status_ == "assigned" || task.job_status_ == "inprogress") && (task?.fleet_id_?._id == id || type != "agent")
    );
    setAssignedTasks(assignedTasks);
    const completedTasks = data?.filter(
      (task) => (task.job_status_ == "failed" || task.job_status_ == "successful") && (task?.fleet_id_?._id == id || type != "agent")
    );
    setCompletedTasks(completedTasks);
  };

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case "first":
        return <OpenTasks navigation={navigation} data={createdTasks} />;
      case "second":
        return (
          <MyTasks
            navigation={navigation}
            data={assignedTasks}
            showModalParam={showModalParam}
            taskCreated={taskCreated}
          />
        );
      case "third":
        return <HistoryTasks navigation={navigation} data={completedTasks} />;
    }
  };

  if (isLoading || isRefetching) {
    return (
      <View style={{ flex: 1 }}>
        <Lottie
          source={require("../../assets/animations/100485-circle-waves-white-dots.json")}
          autoPlay
          loop
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  if (isFetching) {
    ToastAndroid.show("Loading...", ToastAndroid.SHORT);
  }

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
              <View style={{ flexDirection: "row" }}>
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
                <View>
                  {route.key == "first" && createdTasks?.length > 0 ? (
                    <View style={styles.lengthItems}>
                      <Text
                        style={{
                          ...Fonts.whiteColor12Medium,
                        }}
                      >
                        {createdTasks?.length}
                      </Text>
                    </View>
                  ) : null}
                  {route.key == "second" && assignedTasks?.length > 0 ? (
                    <View style={styles.lengthItems}>
                      <Text
                        style={{
                          ...Fonts.whiteColor12Medium,
                        }}
                      >
                        {assignedTasks?.length}
                      </Text>
                    </View>
                  ) : null}
                  {route.key == "third" && completedTasks?.length > 0 ? (
                    <View style={styles.lengthItems}>
                      <Text
                        style={{
                          ...Fonts.whiteColor12Medium,
                        }}
                      >
                        {completedTasks?.length}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
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
  lengthItems: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 10.0,
    width: 22.0,
    height: 20.0,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5.0,
  },
});

export default withNavigation(OrdersScreen);
