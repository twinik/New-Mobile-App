import React, { useState } from "react";
import { View, FlatList, Dimensions, RefreshControl } from "react-native";
import { Colors, Sizes, Fonts } from "../../../constant/styles";
import { EmptySkeleton, RenderTaskItem, DialogHistoryTask } from "./common";
import { useQueryClient } from "@tanstack/react-query";

const { width, height } = Dimensions.get("screen");

function TaskList({ list, setShowViewDialog, setSelectedTask }) {
  const queryClient = useQueryClient();

  function RenderItem({ item }) {
    return (
      <RenderTaskItem
        item={item}
        toggleDialog={() => {
          setSelectedTask(item);
          setShowViewDialog(true);
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

const HistoryTaskList = ({ navigation, data }) => {
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F4F4" }}>
      {(!data || data?.length === 0) && <EmptySkeleton />}
      <TaskList
        list={data}
        setShowViewDialog={setShowViewDialog}
        setSelectedTask={setSelectedTask}
      />
      <DialogHistoryTask
        showViewDialog={showViewDialog}
        setShowViewDialog={setShowViewDialog}
        item={selectedTask}
      />
    </View>
  );
};

export default HistoryTaskList;
