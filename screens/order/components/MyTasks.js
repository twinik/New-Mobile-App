import React, { useEffect, useState } from "react";
import { View, FlatList, Dimensions, RefreshControl } from "react-native";
import { Colors, Sizes, Fonts } from "../../../constant/styles";
import { EmptySkeleton, RenderTaskItem, DialogMyTask } from "./common";
import { useQueryClient } from "@tanstack/react-query";
import { array } from "yup";

const { width, height } = Dimensions.get("screen");

function TaskList({ list, setShowStartDialog, setSelectedTask }) {
  const queryClient = useQueryClient();

  function RenderItem({ item }) {
    return (
      <RenderTaskItem
        item={item}
        toggleDialog={() => {
          setSelectedTask(item);
          setShowStartDialog(true);
        }}
      />
    );
  }

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => `${item?._id}`}
      renderItem={RenderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding * 6.0,
      }}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            queryClient.refetchQueries(["tasks"]);
          }}
        />
      }
    />
  );
}

const MyTasks = ({ data }) => {
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showFailedDialog, setShowFailedDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (selectedTask) {
      let id = selectedTask._id;
      let task = data.find((item) => item._id === id);
      setSelectedTask(task);
    }
  }, [data]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F4F4" }}>
      {(!data || data?.length === 0) && <EmptySkeleton />}
      <TaskList
        list={data}
        setShowStartDialog={setShowStartDialog}
        setSelectedTask={setSelectedTask}
      />
      <DialogMyTask
        showStartDialog={showStartDialog}
        setShowStartDialog={setShowStartDialog}
        showFailedDialog={showFailedDialog}
        setShowFailedDialog={setShowFailedDialog}
        item={selectedTask}
      />
    </View>
  );
};

export default MyTasks;
