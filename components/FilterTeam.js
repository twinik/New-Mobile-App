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
import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../service/NewTaskService";

function FilterTeams() {
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();

  const teamsQuery = useQuery(["teams"], getTeams);

  const renderItem = ({ item }) => {
    const { team_name_,_id } = item;
    let selectedValues = getValues("teams");
    let isSelected = selectedValues.includes(_id);
    return (
      <View>
        <TouchableHighlight
          underlayColor="white"
          activeOpacity={0.9}
          //onPress={() => navigation.navigate('Specialist', { name: item.name })}
          onPress={() => {
            if (isSelected) {
              setValue(
                "teams",
                selectedValues.filter((item) => item !== _id)
              );
              return;
            }

            setValue("teams", [...selectedValues, _id]);
          }}
        >
          <View
            style={
              !isSelected
                ? styles.specialistInfoContainer
                : styles.specialistInfoContainer2
            }
          >
            <Text
              style={
                !isSelected
                  ? styles.lettersInfoContainer
                  : styles.lettersInfoContainer2
              }
            >
              {team_name_}
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
        | by Teams:
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={teamsQuery?.data || []}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={{ marginHorizontal: Sizes.fixPadding }}
      />
    </View>
  );
}

export default FilterTeams;

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
    width: 130.0,
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
