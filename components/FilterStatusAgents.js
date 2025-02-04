import React from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  ImageBackground,
  Image,
  TouchableHighlight,
} from "react-native";
import { Colors, Fonts, Sizes } from "../constant/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { editSelect } from "../features/OrderFilters/agentstatusSlice";
//import { transparent } from "react-native-paper/lib/typescript/styles/colors";
import { useFormContext } from "react-hook-form";

function FilterstatusAgents() {
  const statusAgents = [
    {
      sourcex: require("../assets/images/markers/agent_free.png"),
      status: "Free",
      name: "free",
      id: 1,
    },
    {
      sourcex: require("../assets/images/markers/agent_bussy.png"),
      status: "Bussy",
      name: "bussy",
      id: 2,
    },
    {
      sourcex: require("../assets/images/markers/agent_offline.png"),
      status: "Offline",
      name: "offline",
      id: 3,
    },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();

  const renderItem = ({ item }) => {
    const { sourcex, status, name, id } = item;

    let selectedValues = getValues("agentStatus");
    let isSelected = selectedValues.includes(name);

    return (
      <View>
        <TouchableHighlight
          underlayColor="white"
          activeOpacity={0.9}
          //onPress={() => navigation.navigate('Specialist', { name: item.name })}
          onPress={() => {
            if (isSelected) {
              setValue(
                "agentStatus",
                selectedValues.filter((item) => item !== name)
              );
              return;
            }

            setValue("agentStatus", [...selectedValues, name]);
          }}
        >
          <View
            style={
              !isSelected
                ? styles.specialistInfoContainer
                : styles.specialistInfoContainer2
            }
          >
            <Image
              source={sourcex}
              style={{ height: 25.0, width: 25.0, marginLeft: 5 }}
              resizeMode="contain"
            />
            <Text
              style={
                !isSelected
                  ? styles.lettersInfoContainer
                  : styles.lettersInfoContainer2
              }
            >
              {status}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
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
        | by Agent status:
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={statusAgents}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={{ marginHorizontal: Sizes.fixPadding }}
      />
    </View>
  );
}

export default FilterstatusAgents;

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
