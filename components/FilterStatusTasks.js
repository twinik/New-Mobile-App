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
import { editSelect } from "../features/OrderFilters/statusSlice";
import { useFormContext } from "react-hook-form";

function FilterStatusTasks() {
  const statusTasks = [
    {
      sourcex: require("../assets/images/markers/task_pending.png"),
      status: "Created",
      name: "created",
      id: 1,
    },
    {
      sourcex: require("../assets/images/markers/task_assigned.png"),
      status: "Assigned",
      name: "assigned",
      id: 2,
    },
    {
      sourcex: require("../assets/images/markers/task_progress.png"),
      status: "In Progress",
      name: "inprogress",
      id: 3,
    },
    {
      sourcex: require("../assets/images/markers/task_completed.png"),
      status: "Completed",
      name: "successful",
      id: 4,
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
    let selectedValues = getValues("taskStatus");
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
                "taskStatus",
                selectedValues.filter((item) => item !== name)
              );
              return;
            }

            setValue("taskStatus", [...selectedValues, name]);
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
              style={{ height: 20.0, width: 20.0, marginLeft: 5 }}
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
        | by Task status:
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={statusTasks}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={{ marginHorizontal: Sizes.fixPadding }}
      />
    </View>
  );
}

export default FilterStatusTasks;

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
    width: 120.0,
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
