import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Colors, Sizes, Fonts } from "../../../constant/styles";
import { useTaskSliceSelector } from "../../../redux/slices/taskSlice";
import { EmptySkeleton, RenderTaskItem } from "./common";

const { width, height } = Dimensions.get("screen");

const HistoryTaskList = ({ navigation }) => {
  const { historyTasks } = useTaskSliceSelector();

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F4F4" }}>
      {(!historyTasks || historyTasks?.length === 0) && <EmptySkeleton />}
      <FlatList
        data={historyTasks}
        keyExtractor={(item) => `${item?.id || item?.job_id}`}
        renderItem={RenderTaskItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Sizes.fixPadding,
          paddingBottom: Sizes.fixPadding * 6.0,
        }}
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
  deliveryAndPickupAddressWrapStyle: {
    backgroundColor: Colors.lightGrayColor,
    flexDirection: "row",
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
    borderBottomRightRadius: Sizes.fixPadding - 5.0,
    justifyContent: "space-between",
    paddingHorizontal: Sizes.fixPadding + 3.0,
    paddingVertical: Sizes.fixPadding,
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
  dialogContainerStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 70,
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
  startButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding - 2.0,
    alignItems: "center",
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding - 5.0,
    marginVertical: Sizes.fixPadding,
  },
});

export default HistoryTaskList;
