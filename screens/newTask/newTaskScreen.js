import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
  TextInput,
  ScrollView,
} from "react-native";
import { withNavigation } from "react-navigation";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

import { useQuery } from "@tanstack/react-query";
import { Formik } from "formik";
import * as Yup from "yup";
import * as Location from "expo-location";
import Lottie from "lottie-react-native";
import RNPickerSelect from "react-native-picker-select";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button } from "react-native-paper";
import { VStack, FormControl, HStack } from "native-base";
import { useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  getCustomers,
  getTeams,
  getTemplates,
} from "../../service/NewTaskService";

const { width } = Dimensions.get("screen");

const validations = Yup.object().shape({
  datetime_start_before_: Yup.string().required("Required"),
  datetime_end_before_: Yup.string().required("Required"),
  team_id_: Yup.string().required("Required"),
  job_address_: Yup.string().required("Required"),
});

function addZeroBefore(n) {
  return (n < 10 ? "0" : "") + n;
}

const NewTask = ({ navigation }) => {
  const [addressActual, setAddressActual] = useState(null);
  const [location, setLocation] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);

  const queryClient = useQueryClient();

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

  //Getting customers, teams, templates
  const customersQuery = navigation.getParam("customersQuery");
  const teamsQuery = navigation.getParam("teamsQuery");
  const templatesQuery = navigation.getParam("templatesQuery");

  const create = async (values) => {
    const newTask = {
      ...values,
      job_latitude_: location.coords.latitude,
      job_longitude_: location.coords.longitude,
      job_pickup_latitude: location.coords.latitude,
      job_pickup_longitude: location.coords.longitude,
      job_address_: addressActual,
    };
    const response = await createTask(newTask);
    console.log(response);
    console.log(newTask);
    queryClient.refetchQueries(["tasks"]);
    navigation.goBack();
  };

  function form() {
    let start = new Date();
    let end = new Date();
    end.setHours(end.getHours());
    end.setMinutes(end.getMinutes() + 15);

    return (
      <Formik
        initialValues={{
          datetime_start_before_: start,
          datetime_end_before_: end,
          customer_id_: "",
          team_id_: "",
          template_id_: null,
          job_description_: "",
          job_address_: addressActual === null ? "Loading..." : addressActual,
        }}
        onSubmit={(values) => create(values)}
        validationSchema={validations}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <View style={{ flex: 1, backgroundColor: Colors.blackColor }}>
            <ScrollView>
              <View
                style={{
                  backgroundColor: Colors.blackColor,
                  width: width,
                }}
              >
                {/* 1-Date selection */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                >
                  <MaterialCommunityIcons
                    name="numeric-1-circle-outline"
                    size={22}
                    color={Colors.whiteColor}
                  />
                  <Text
                    style={{
                      ...Fonts.whiteColor17Regular,
                      marginVertical: Sizes.fixPadding,
                      marginLeft: 10,
                    }}
                  >
                    Dates Selection
                  </Text>
                </View>
                {/* INPUTS DATES */}
                <View style={styles.startAndEndDateWrapStyle}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setDatePickerVisibility(true)}
                    style={{
                      paddingLeft: Sizes.fixPadding * 2.0,
                      ...styles.startAndEndDateStyle,
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          ...Fonts.blackColor15Bold,
                          paddingBottom: Sizes.fixPadding - 5.0,
                        }}
                      >
                        START DATE
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <MaterialCommunityIcons
                          name="calendar"
                          size={17}
                          color={Colors.grayColor}
                        />
                        <Text
                          style={{
                            ...Fonts.blackColor14Regular,
                            alignContent: "center",
                            marginLeft: 5,
                          }}
                        >
                          {values.datetime_start_before_.toLocaleDateString()}
                        </Text>
                      </View>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        onConfirm={(value) => {
                          setDatePickerVisibility(false);
                          setFieldValue("datetime_start_before_", value);
                        }}
                        onCancel={() => setDatePickerVisibility(false)}
                        date={values.datetime_start_before_}
                        minimumDate={start}
                      />
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <MaterialCommunityIcons
                          name="clock"
                          size={17}
                          color={Colors.grayColor}
                        />
                        <Text
                          style={{
                            ...Fonts.blackColor14Regular,
                            alignContent: "center",
                            marginLeft: 5,
                          }}
                        >
                          {/* STARTTIME */}
                          {addZeroBefore(
                            values.datetime_start_before_.getHours()
                          ) +
                            ":" +
                            addZeroBefore(
                              values.datetime_start_before_.getMinutes()
                            )}
                        </Text>
                      </View>
                    </View>
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={22}
                      color={Colors.grayColor}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      backgroundColor: Colors.blackColor,
                      width: 1.0,
                      height: 90.0,
                    }}
                  ></View>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setDatePickerVisibility2(true)}
                    style={{
                      paddingRight: Sizes.fixPadding * 2.0,
                      ...styles.startAndEndDateStyle,
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          ...Fonts.blackColor15Bold,
                          paddingBottom: Sizes.fixPadding - 5.0,
                        }}
                      >
                        END DATE
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <MaterialCommunityIcons
                          name="calendar"
                          size={17}
                          color={Colors.grayColor}
                        />
                        <Text
                          style={{
                            ...Fonts.blackColor14Regular,
                            alignContent: "center",
                            marginLeft: 5,
                          }}
                        >
                          {/* ENDDATE */}
                          {values.datetime_end_before_.toLocaleDateString()}
                        </Text>
                      </View>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible2}
                        mode="datetime"
                        onConfirm={(value) => {
                          setDatePickerVisibility2(false);
                          setFieldValue("datetime_end_before_", value);
                        }}
                        onCancel={() => setDatePickerVisibility2(false)}
                        date={values.datetime_end_before_}
                        minimumDate={values.datetime_start_before_}
                      />
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <MaterialCommunityIcons
                          name="clock"
                          size={17}
                          color={Colors.grayColor}
                        />
                        <Text
                          style={{
                            ...Fonts.blackColor14Regular,
                            alignContent: "center",
                            marginLeft: 5,
                          }}
                        >
                          {/* ENDTIME */}
                          {addZeroBefore(
                            values.datetime_end_before_.getHours()
                          ) +
                            ":" +
                            addZeroBefore(
                              values.datetime_end_before_.getMinutes()
                            )}
                        </Text>
                      </View>
                    </View>
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={22}
                      color={Colors.grayColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* 2-Customer selection */}
              <View
                style={{
                  backgroundColor: Colors.blackColor,
                  width: width,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                >
                  <MaterialCommunityIcons
                    name="numeric-2-circle-outline"
                    size={22}
                    color={Colors.whiteColor}
                  />
                  <Text
                    style={{
                      ...Fonts.whiteColor17Regular,
                      marginVertical: Sizes.fixPadding,
                      marginLeft: 10,
                    }}
                  >
                    Select Customer
                  </Text>
                </View>
                <View style={styles.containerSection}>
                  <RNPickerSelect
                    onValueChange={(value) =>
                      setFieldValue("customer_id_", value)
                    }
                    value={values.customer_id_}
                    useNativeAndroidPickerStyle={false}
                    fixAndroidTouchableBug={true}
                    doneText="Accept"
                    Icon={() => {
                      return (
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={22}
                          color={Colors.grayColor}
                          style={{ marginRight: 10, marginTop: 12 }}
                        />
                      );
                    }}
                    style={PickerStyles}
                    placeholder={{
                      label: "Select Customer...",
                      value: null,
                    }}
                    items={customersQuery.data.map(
                      ({ customer_username_, _id }) => ({
                        label: customer_username_,
                        value: _id,
                      })
                    )}
                  />
                </View>
              </View>
              {/* 2 & 3 */}
              <View style={{ flexDirection: "row" }}>
                {/* 3-Select Team */}
                <View
                  style={{
                    flex: 1,
                    width: width,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="numeric-3-circle-outline"
                      size={22}
                      color={Colors.whiteColor}
                    />
                    <Text
                      style={{
                        ...Fonts.whiteColor17Regular,
                        marginVertical: Sizes.fixPadding,
                        marginLeft: 10,
                      }}
                    >
                      Select Team
                    </Text>
                  </View>
                  <View style={styles.containerSection}>
                    <RNPickerSelect
                      onValueChange={(value) =>
                        setFieldValue("team_id_", value)
                      }
                      value={values.team_id_}
                      useNativeAndroidPickerStyle={false}
                      fixAndroidTouchableBug={true}
                      doneText="Accept"
                      Icon={() => {
                        return (
                          <MaterialIcons
                            name="keyboard-arrow-down"
                            size={22}
                            color={Colors.grayColor}
                            style={{ marginRight: 10, marginTop: 12 }}
                          />
                        );
                      }}
                      style={PickerStyles}
                      placeholder={{
                        label: "Select Team...",
                        value: null,
                      }}
                      items={teamsQuery.data.map(({ team_name_, _id }) => ({
                        label: team_name_,
                        value: _id,
                      }))}
                    />
                  </View>
                </View>
                {/* 4-Select Template */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: Colors.blackColor,
                    width: width,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="numeric-4-circle-outline"
                      size={22}
                      color={Colors.whiteColor}
                    />
                    <Text
                      style={{
                        ...Fonts.whiteColor17Regular,
                        marginVertical: Sizes.fixPadding,
                        marginLeft: 10,
                      }}
                    >
                      Select Template
                    </Text>
                  </View>
                  <View style={styles.containerSection}>
                    <RNPickerSelect
                      onValueChange={(value) =>
                        setFieldValue("template_id_", value)
                      }
                      value={values.template_id_}
                      useNativeAndroidPickerStyle={false}
                      fixAndroidTouchableBug={true}
                      doneText="Accept"
                      Icon={() => {
                        return (
                          <MaterialIcons
                            name="keyboard-arrow-down"
                            size={22}
                            color={Colors.grayColor}
                            style={{ marginRight: 10, marginTop: 12 }}
                          />
                        );
                      }}
                      style={PickerStyles}
                      placeholder={{
                        label: "Select Template...",
                        value: null,
                      }}
                      items={templatesQuery.data.map(
                        ({ template_name, _id }) => ({
                          label: template_name,
                          value: _id,
                        })
                      )}
                    />
                  </View>
                </View>
              </View>
              {/* 5-Select JobDescription */}
              <View
                style={{
                  backgroundColor: Colors.blackColor,
                  width: width,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                >
                  <MaterialCommunityIcons
                    name="numeric-5-circle-outline"
                    size={22}
                    color={Colors.whiteColor}
                  />
                  <Text
                    style={{
                      ...Fonts.whiteColor17Regular,
                      marginVertical: Sizes.fixPadding,
                      marginLeft: 10,
                    }}
                  >
                    Job Description
                  </Text>
                </View>
                <View style={styles.containerSection}>
                  <TextInput
                    style={{
                      backgroundColor: "white",
                      borderRadius: Sizes.fixPadding + 5.0,
                      height: 80,
                      padding: 10,
                    }}
                    placeholder="Enter Job Description..."
                    placeholderTextColor={"#d6d6d6"}
                    multiline={true}
                    numberOfLines={4}
                    keyboardAppearance="dark"
                    returnKeyType="next"
                    returnKeyLabel="next"
                    onChangeText={handleChange("job_description_")}
                    value={values.job_description_}
                  />
                </View>
              </View>
              {/* 6-Select YourLocation */}
              <View
                style={{
                  backgroundColor: Colors.blackColor,
                  width: width,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                >
                  <MaterialCommunityIcons
                    name="numeric-6-circle-outline"
                    size={22}
                    color={Colors.whiteColor}
                  />
                  <Text
                    style={{
                      ...Fonts.whiteColor17Regular,
                      marginVertical: Sizes.fixPadding,
                      marginLeft: 10,
                    }}
                  >
                    Your Location
                  </Text>
                </View>
                <View style={styles.containerSection}>
                  <TextInput
                    editable={false}
                    style={{
                      backgroundColor: "white",
                      borderRadius: Sizes.fixPadding + 5.0,
                      height: 80,
                      padding: 10,
                    }}
                    placeholder={values.job_address_}
                    multiline={true}
                    numberOfLines={4}
                    keyboardAppearance="dark"
                    returnKeyType="next"
                    returnKeyLabel="next"
                    onChangeText={handleChange("job_address_")}
                    value={addressActual}
                  />
                </View>
              </View>
              {/* Button Submit */}
              <View style={styles.btn_box}>
                <Button
                  style={styles.button}
                  onPress={handleSubmit}
                  color="black"
                >
                  <Text
                    style={{
                      ...Fonts.blackColor19Bold,
                      marginVertical: Sizes.fixPadding,
                      marginLeft: 10,
                    }}
                  >
                    CREATE TASK
                  </Text>
                </Button>
              </View>
            </ScrollView>
          </View>
        )}
      </Formik>
    );
  }

  function LoadingScreen() {
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />

      {form()}
    </SafeAreaView>
  );
};

NewTask.navigationOptions = () => {};

const styles = StyleSheet.create({
  containerSection: {
    paddingRight: 15,
    paddingLeft: 15,
    paddingBottom: 10,
  },
  button: {
    height: 50,
    width: "50%",
    justifyContent: "center",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding + 5.0,
  },
  btn_box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  earningListWrapStyle: {
    top: -10.0,
    left: 0.0,
    right: 0.0,
    backgroundColor: "#F4F4F4",
    borderTopLeftRadius: Sizes.fixPadding + 3.0,
    borderTopRightRadius: Sizes.fixPadding + 3.0,
  },
  earningListItemWrapStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding,
  },
  totalEarningInfoWrapStyle: {
    backgroundColor: Colors.primaryColor,
    height: 120.0,
    alignItems: "center",
    justifyContent: "center",
  },
  headerWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    height: 60.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  calenderCancelOkButtonWrapStyle: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: Sizes.fixPadding,
    marginRight: Sizes.fixPadding + 10.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  selectDateWrapStyle: {
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding,
    backgroundColor: Colors.primaryColor,
    height: 100.0,
    justifyContent: "space-between",
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
  selectDateInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding * 2.0,
    borderColor: "#ECECEC",
    borderWidth: 1.0,
    elevation: 1.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding + 10.0,
  },
  startAndEndDateWrapStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding + 5.0,
    borderWidth: 1.0,
    marginLeft: 10,
    marginRight: 10,
  },
  startAndEndDateStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 0.45,
  },
  startToEndDateWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Sizes.fixPadding + 5.0,
  },
  ruleInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding * 2.0,
    borderColor: "#ECECEC",
    borderWidth: 1.0,
    elevation: 1.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding + 10.0,
  },
  additionalRuleInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding * 2.0,
    borderColor: "#ECECEC",
    borderWidth: 1.0,
    elevation: 1.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding + 10.0,
  },
  bookNowButtonOuterWrapStyle: {
    position: "absolute",
    bottom: 0.0,
    left: 0.0,
    right: 0.0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.whiteColor,
    borderTopColor: "#ECECEC",
    borderTopWidth: 1.0,
    height: 75.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
  },
  bookNowButtonWrapStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding + 5.0,
    height: 55.0,
    width: "100%",
  },
  dateAndGuestWrapStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding + 5.0,
    borderColor: Colors.blackColor,
    height: 90.0,
    borderWidth: 1.0,
  },
  dateAndGuestStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 0.45,
  },
  dateAndTimeWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Sizes.fixPadding + 5.0,
  },
  addAndSubtractGuestIconWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
    width: 30.0,
    height: 30.0,
    borderRadius: 15.0,
  },
  numberOfGuestsWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  saveButtonStyle: {
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    height: 55.0,
    marginTop: Sizes.fixPadding + 5.0,
    borderRadius: Sizes.fixPadding + 5.0,
  },
});

const PickerStyles = StyleSheet.create({
  inputIOS: {
    marginLeft: -6.5,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white",
    borderRadius: Sizes.fixPadding + 5.0,
  },
  inputAndroid: {
    marginLeft: -6.5,
    color: "black",
    padding: 10,
    backgroundColor: "white",
    borderRadius: Sizes.fixPadding + 5.0,
  },
  placeholder: {
    color: "lightgray",
  },
});

export default withNavigation(NewTask);
