import React, { Fragment } from "react";
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
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { MaterialIcons } from "@expo/vector-icons";

const STATUS_LIST = {
  unassigned: {
    path: "task_pending.png",
    title: "Unassigned",
  },
  assigned: {
    path: "task_assigned.png",
    title: "Assigned",
  },
  inprogress: { path: "task_progress.png", title: "In Progress" },
  completed: { path: "task_completed.png", title: "Completed" },
  created: {
    path: "task_assigned.png",
    title: "created",
  },
};

const getImgSrc = (status) => {
  switch (status) {
    case "unassigned":
      return require(`../../assets/images/markers/task_pending.png`);
    case "assigned":
      return require(`../../assets/images/markers/task_assigned.png`);
    case "inprogress":
      return require(`../../assets/images/markers/task_progress.png`);
    case "completed":
      return require(`../../assets/images/markers/task_completed.png`);
    case "created":
      return require(`../../assets/images/markers/task_assigned.png`);
    default:
      return require(`../../assets/images/markers/task_pending.png`);
  }
};
const StatusButton = ({
  status = "unassigned",
  selected = false,
  clickable = false,
  varient = "default", // vertical, horizontal
  onPress = () => {},
}) => {
  const { title } = STATUS_LIST[status || "unassigned"];

  const badge = (
    <View
      style={{
        ...(!selected ? styles.badge : styles.selectedBadge),

        // ...(varient === "vertical" && { transform: [{ rotate: "-90deg" }] }),
      }}
    >
      <Image
        source={getImgSrc(status)}
        style={{ height: 20.0, width: 20.0, marginLeft: 5 }}
        resizeMode="contain"
      />
      <Text style={!selected ? styles.title : styles.selectedTitle}>
        {title}
      </Text>
    </View>
  );
  return clickable ? (
    <TouchableHighlight
      underlayColor="white"
      activeOpacity={0.9}
      onPress={onPress}
    >
      {badge}
    </TouchableHighlight>
  ) : (
    <Fragment>{badge}</Fragment>
  );
};

export default StatusButton;

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    height: 35.0,
    // width: 80,
    // flex: 1,
    //width: 120.0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: Colors.lightGray,
    borderWidth: 1,
    marginHorizontal: 5.0,
    marginVertical: 1.0,
    borderRadius: 8,
    // shadowColor: "black",
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.5,
    // shadowRadius: 10,
    // elevation: 2,
    marginTop: 10,
  },
  selectedBadge: {
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
  title: {
    ...Fonts.primaryColor16Medium,
    //marginTop: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding,
    textAlign: "left",
    // flexWrap: "nowrap",
    // transform: [{ rotate: "-90deg" }],
  },
  selectedTitle: {
    ...Fonts.whiteColor16Regular,
    //marginTop: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding,
    textAlign: "left",
  },
});
