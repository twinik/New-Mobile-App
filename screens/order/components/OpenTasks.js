import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Colors, Sizes, Fonts } from "../../../constant/styles";
import { RenderTaskItem, EmptySkeleton, DialogOpenTask } from "./common";
import { useQueryClient } from "@tanstack/react-query";
const { width, height } = Dimensions.get("screen");

function TaskList({ list, setShowAcceptDialog, setSelectedTask }) {
  const queryClient = useQueryClient();

  function RenderItem({ item }) {
    return (
      <RenderTaskItem
        item={item}
        toggleDialog={() => {
          setSelectedTask(item);
          setShowAcceptDialog(true);
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

const OpenTasks = ({ data }) => {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {(!data || data?.length === 0) && <EmptySkeleton />}
      <TaskList
        list={data}
        setShowAcceptDialog={setShowAcceptDialog}
        setSelectedTask={setSelectedTask}
      />

      <DialogOpenTask
        showAcceptDialog={showAcceptDialog}
        setShowAcceptDialog={setShowAcceptDialog}
        showRejectDialog={showRejectDialog}
        setShowRejectDialog={setShowRejectDialog}
        item={selectedTask}
      />
    </View>
  );
};

export default OpenTasks;
