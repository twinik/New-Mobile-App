import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  ImageBackground,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { Colors, Fonts, Sizes } from "../constant/styles";
import { useFormContext } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
function FilterDate() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useFormContext();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setValue("date", date);

    hideDatePicker();
  };

  return (
    <View style={{ flex: 1, paddingTop: 10, marginBottom: 10 }}>
      <View
        style={{ flexDirection: "column", marginLeft: 15, marginRight: 15 }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity
            style={styles.modalAcceptButtonStyle}
            onPress={() => setValue("date", null)}
          >
            <Text
              style={{
                ...Fonts.blackColor15Bold,
                color: Colors.whiteColor,
                textAlign: "center",
              }}
            >
              Clear Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalAcceptButtonStyle}
            onPress={() => reset()}
          >
            <Text
              style={{
                ...Fonts.blackColor15Bold,
                color: Colors.whiteColor,
              }}
            >
              Clear Filters
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: "flex-end", paddingTop: 10 }}>
          <Text
            style={{
              ...Fonts.grayColor16Medium,
              //marginTop: Sizes.fixPadding,
              textAlign: "left",
            }}
          >
            | by Start Date:
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setDatePickerVisibility(true)}
            style={{
              padding: Sizes.fixPadding * 1.0,
              borderColor: Colors.primaryColor,
              borderWidth: 1,
              borderRadius: 5,
              marginTop: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                {getValues("date")
                  ? getValues("date").toLocaleDateString()
                  : "Select Date"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

export default FilterDate;

const styles = StyleSheet.create({
  modalAcceptButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    padding: Sizes.fixPadding * 1.5,
    marginRight: Sizes.fixPadding * 2.0,
    marginTop: 5,
    textAlign: "center",
  },
  specialistInfoContainer: {
    flexDirection: "row",
    height: 35.0,
    //width: 120.0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: Colors.lightGray,
    borderWidth: 1,
    marginHorizontal: 5.0,
    marginVertical: 1.0,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 2,
    marginTop: 10,
  },
  specialistInfoContainer2: {
    flexDirection: "row",
    height: 35.0,
    //width: 120.0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.blackColor,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    marginHorizontal: 10.0,
    marginVertical: 1.0,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 2,
    marginTop: 10,
  },
  lettersInfoContainer: {
    ...Fonts.primaryColor16Medium,
    //marginTop: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding,
    textAlign: "left",
  },
  lettersInfoContainer2: {
    ...Fonts.whiteColor16Regular,
    //marginTop: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding,
    textAlign: "left",
  },
});
