import React, { useState } from "react";

import { Spinner, VStack, Button, Box, ScrollView } from "native-base";

import { useFormContext } from "react-hook-form";

import FieldList from "./FieldList";
import { Platform, KeyboardAvoidingView } from "react-native";
import { updateTaskAction } from "../../helpers/databaseActions";

// import {
//   createTemplateAction,
//   updateTemplateAction,
// } from "../helpers/databaseActions";

const TemplateForm = ({
  formParentName = "custom_fields",
  isReadOnlyView = false,
}) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const onSubmit = async (data) => {
    try {
      if (!!data) {
        await updateTaskAction(data);
      }
    } catch (err) {
      console.log("ON_SUBMIT_ERR", err);
    }
  };
  return (
    <FieldList
      depth={0}
      formParentName={formParentName}
      isReadOnlyView={isReadOnlyView}
    />
  );
  // return (
  //   <KeyboardAvoidingView
  //     behavior={Platform.OS === "ios" ? "padding" : "height"}
  //     style={{ flex: 1 }}
  //   >
  //     <FieldList depth={0} formParentName={formParentName} />
  //     {/* <Button
  //       onPress={handleSubmit(onSubmit)}
  //       disabled={isSubmitting}
  //       isLoading={isSubmitting}
  //       isLoadingText="Saving"
  //       mt={3}
  //     >
  //       save
  //     </Button> */}
  //   </KeyboardAvoidingView>
  // );
};

export default TemplateForm;
