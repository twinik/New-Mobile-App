import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { Colors, Sizes, Fonts } from "../../../constant/styles";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import Dialog from "react-native-dialog";
import { useTaskSliceSelector } from "../../../redux/slices/taskSlice";
import { EmptySkeleton, RenderTaskItem, DialogMyTask } from "./common";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../../service/TaskService";

const { width, height } = Dimensions.get("screen");

function TaskList({ list, setShowStartDialog, setSelectedTask }) {
  function RenderItem({ item }) {
    return (
      <RenderTaskItem
        item={item}
        toggleDialog={() => {
          setSelectedTask(item);
          setShowStartDialog(true);
        }}
      />
    );
  }

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => `${item?._id}`}
      renderItem={RenderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding * 6.0,
      }}
    />
  );
}

const MyTasks = ({ navigation }) => {
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showFailedDialog, setShowFailedDialog] = useState(false);
  const [taskStarted, setTaskStarted] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { data } = useQuery(["tasks"], getTasks);

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F4F4" }}>
      {(!data || data?.length === 0) && <EmptySkeleton />}
      <TaskList
        list={data}
        setShowStartDialog={setShowStartDialog}
        setSelectedTask={setSelectedTask}
      />
      <DialogMyTask
        showStartDialog={showStartDialog}
        setShowStartDialog={setShowStartDialog}
        showFailedDialog={showFailedDialog}
        setShowFailedDialog={setShowFailedDialog}
        item={selectedTask}
        taskStarted={taskStarted}
        setTaskStarted={setTaskStarted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dotStyle: {
    height: 5.0,
    width: 5.0,
    borderRadius: 2.5,
    backgroundColor: Colors.primaryColor,
    marginHorizontal: Sizes.fixPadding - 7.0,
  },
  acceptButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding * 3.0,
    paddingVertical: Sizes.fixPadding,
    flex: 1,
    justifyContent: "center",
  },
  deliveryAndPickupAddressWrapStyle: {
    backgroundColor: Colors.lightGrayColor,
    flexDirection: "row",
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
    borderBottomRightRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding + 3.0,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
  },
  orderAndPaymentDetailWrapStyle: {
    flexDirection: "row",
    paddingHorizontal: Sizes.fixPadding + 3.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "space-between",
  },
  orderDetailWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  rejectButtonStyle: {
    flex: 0.5,
    backgroundColor: "#E0E0E0",
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding,
    marginRight: Sizes.fixPadding + 5.0,
  },
  modalAcceptButtonStyle: {
    flex: 0.5,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Sizes.fixPadding + 5.0,
  },
  rejectAndAcceptButtonWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 3.0,
  },
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width * 0.9,
    alignSelf: "center",
    margin: 0,
    padding: 0,
  },
  detailWrapStyle: {
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    marginVertical: Sizes.fixPadding,
  },
  detailHeaderWrapStyle: {
    backgroundColor: Colors.lightGrayColor,
    paddingVertical: Sizes.fixPadding - 2.0,
    alignItems: "center",
    borderTopLeftRadius: Sizes.fixPadding - 5.0,
    borderTopRightRadius: Sizes.fixPadding - 5.0,
  },
  detailDescriptionWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: "#F6F6F6",
    borderWidth: 1.0,
    elevation: 0.7,
    padding: Sizes.fixPadding,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
    borderBottomRightRadius: Sizes.fixPadding - 5.0,
  },
  detailSpecificWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Sizes.fixPadding - 5.0,
  },
  detailTitleWrapStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
  rejectResonTextInputStyle: {
    borderWidth: 1.5,
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding - 5.0,
    ...Fonts.blackColor16Medium,
    marginVertical: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding,
    backgroundColor: "#F5F5F5",
  },
  cancelAndSendButtonWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 3.0,
    marginBottom: Sizes.fixPadding,
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
  sendButtonStyle: {
    flex: 0.5,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Sizes.fixPadding + 5.0,
  },
  map: {
    height: "70%",
    width: "100%",
  },
  taskStartedButtonWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 3.0,
  },
  failedButtonStyle: {
    flex: 1,
    backgroundColor: "red",
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding,
    marginRight: 5,
    borderWidth: 1.5,
    borderColor: "black",
  },
  onHoldButtonStyle: {
    flex: 1,
    backgroundColor: "#F4CB00",
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding,
    marginHorizontal: 5,
    borderWidth: 1.5,
    borderColor: "black",
  },
  succesfullButtonStyle: {
    flex: 1,
    backgroundColor: "green",
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding,
    marginLeft: 5,
    borderWidth: 1.5,
    borderColor: "black",
  },
});

export default MyTasks;
