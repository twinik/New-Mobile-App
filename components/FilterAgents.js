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
import { useFormContext, Controller } from "react-hook-form";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../service/NewTaskService";

function FilterAgents() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    getFieldState: get,
  } = useFormContext();

  const teamsQuery = useQuery(["teams"], () => getTeams());

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
      <Text
        style={{
          ...Fonts.grayColor16Medium,
          //marginTop: Sizes.fixPadding,
          marginHorizontal: Sizes.fixPadding,
          textAlign: "left",
          marginLeft: 15,
        }}
      >
        | by Date:
      </Text>
      <Controller
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { invalid, isTouched, isDirty, error },
          formState,
        }) => {
          return (
            <RNPickerSelect
              onValueChange={(value) => {
                onChange(value);
              }}
              style={PickerStyles}
              items={teamsQuery.data.map(({ team_name_, _id }) => ({
                label: team_name_,
                value: _id,
              }))}
            />
          );
        }}
        rules={{
          required: true,
        }}
        control={control}
        name="teams"
      />
    </View>
  );
}

export default FilterAgents;

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
      marginLeft: 15,
    },
    placeholder: {
      color: "lightgray",
    },
  });

const styles = StyleSheet.create({
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
