import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Sizes, Fonts } from "../../../constant/styles";
import { truncateText } from "../../../helpers/utils";
import dayjs from "dayjs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import StatusButton from "../../../components/StatusButton";

const { width, height } = Dimensions.get("screen");

export const RenderTaskItem = ({ item }) => {
  const CTA_TEXTS = {
    created: "Accept",
    assigned: "Start",
    inprogress: "Edit",
    completed: "View",
    failed: "View",
  };

  return (
    <View style={styles.orderDetailWrapStyle}>
      <View style={styles.orderAndPaymentDetailWrapStyle}>
        <View style={{ flexDirection: "row" }}>
          <View>
            <MaterialIcons
              name="add-task"
              size={24}
              color={Colors.primaryColor}
            />
            <View
              style={{
                flex: 1,
                transform: [{ rotate: "-90deg" }],
              }}
            >
              <StatusButton status={item?.job_status_} varient="vertical" />
            </View>
          </View>
          <View style={{ marginLeft: Sizes.fixPadding }}>
            <Text style={{ ...Fonts.blackColor18Medium }}>
              {truncateText(item?.id, 10)}
            </Text>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Team:</Text>
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {truncateText(item?.team_name_, 20)}
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Customer name:</Text>
              <Text
                style={{ ...Fonts.blackColor14Medium, flex: 1 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {truncateText(item?.customer_name_, 20)}
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Template:</Text>
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {truncateText(item?.template_name_, 20)}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              // setShowAcceptDialog(true);
              // setCurrentOrderId(item.id);
            }}
            style={styles.acceptButtonStyle}
          >
            <Text
              style={{
                ...Fonts.whiteColor18Medium,
                textAlign: "center",
              }}
            >
              {CTA_TEXTS[item?.job_status_]}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              marginTop: Sizes.fixPadding - 4,
              marginBottom: Sizes.fixPadding - 9.0,
            }}
          >
            <Text style={{ ...Fonts.blackColor14Medium }}>{`@ ${
              dayjs().isBefore(item?.datetime_start_before_)
                ? "On Time"
                : "Delayed"
            }`}</Text>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Start before:</Text>
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {dayjs(item.datetime_start_before_).format(
                  "DD MMM YYYY hh:mm A"
                )}
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>End before:</Text>
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {dayjs(item.datetime_end_before_).format("DD MMM YYYY hh:mm A")}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.deliveryAndPickupAddressWrapStyle}>
        <MaterialIcons
          name="location-on"
          size={20}
          color={Colors.primaryColor}
        />
        <Text
          style={{
            ...Fonts.blackColor16Medium,
            marginLeft: 5,
            marginRight: 5,
          }}
        >
          {item?.job_address_}
        </Text>
      </View>
    </View>
  );
};

export const EmptySkeleton = ({ message }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F4F4F4",
      }}
    >
      <MaterialCommunityIcons
        name="shopping"
        size={60}
        color={Colors.grayColor}
      />
      <Text style={{ ...Fonts.grayColor17Medium, marginTop: Sizes.fixPadding }}>
        {message || "Empty"}
      </Text>
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
});
