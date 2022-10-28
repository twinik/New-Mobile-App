import React, { Fragment } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constant/styles";

const STATUS_LIST = {
  created: {
    path: "task_assigned.png",
    title: "Created",
  },
  assigned: {
    path: "task_assigned.png",
    title: "Assigned",
  },
  inprogress: { path: "task_progress.png", title: "In Progress" },
  successful: { path: "task_completed.png", title: "Successful" },
  failed: { path: "task_pending.png", title: "Failed" },
};

const getImgSrc = (status) => {
  switch (status) {
    case "failed":
      return require(`../../assets/images/markers/task_pending.png`);
    case "assigned":
      return require(`../../assets/images/markers/task_assigned.png`);
    case "inprogress":
      return require(`../../assets/images/markers/task_progress.png`);
    case "successful":
      return require(`../../assets/images/markers/task_completed.png`);
    case "created":
      return require(`../../assets/images/markers/task_assigned.png`);
  }
};
const StatusButton = ({
  status = "unassigned",
  selected = false,
  clickable = false,
  onPress = () => {},
}) => {
  const { title } = STATUS_LIST[status || "unassigned"];

  const badge = (
    <View
      style={{
        ...(!selected ? styles.badge : styles.selectedBadge),
      }}
    >
      <Image
        source={getImgSrc(status)}
        style={styles.image}
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
  image: {
    height: 20,
    width: 20,
    left: 3,
  },
  badge: {
    flexDirection: "row",
    height: 35.0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 40,
    paddingLeft: 5,
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
  },
  selectedTitle: {
    ...Fonts.whiteColor16Regular,
    //marginTop: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding,
    textAlign: "left",
  },
});
