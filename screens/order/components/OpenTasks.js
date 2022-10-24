import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import Dialog from "react-native-dialog";
import { MaterialIcons } from "@expo/vector-icons";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { Colors, Sizes, Fonts } from "../../../constant/styles";
import { useTaskSliceSelector } from "../../../redux/slices/taskSlice";
import { truncateText } from "../../../helpers/utils";
import dayjs from "dayjs";
import { RenderTaskItem, EmptySkeleton } from "./common";

const { width, height } = Dimensions.get("screen");

const newOrders = [
  {
    id: "1",
    orderId: "OID123456789",
    customerName: "ABCDX STORE 12345",
    templateName: "TEST new 4444",
    orderStatus: "On time",
    startBefore: "2022-09-02 14:15",
    endBefore: "2022-09-02 16:30",
    pickupAddress: "28 Mott Stret, Bogota Colombia",
    deliveryAddress: "56 Andheri East",
  },
  {
    id: "2",
    orderId: "OID123789654",
    customerName: "ABCDX STORE 12345",
    templateName: "up Test Barcode",
    orderStatus: "Delayed",
    startBefore: "2022-09-02 14:15",
    endBefore: "2022-09-02 16:30",
    pickupAddress: "91 Opera Street, Puerto Rico",
    deliveryAddress: "231 Abc Circle",
  },
  {
    id: "3",
    orderId: "OID957546521",
    customerName: "ABCDX STORE 12345",
    templateName: "TEST CTASALGUERO",
    orderStatus: "Delayed",
    startBefore: "2022-09-02 14:15",
    endBefore: "2022-09-02 16:30",
    pickupAddress: "28 Mott Stret, Bogota Colombia",
    deliveryAddress: "91 Yogi Circle",
  },
  {
    id: "4",
    orderId: "OID652347952",
    customerName: "ABCDX STORE 12345",
    templateName: "test new 5555 (copy)",
    orderStatus: "On time",
    startBefore: "2022-09-02 14:15",
    endBefore: "2022-09-02 16:30",
    pickupAddress: "28 Mott Stret, Bogota Colombia transversal 44 casa 33",
    deliveryAddress: "56 Andheri East",
  },
];

function TaskList({ list, setShowAcceptDialog }) {
  function RenderItem({ item }) {
    return (
      <RenderTaskItem
        item={item}
        toggleDialog={() => {
          setShowAcceptDialog(true);
        }}
      />
    );
  }

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => `${item?.id || item?.job_id}`}
      renderItem={RenderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding * 6.0,
      }}
    />
  );
}

const OpenTasks = ({ item }) => {
  const { newTasks } = useTaskSliceSelector();
  const [newOrdersList, setNewOrderList] = React.useState(newOrders);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [resonField, setResonField] = useState(false);
  console.log("[newTasks]: ", newTasks?.length);

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F4F4" }}>
      {(!newTasks || newTasks?.length === 0) && <EmptySkeleton />}
      <TaskList list={newTasks} setShowAcceptDialog={setShowAcceptDialog} />
      {acceptDialog()}
      {rejectDialog()}
    </View>
  );

  function rejectDialog() {
    return (
      <Dialog.Container
        visible={showRejectDialog}
        contentStyle={styles.dialogContainerStyle}
        headerStyle={{ margin: 0.0, padding: 0.0 }}
      >
        <View
          style={{ backgroundColor: "white", borderRadius: Sizes.fixPadding }}
        >
          {resonToReject()}
          <Text
            style={{
              ...Fonts.blackColor14Regular,
              textAlign: "center",
              marginTop: Sizes.fixPadding,
            }}
          >
            Write a specific reason to reject order
          </Text>
          {rejectResonTextField()}
          {cancelAndSendButton()}
        </View>
      </Dialog.Container>
    );
  }

  function rejectResonTextField() {
    return (
      <TextInput
        style={{
          borderColor: resonField ? Colors.primaryColor : Colors.grayColor,
          ...styles.rejectResonTextInputStyle,
        }}
        selectionColor={Colors.primaryColor}
        multiline={true}
        numberOfLines={4}
        placeholder="Enter Reason Here"
        onFocus={() => setResonField(true)}
        onBlur={() => setResonField(false)}
      />
    );
  }

  function cancelAndSendButton() {
    return (
      <View style={styles.cancelAndSendButtonWrapStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setShowRejectDialog(false);
          }}
          style={styles.cancelButtonStyle}
        >
          <Text style={{ ...Fonts.blackColor18Medium }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setShowRejectDialog(false);
          }}
          style={styles.sendButtonStyle}
        >
          <Text style={{ ...Fonts.whiteColor18Medium }}>Send</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function resonToReject() {
    return (
      <View style={styles.detailTitleWrapStyle}>
        <Text style={{ ...Fonts.whiteColor17Regular }}>Reason to Reject</Text>
      </View>
    );
  }

  function acceptDialog() {
    return (
      <Dialog.Container
        visible={showAcceptDialog}
        contentStyle={styles.dialogContainerStyle}
        headerStyle={{ margin: 0.0, padding: 0.0 }}
      >
        <View
          style={{
            backgroundColor: "white",
            height: height - 150,
            borderRadius: Sizes.fixPadding,
          }}
        >
          {orderId()}
          <ScrollView showsVerticalScrollIndicator={false}>
            {orderDetail()}
            {locationDetail()}
            {templateDetail()}
            {rejectAndAcceptButton()}
          </ScrollView>
        </View>
      </Dialog.Container>
    );
  }

  function rejectAndAcceptButton() {
    return (
      <View style={styles.rejectAndAcceptButtonWrapStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            let filterArray = newOrdersList.filter((val, i) => {
              if (val.id !== currentOrderId) {
                return val;
              }
            });
            setNewOrderList(filterArray);
            setShowAcceptDialog(false);
            setShowRejectDialog(true);
          }}
          style={styles.rejectButtonStyle}
        >
          <Text style={{ ...Fonts.blackColor18Medium }}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            let filterArray = newOrdersList.filter((val, i) => {
              if (val.id !== currentOrderId) {
                return val;
              }
            });
            setNewOrderList(filterArray);
            setShowAcceptDialog(false);
          }}
          style={styles.modalAcceptButtonStyle}
        >
          <Text style={{ ...Fonts.whiteColor18Medium }}>Accept</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function templateDetail() {
    return (
      <View style={styles.detailWrapStyle}>
        <View style={styles.detailHeaderWrapStyle}>
          <Text style={{ ...Fonts.blackColor17Medium }}>Template Detail</Text>
        </View>
        <View style={styles.detailDescriptionWrapStyle}>
          <View style={{ ...styles.detailSpecificWrapStyle }}>
            <Text style={{ ...Fonts.blackColor15Medium }}>Name</Text>
            <Text style={{ ...Fonts.blackColor15Medium }}>Allison Perry</Text>
          </View>
          <View style={{ ...styles.detailSpecificWrapStyle }}>
            <Text style={{ ...Fonts.blackColor15Medium }}>Phone</Text>
            <Text style={{ ...Fonts.blackColor15Medium }}>123456789</Text>
          </View>
        </View>
      </View>
    );
  }

  function locationDetail() {
    var position = {
      latitude: 37.78825,
      longitude: -122.4324,
    };
    return (
      <View style={styles.detailWrapStyle}>
        <View style={styles.detailHeaderWrapStyle}>
          <Text style={{ ...Fonts.blackColor17Medium }}>Location</Text>
        </View>
        <View style={styles.detailDescriptionWrapStyle}>
          <MapView
            style={{ height: 250 }}
            initialRegion={{
              latitude: position.latitude,
              longitude: position.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={position}
              title={"Your Location"}
              description={"Your Location"}
            />
          </MapView>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <MaterialIcons name="place" size={24} color="black" />
            <Text style={{ ...Fonts.blackColor15Medium }}>
              28 Mott Street, Bogota, Colombia
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function orderDetail() {
    return (
      <View style={styles.detailWrapStyle}>
        <View style={styles.detailHeaderWrapStyle}>
          <Text style={{ ...Fonts.blackColor17Medium }}>Order</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ marginLeft: Sizes.fixPadding, flex: 1 }}>
            {/* <Text style={{ ...Fonts.blackColor18Medium }}>
            {truncateText(item?.id, 10)}
          </Text> */}
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Team:</Text>
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {/* {truncateText(item?.team_name_, 20)} */}
                TestTeam
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Customer name:</Text>
              <Text
                style={{ ...Fonts.blackColor14Medium, flex: 1 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {/* {truncateText(item?.customer_name_, 20)} */}
                TestName
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Template:</Text>
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {/* {truncateText(item?.template_name_, 20)} */}
                TestTemplate
              </Text>
            </View>
          </View>

          <View style={{ flex: 1, marginTop: 15 }}>
            <View
              style={{
                marginTop: Sizes.fixPadding - 4,
                marginBottom: Sizes.fixPadding - 9.0,
              }}
            >
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {
                  /* `@ ${
              dayjs().isBefore(item?.datetime_start_before_)
                ? "On Time"
                : "Delayed"
            }` */
                  "@ On Time"
                }
              </Text>
              <View style={{ marginTop: Sizes.fixPadding - 4 }}>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                  Start before:
                </Text>
                <Text style={{ ...Fonts.blackColor14Medium }}>
                  {/* {dayjs(item.datetime_start_before_).format(
                  "DD MMM YYYY hh:mm A"
                )} */}
                  12/12/2020 12:00 PM
                </Text>
              </View>
              <View style={{ marginTop: Sizes.fixPadding - 4 }}>
                <Text style={{ ...Fonts.grayColor12Medium }}>End before:</Text>
                <Text style={{ ...Fonts.blackColor14Medium }}>
                  {/* {dayjs(item.datetime_end_before_).format("DD MMM YYYY hh:mm A")} */}
                  12/12/2020 12:00 PM
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  function orderId() {
    return (
      <View style={styles.detailTitleWrapStyle}>
        <Text style={{ ...Fonts.whiteColor17Regular }}>
          {truncateText(item?.id, 10)}
        </Text>
      </View>
    );
  }
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
  map: {
    height: "70%",
    width: "100%",
  },
});

export default OpenTasks;
