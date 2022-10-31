import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  ToastAndroid,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import Dialog from "react-native-dialog";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import Lottie from "lottie-react-native";
import { truncateText } from "../../../helpers/utils";
import { Colors, Sizes, Fonts } from "../../../constant/styles";
import StatusButton from "../../../components/StatusButton";
import { updateTask } from "../../../service/TaskService";

const { width, height } = Dimensions.get("screen");

export const RenderTaskItem = ({ item, toggleDialog }) => {
  const CTA_TEXTS = {
    created: "Accept",
    assigned: "Start",
    inprogress: "Edit",
    successful: "View",
    failed: "View",
  };

  return (
    <View style={styles.orderDetailWrapStyle}>
      <View style={styles.orderAndPaymentDetailWrapStyle}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ alignItems: "center", width: 40 }}>
            <MaterialIcons
              name="add-task"
              size={24}
              color={Colors.primaryColor}
            />
            <View style={styles.statusButtonRotated}>
              <StatusButton status={item?.job_status_} />
            </View>
          </View>
          <View style={{ marginLeft: Sizes.fixPadding }}>
            <Text style={{ ...Fonts.blackColor18Medium }}>
              {truncateText(item?._id, 10)}
            </Text>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Team:</Text>
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {truncateText(item?.team_id_?.team_name_, 20)}
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Customer name:</Text>
              <Text
                style={{ ...Fonts.blackColor14Medium, flex: 1 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {truncateText(item?.customer_id_?.customer_username_, 20)}
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
            onPress={toggleDialog}
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
          size={22}
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
  const queryClient = useQueryClient();
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 0.5,
        alignItems: "center",
      }}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            queryClient.refetchQueries(["tasks"]);
          }}
        />
      }
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#F4F4F4",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons
          name="shopping"
          size={60}
          color={Colors.grayColor}
        />
        <Text
          style={{ ...Fonts.grayColor17Medium, marginTop: Sizes.fixPadding }}
        >
          {message || "Empty"}
        </Text>
      </View>
    </ScrollView>
  );
};

export const DialogOpenTask = ({
  item,
  showAcceptDialog,
  setShowAcceptDialog,
  showRejectDialog,
  setShowRejectDialog,
}) => {
  const queryClient = useQueryClient();
  return (
    <View>
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
          borderColor: Colors.grayColor,
          ...styles.rejectResonTextInputStyle,
        }}
        selectionColor={Colors.primaryColor}
        multiline={true}
        numberOfLines={4}
        placeholder="Enter Reason Here"
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
        onBackdropPress={() => {
          setShowAcceptDialog(false);
        }}
        onRequestClose={() => {
          setShowAcceptDialog(false);
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            height: height * 0.83,
            borderRadius: Sizes.fixPadding,
          }}
        >
          {orderId()}
          <ScrollView showsVerticalScrollIndicator={false}>
            {orderDetail()}
            {descriptionDetail()}
            {locationDetail()}
            {templateDetail()}
          </ScrollView>
          {rejectAndAcceptButton()}
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
            setShowAcceptDialog(false);
            const update = {
              job_status_: "assigned",
            };
            updateTask(item._id, update);
            queryClient.refetchQueries(["tasks"]);
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
    if (item?.job_latitude_ && item?.job_longitude_) {
      var position = {
        latitude: item?.job_latitude_,
        longitude: item?.job_longitude_,
      };
    } else {
      var position = {
        latitude: 4.694911163931887,
        longitude: -74.08622110666725,
      };
    }

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
              title={truncateText(item?.job_address_, 20)}
            />
          </MapView>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <MaterialIcons name="place" size={24} color="black" />
            <Text style={{ ...Fonts.blackColor15Medium }}>
              {truncateText(item?.job_address_, 30)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function descriptionDetail() {
    return (
      <View style={styles.detailWrapStyle}>
        <View style={styles.detailHeaderWrapStyle}>
          <Text style={{ ...Fonts.blackColor17Medium }}>Description</Text>
        </View>
        <View style={styles.detailDescriptionWrapStyle}>
          <Text style={{ ...Fonts.blackColor14Regular }}>
            {truncateText(item?.job_description_, 1000)}
          </Text>
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
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Team:</Text>
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {truncateText(item?.team_id_?.team_name_, 20)}
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Customer name:</Text>
              <Text
                style={{ ...Fonts.blackColor14Medium, flex: 1 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {truncateText(item?.customer_id_?.customer_username_, 20)}
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Template:</Text>
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {truncateText(item?.template_name_, 20)}
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
                {`@ ${
                  dayjs().isBefore(item?.datetime_start_before_)
                    ? "On Time"
                    : "Delayed"
                }`}
              </Text>
              <View style={{ marginTop: Sizes.fixPadding - 4 }}>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                  Start before:
                </Text>
                <Text style={{ ...Fonts.blackColor14Medium }}>
                  {dayjs(item?.datetime_start_before_).format(
                    "DD MMM YYYY hh:mm A"
                  )}
                </Text>
              </View>
              <View style={{ marginTop: Sizes.fixPadding - 4 }}>
                <Text style={{ ...Fonts.grayColor12Medium }}>End before:</Text>
                <Text style={{ ...Fonts.blackColor14Medium }}>
                  {dayjs(item?.datetime_end_before_).format(
                    "DD MMM YYYY hh:mm A"
                  )}
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
          {truncateText(item?._id, 10)}
        </Text>
      </View>
    );
  }
};

export const DialogMyTask = ({
  showStartDialog,
  setShowStartDialog,
  showFailedDialog,
  setShowFailedDialog,
  item,
  navigation,
  goBackModal,
}) => {
  const queryClient = useQueryClient();
  const [addressActual, setAddressActual] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      await getAddress();
    })();
  }, [addressActual]);

  async function getAddress() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
    });
    setLocation(location);
    let address = await Location.reverseGeocodeAsync(location.coords);
    let addressFormated =
      address[0].street +
      " " +
      address[0].streetNumber +
      ", " +
      address[0].city;
    setAddressActual(addressFormated);
  }

  return (
    <View>
      {acceptDialog()}
      {failedDialog()}
    </View>
  );
  function showToastOrder(id) {
    ToastAndroid.show("Order " + id + " started", ToastAndroid.SHORT);
  }
  function failedDialog() {
    return (
      <Dialog.Container
        visible={showFailedDialog}
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
            Write a specific reason to set order failed
          </Text>
          {failedResonTextField()}
          {cancelAndSendButton()}
        </View>
      </Dialog.Container>
    );
  }

  function failedResonTextField() {
    return (
      <TextInput
        style={{
          borderColor: Colors.grayColor,
          ...styles.rejectResonTextInputStyle,
        }}
        selectionColor={Colors.primaryColor}
        multiline={true}
        numberOfLines={4}
        placeholder="Enter Reason Here"
      />
    );
  }

  function cancelAndSendButton() {
    return (
      <View style={styles.cancelAndSendButtonWrapStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setShowFailedDialog(false);
          }}
          style={styles.cancelButtonStyle}
        >
          <Text style={{ ...Fonts.blackColor18Medium }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            const update = {
              job_status_: "failed",
              job_completed_datetime_: new Date(),
              job_completed_latitude: location.coords.latitude,
              job_completed_longitude: location.coords.longitude,
            };
            updateTask(item._id, update);
            queryClient.refetchQueries(["tasks"]);
            setShowFailedDialog(false);
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
        <Text style={{ ...Fonts.whiteColor17Regular }}>
          Reason to set order failed
        </Text>
      </View>
    );
  }

  function acceptDialog() {
    return (
      <Dialog.Container
        visible={showStartDialog}
        contentStyle={styles.dialogContainerStyle}
        headerStyle={{ margin: 0.0, padding: 0.0 }}
      >
        {item === null || item === undefined ? (
          <View
            style={{
              backgroundColor: "white",
              height: height * 0.83,
              borderRadius: Sizes.fixPadding,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lottie
              source={require("../../../assets/animations/loadingCreateTask.json")}
              autoPlay
              loop
            />
          </View>
        ) : (
          <View
            style={{
              backgroundColor: "white",
              height: height * 0.83,
              borderRadius: Sizes.fixPadding,
            }}
          >
            {orderId()}
            <ScrollView showsVerticalScrollIndicator={false}>
              {orderDetail()}
              {descriptionDetail()}
              {locationDetail()}
              {templateDetail()}
            </ScrollView>
            {item?.job_status_ == "inprogress"
              ? taskStartedButtons()
              : cancelAndStartButton()}
          </View>
        )}
      </Dialog.Container>
    );
  }

  function taskStartedButtons() {
    return (
      <View style={styles.taskStartedButtonWrapStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setShowStartDialog(false);
            setShowFailedDialog(true);
          }}
          style={styles.failedButtonStyle}
        >
          <Text style={{ ...Fonts.whiteColor15Medium }}>Failed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            queryClient.refetchQueries(["tasks"]);
            setShowStartDialog(false);
          }}
          style={styles.onHoldButtonStyle}
        >
          <Text style={{ ...Fonts.whiteColor15Medium }}>On Hold</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            const update = {
              job_status_: "successful",
              job_completed_datetime_: new Date(),
              job_completed_latitude: location.coords.latitude,
              job_completed_longitude: location.coords.longitude,
            };
            console.log("WHEN SUCCESS: ", updateTask(item._id, update));
            queryClient.refetchQueries(["tasks"]);
            setShowStartDialog(false);
            goBackModal === true && navigation.goBack();
          }}
          style={styles.succesfullButtonStyle}
        >
          <Text style={{ ...Fonts.whiteColor15Medium }}>Succesfull</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function cancelAndStartButton() {
    return (
      <View style={styles.rejectAndAcceptButtonWrapStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setShowStartDialog(false);
          }}
          style={styles.rejectButtonStyle}
        >
          <Text style={{ ...Fonts.blackColor18Medium }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={async () => {
            //setTaskStarted(true);
            showToastOrder(item?._id);
            const update = {
              job_status_: "inprogress",
              job_pickup_datetime_: new Date(),
              job_pickup_latitude: location.coords.latitude,
              job_pickup_longitude: location.coords.longitude,
              job_pickup_address_: addressActual,
            };
            const response = await updateTask(item._id, update);
            console.log("WHEN START: ", response.job_status_);
            queryClient.refetchQueries(["tasks"]);
          }}
          style={styles.modalAcceptButtonStyle}
        >
          <Text style={{ ...Fonts.whiteColor18Medium }}>Start</Text>
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
    if (item?.job_latitude_ && item?.job_longitude_) {
      var position = {
        latitude: item?.job_latitude_,
        longitude: item?.job_longitude_,
      };
    } else {
      var position = {
        latitude: 4.694911163931887,
        longitude: -74.08622110666725,
      };
    }
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
              title={truncateText(item?.job_address_, 20)}
            />
          </MapView>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <MaterialIcons name="place" size={24} color="black" />
            <Text style={{ ...Fonts.blackColor15Medium }}>
              {truncateText(item?.job_address_, 30)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function descriptionDetail() {
    return (
      <View style={styles.detailWrapStyle}>
        <View style={styles.detailHeaderWrapStyle}>
          <Text style={{ ...Fonts.blackColor17Medium }}>Description</Text>
        </View>
        <View style={styles.detailDescriptionWrapStyle}>
          <Text style={{ ...Fonts.blackColor14Regular }}>
            {truncateText(item?.job_description_, 1000)}
          </Text>
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
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Team:</Text>
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {truncateText(item?.team_id_?.team_name_, 20)}
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Customer name:</Text>
              <Text
                style={{ ...Fonts.blackColor14Medium, flex: 1 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {truncateText(item?.customer_id_?.customer_username_, 20)}
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Template:</Text>
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {truncateText(item?.template_name_, 20)}
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
                {`@ ${
                  dayjs().isBefore(item?.datetime_start_before_)
                    ? "On Time"
                    : "Delayed"
                }`}
              </Text>
              <View style={{ marginTop: Sizes.fixPadding - 4 }}>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                  Start before:
                </Text>
                <Text style={{ ...Fonts.blackColor14Medium }}>
                  {dayjs(item?.datetime_start_before_).format(
                    "DD MMM YYYY hh:mm A"
                  )}
                </Text>
              </View>
              <View style={{ marginTop: Sizes.fixPadding - 4 }}>
                <Text style={{ ...Fonts.grayColor12Medium }}>End before:</Text>
                <Text style={{ ...Fonts.blackColor14Medium }}>
                  {dayjs(item?.datetime_end_before_).format(
                    "DD MMM YYYY hh:mm A"
                  )}
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
          {truncateText(item?._id, 50)}
        </Text>
      </View>
    );
  }
};

export const DialogHistoryTask = ({
  showViewDialog,
  setShowViewDialog,
  item,
}) => {
  const queryClient = useQueryClient();
  return <View>{acceptDialog()}</View>;
  function acceptDialog() {
    return (
      <Dialog.Container
        visible={showViewDialog}
        contentStyle={styles.dialogContainerStyle}
        headerStyle={{ margin: 0.0, padding: 0.0 }}
        onBackdropPress={() => {
          setShowViewDialog(false);
        }}
        onRequestClose={() => {
          setShowViewDialog(false);
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            height: height * 0.83,
            borderRadius: Sizes.fixPadding,
          }}
        >
          {orderId()}
          <ScrollView showsVerticalScrollIndicator={false}>
            {orderDetail()}
            {descriptionDetail()}
            {locationDetail()}
            {templateDetail()}
          </ScrollView>
          {goBackButton()}
        </View>
      </Dialog.Container>
    );
  }

  function goBackButton() {
    return (
      <View style={styles.rejectAndAcceptButtonWrapStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setShowViewDialog(false);
          }}
          style={styles.rejectButtonStyle}
        >
          <Text style={{ ...Fonts.blackColor18Medium }}>Go Back</Text>
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
    if (item?.job_latitude_ && item?.job_longitude_) {
      var position = {
        latitude: item?.job_latitude_,
        longitude: item?.job_longitude_,
      };
    } else {
      var position = {
        latitude: 4.694911163931887,
        longitude: -74.08622110666725,
      };
    }
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
              title={truncateText(item?.job_address_, 20)}
            />
          </MapView>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <MaterialIcons name="place" size={24} color="black" />
            <Text style={{ ...Fonts.blackColor15Medium }}>
              {truncateText(item?.job_address_, 30)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function descriptionDetail() {
    return (
      <View style={styles.detailWrapStyle}>
        <View style={styles.detailHeaderWrapStyle}>
          <Text style={{ ...Fonts.blackColor17Medium }}>Description</Text>
        </View>
        <View style={styles.detailDescriptionWrapStyle}>
          <Text style={{ ...Fonts.blackColor14Regular }}>
            {truncateText(item?.job_description_, 1000)}
          </Text>
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
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Team:</Text>
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {truncateText(item?.team_id_?.team_name_, 20)}
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Customer name:</Text>
              <Text
                style={{ ...Fonts.blackColor14Medium, flex: 1 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {truncateText(item?.customer_id_?.customer_username_, 20)}
              </Text>
            </View>
            <View style={{ marginTop: Sizes.fixPadding - 4 }}>
              <Text style={{ ...Fonts.grayColor12Medium }}>Template:</Text>
              <Text style={{ ...Fonts.blackColor14Medium }}>
                {truncateText(item?.template_name_, 20)}
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
                {`@ ${
                  dayjs().isBefore(item?.datetime_start_before_)
                    ? "On Time"
                    : "Delayed"
                }`}
              </Text>
              <View style={{ marginTop: Sizes.fixPadding - 4 }}>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                  Start before:
                </Text>
                <Text style={{ ...Fonts.blackColor14Medium }}>
                  {dayjs(item?.datetime_start_before_).format(
                    "DD MMM YYYY hh:mm A"
                  )}
                </Text>
              </View>
              <View style={{ marginTop: Sizes.fixPadding - 4 }}>
                <Text style={{ ...Fonts.grayColor12Medium }}>End before:</Text>
                <Text style={{ ...Fonts.blackColor14Medium }}>
                  {dayjs(item?.datetime_end_before_).format(
                    "DD MMM YYYY hh:mm A"
                  )}
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
          {truncateText(item?._id, 50)}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  statusButtonRotated: {
    transform: [{ rotate: "-90deg" }],
    width: 110,
    maxWidth: 120,
    marginTop: 25,
    marginLeft: -38,
  },
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
