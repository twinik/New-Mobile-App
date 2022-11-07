import React, { Component, useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import FilterStatusProjects from "../../components/FilterStatusProjects";
import FilterStatusTasks from "../../components/FilterStatusTasks";
import FilterstatusAgents from "../../components/FilterStatusAgents";
import FilterDate from "../../components/FilterDate";
import FilterTeam from "../../components/FilterTeam";
import FilterAgents from "../../components/FilterAgents";
import FilterTemplates from "../../components/FilterTemplates";

import { BottomSheet } from "react-native-elements";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { appControlslice } from "../../features/statesapp/appControlSlice";
import { updateappControlsliceField } from "../../features/statesapp/appControlSlice";
import { useFormContext } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

const BottomSheetComponente = ({ navigation }) => {
  const stateapp = useSelector((state) => state.appControlslice);
  const filters_on = stateapp[0].filters_on;

  const dispatch = useDispatch();
  function updateStateApp(item_field) {
    dispatch(updateappControlsliceField(item_field));
  }
  const queryClient = useQueryClient();

  const {
    formState: { errors },
    setValue,
    getValues,
    resetField,
  } = useFormContext();

  return (
    <BottomSheet
      isVisible={filters_on}
      containerStyle={{ backgroundColor: "rgba(0.5, 0.50, 0, 0.50)" }}
      onPress={() => setfilters_onx(falsex)}
    >
      <View
        style={{
          backgroundColor: Colors.whiteColor,
          paddingVertical: Sizes.fixPadding * 2.0,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          borderColor: Colors.primaryColor,
          Horizontal: Sizes.fixPadding * 2.0,
        }}
      >
        {iconAndCloseButton()}
        {divider()}
        <FilterDate />
        <FilterStatusTasks />
        <FilterTemplates />
        <FilterTeam />
        <FilterAgents />
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.modalAcceptButtonStyle}
        >
          <Text
            style={{
              ...Fonts.whiteColor18Medium,
              textAlign: "center",
            }}
            onPress={() => {
              setValue("active", !getValues("active"));
              queryClient.resetQueries(["tasks", true]);
              updateStateApp({ key: "filters_on", value: false });
            }}
          >
            Apply Filters
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );

  function divider() {
    return (
      <View
        style={{
          backgroundColor: Colors.grayColor,
          height: 0.5,
          marginTop: 5,
          //position: "relative"
        }}
      ></View>
    );
  }

  function iconAndCloseButton() {
    return (
      <View style={styles.surveIconAndCloseButtonWrapStyle}>
        <Text
          style={{ ...Fonts.blackColor18Medium, marginLeft: Sizes.fixPadding }}
        >
          FILTERS
        </Text>
        <MaterialIcons
          name="close"
          size={24}
          color="black"
          onPress={() => updateStateApp({ key: "filters_on", value: false })}
        />
      </View>
    );
  }
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
  modalAcceptButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding * 1.5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "50%",
    marginTop: Sizes.fixPadding * 1.0,
  },
  specialistInfoContainer: {
    height: 100.0,
    flex: 1,
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
});

export default BottomSheetComponente;
