import React, { Component, useState, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateappControlsliceField } from "../../features/statesapp/appControlSlice";

import { withNavigation } from "react-navigation";
import { useAuthSelector } from "../../redux/slices/authSlice";
import { useFormContext } from "react-hook-form";

const Headerx = ({ navigation }) => {
  const { user } = useAuthSelector();
  const stateapp = useSelector((state) => state.appControlslice);
  const mapView = stateapp[0].map_view;
  const filter_on = stateapp[0].filters_on;
  //console.log('DESDE HEADER', mapView,filter_on)

  const dispatch = useDispatch();

  const { getValues, setValue } = useFormContext();


  function updateStateApp(item_field) {
    console.log(mapView);
    console.log("jkmom", item_field);

    dispatch(updateappControlsliceField(item_field));
  }

  let values = getValues();
  let isFilterSelected = values.active;

  return (
    <View style={styles.headerWrapStyle}>
      <Text style={{ ...Fonts.blackColor18Medium }}>
        Hello, {user?.name}!
      </Text>
      <View
        style={{
          flexDirection: "row",
          position: "relative",
          justifyContent: "space-between",
        }}
      >
        <MaterialCommunityIcons
          style={{ marginRight: -5 }}
          name={!isFilterSelected ? "filter" : "filter-check"}
          size={26}
          color={Colors.blackColor}
          onPress={() => {
            if (filter_on == false) {
              updateStateApp({ key: "filters_on", value: true });
            } else {
              updateStateApp({ key: "filters_on", value: false });
            }
          }}
        />
      </View>
    </View>
  );
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
});

export default withNavigation(Headerx);
