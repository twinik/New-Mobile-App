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
import DateTimePicker from "./components/DateTimePickers";
import { Button } from "react-native-paper";
import { VStack, FormControl, HStack } from "native-base";
import {
  getCustomers,
  getTeams,
  getTemplates,
} from "../../service/NewTaskService";

const { width } = Dimensions.get("screen");

const validations = Yup.object().shape({
  startDate: Yup.string().required("Required"),
  endDate: Yup.string().required("Required"),
  team: Yup.string().required("Required"),
  yourLocation: Yup.string().required("Required"),
});

const calcSlots = (calcDate, slotInterval, add1) => {
  //console.log(calcDate)
  let x = {
    slotInterval: slotInterval,
    closeTime: "24:00",
  };

  //Format the time
  let startTime = moment(calcDate, "HH:mm A");
  startTime = moment(startTime).add(5 + add1, "minutes");

  let remainder = slotInterval - (startTime.minute() % slotInterval);
  //console.log('hhhhh', remainder);
  startTime = moment(startTime).add(remainder, "minutes");

  //Format the end time and the next day to it
  let endTime = moment(x.closeTime, "h:mm A");
  //console.log('startime', startTime, endTime )

  //console.log(startTime)

  //Times
  let morningSlotx = [];
  let afternoonSlotsx = [];
  let eveningSlotsx = [];

  //Loop over the times - only pushes time with 30 minutes interval
  while (startTime < endTime) {
    //Push times
    if (startTime <= moment("12:00", "h:mm A")) {
      morningSlotx.push(startTime.format("h:mm A"));
    }
    if (
      startTime > moment("12:00", "h:mm A") &&
      startTime <= moment("18:00", "h:mm A")
    ) {
      afternoonSlotsx.push(startTime.format("h:mm A"));
    }
    if (startTime > moment("18:00", "h:mm A")) {
      eveningSlotsx.push(startTime.format("h:mm A"));
    }
    startTime.add(x.slotInterval, "minutes");
  }

  // Redux de slots

  return [morningSlotx, afternoonSlotsx, eveningSlotsx];
};
//DateTimePicker
/* const AndroidPicker = React.memo(({ show, ...props }) => {
  if (!show) {
    return null;
  }
  return <DateTimePicker style={{ width: 4, borderWidth: 1 }} {...props} />;
});
const CustomDTPicker = ({ value, onChange, updateDB, ...pickerProps }) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");

  const onChangeAndroid = (event, selectedDate) => {
    const currentDate = new Date(selectedDate);
    setShow(false);
    onChange(currentDate.getTime());
    //updateDB();
  };

  const showMode = (currentMode) => {
    setMode(currentMode);
    if (Platform.OS === "android") {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <VStack space={2} mb={2}>
      <HStack
        space={1}
        borderWidth={1}
        borderColor="gray.200"
        borderRadius={4}
        py={2}
        pl={2}
        pr={1}
        alignItems="center"
      >
        <MaterialCommunityIcons name="calendar-blank" size={24} />
        {Platform.OS === "ios" && (
          <DateTimePicker
            value={value}
            onChange={(event, selectedDate) => {
              const currentDate = new Date(selectedDate);
              onChange(currentDate.getTime());
            }}
            {...pickerProps}
            style={{ flex: 1 }}
          />
        )}
        {Platform.OS === "android" && (
          <HStack space={2} ml="auto" mr={1}>
            <AndroidPicker
              {...pickerProps}
              mode={mode}
              value={value}
              onChange={onChangeAndroid}
              show={show}
            />
            <TouchableOpacity onPress={showDatepicker}>
              <Text borderRadius={6} bg="gray.100" px={3} py={1}>
                {dayjs(value).format("D-MMM-YYYY")}
              </Text>
            </TouchableOpacity>
            {pickerProps?.mode === "datetime" && (
              <TouchableOpacity onPress={showTimepicker}>
                <Text borderRadius={6} bg="gray.100" px={3} py={1}>
                  {dayjs(value).format("h:mm A")}
                </Text>
              </TouchableOpacity>
            )}
          </HStack>
        )}
      </HStack>
    </VStack>
  );
}; */

const NewTask = ({ navigation }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [addressActual, setAddressActual] = useState(null);
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
    let address = await Location.reverseGeocodeAsync(location.coords);
    let addressFormated = address[0].street + ", " + address[0].city;
    setAddressActual(addressFormated);
    setIsLoaded(true);
  }

  //Getting customers, teams, templates
  const customersQuery = useQuery(["customers"], () => getCustomers());
  const teamsQuery = useQuery(["teams"], () => getTeams());
  const templatesQuery = useQuery(["templates"], () => getTemplates());

  //Datetime picker
  const actualDate = moment().format("MM/DD/YYYY");
  const actualTime = moment().format("hh:mm A");
  const actualTimePlus15 = moment().add(15, "minutes").format("hh:mm A");

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [textDate, setTextDate] = useState(actualDate);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    let temDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    let fTime = tempDate.getHours() + ":" + tempDate.getMinutes();
    setTextDate(fDate);
    console.log(fDate, fTime);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  /*  const stateNewtask = useSelector((state) => state.newtaskSlice);
  slotsSB = calcSlots(moment(), 30, 0);

  // Capturando fecha actual
  let today = moment();
  let datexSB = today;
  let datexEB = datexSB;

  // Capturando el primer slot disponible para el dia Start Date
  let fisrtsSlotSB = "";
  if (slotsSB[0].length > 0) {
    fisrtsSlotSB = slotsSB[0][0];
  } else {
    if (slotsSB[1].length > 0) {
      fisrtsSlotSB = slotsSB[1][0];
    } else {
      if (slotsSB[2].length > 0) {
        fisrtsSlotSB = slotsSB[2][0];
      }
    }
  }

  slotsEB = calcSlots(today, 40, 5);
  let fisrtsSlotEB = "";
  if (slotsEB[0].length > 0) {
    fisrtsSlotEB = slotsEB[0][0];
  } else {
    if (slotsEB[1].length > 0) {
      fisrtsSlotEB = slotsEB[1][0];
    } else {
      if (slotsEB[2].length > 0) {
        fisrtsSlotEB = slotsEB[2][0];
      }
    }
  } */

  const handleSubmit = async (values) => {
    const newTask = {
      ...values,
      date: date,
    };
    console.log(newTask);
    const response = await createTask(newTask);
    console.log(response);
  };

  function form() {
    return (
      <Formik
        initialValues={{
          startDate: "",
          endDate: "",
          customer: "",
          team: "",
          template: "",
          jobDescription: "",
          yourLocation: "",
        }}
        onSubmit={(values) => handleSubmit(values)}
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
          <View>
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
                  onPress={() => showMode("date")}
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
                        {textDate}
                      </Text>
                    </View>
                    {show && alert("show")}
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
                  onPress={() => console.log("End Date")}
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
                      </Text>
                    </View>

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
                  onValueChange={(value) => setFieldValue("customer", value)}
                  value={values.customer}
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
                    onValueChange={(value) => setFieldValue("team", value)}
                    value={values.team}
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
                    onValueChange={(value) => setFieldValue("template", value)}
                    value={values.template}
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
                  onChangeText={handleChange("jobDescription")}
                  value={values.jobDescription}
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
                  placeholder={values.yourLocation}
                  multiline={true}
                  numberOfLines={4}
                  keyboardAppearance="dark"
                  returnKeyType="next"
                  returnKeyLabel="next"
                  onChangeText={handleChange("yourLocation")}
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
      {!isLoaded ? (
        LoadingScreen()
      ) : (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.blackColor }}>
          {form()}
        </ScrollView>
      )}
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
