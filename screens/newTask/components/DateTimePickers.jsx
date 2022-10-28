import React, { useState, useMemo } from "react";
import { VStack, FormControl, HStack, Text } from "native-base";
import { Controller, get, useFormContext } from "react-hook-form";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
//import { updateTaskAction } from "../../helpers/databaseActions";
//import { fbTimestamp } from "../../helpers/firebase";
import dayjs from "dayjs";

const AndroidPicker = React.memo(({ show, ...props }) => {
  if (!show) {
    return null;
  }
  return <DateTimePicker style={{ width: 4, borderWidth: 1 }} {...props} />;
});
const CustomDTPicker = ({ value, onChange, updateDB, ...pickerProps }) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");

  const onChangeAndroid = (event, selectedDate) => {
    const currentDate = new Date(selectedDate);
    setShow(false);
    onChange(currentDate.getTime());
    updateDB();
  };

  const showMode = (currentMode) => {
    setMode(currentMode);
    if (Platform.OS === "android") {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <VStack space={2} mb={2}>
      <HStack
        space={1}
        borderWidth={1}
        borderColor="gray.200"
        borderRadius={4}
        py={2}
        pl={2}
        pr={1}
        alignItems="center"
      >
        <MaterialCommunityIcons name="calendar-blank" size={24} />
        {Platform.OS === "ios" && (
          <DateTimePicker
            value={value}
            onChange={(event, selectedDate) => {
              const currentDate = new Date(selectedDate);
              onChange(currentDate.getTime());
            }}
            {...pickerProps}
            style={{ flex: 1 }}
          />
        )}
        {Platform.OS === "android" && (
          <HStack space={2} ml="auto" mr={1}>
            <AndroidPicker
              {...pickerProps}
              mode={mode}
              value={value}
              onChange={onChangeAndroid}
              show={show}
            />
            <TouchableOpacity onPress={showDatepicker}>
              <Text borderRadius={6} bg="gray.100" px={3} py={1}>
                {dayjs(value).format("D-MMM-YYYY")}
              </Text>
            </TouchableOpacity>
            {pickerProps?.mode === "datetime" && (
              <TouchableOpacity onPress={showTimepicker}>
                <Text borderRadius={6} bg="gray.100" px={3} py={1}>
                  {dayjs(value).format("h:mm A")}
                </Text>
              </TouchableOpacity>
            )}
          </HStack>
        )}
      </HStack>
    </VStack>
  );
};

export const DateField = ({
  label = "",
  name,
  isRequired = false,
  type = "date",
}) => {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext();

  const updateDB = () => {
    updateTaskAction(getValues())
      .then(() => {
        console.log("Task Updated");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const pickerProps = useMemo(() => {
    let mode = "date",
      maximumDate = undefined,
      minimumDate = undefined;
    mode = ["date", "date_future", "date_past"].includes(type)
      ? "date"
      : "datetime";
    maximumDate = ["date_past", "date_time_past"].includes(type)
      ? new Date()
      : undefined;
    minimumDate = ["date_future", "date_time_future"].includes(type)
      ? new Date()
      : undefined;
    return { mode, maximumDate, minimumDate };
  }, [type]);
  const hasError = get(errors, name)?.message;
  return (
    <FormControl isRequired={isRequired} isInvalid={isRequired && !!hasError}>
      <FormControl.Label color="black">{label}</FormControl.Label>
      <Controller
        control={control}
        render={({ field: { value, onChange } }) => {
          const dateValue = value
            ? fbTimestamp.fromMillis(value).toDate()
            : new Date();
          return (
            <CustomDTPicker
              value={dateValue}
              onChange={onChange}
              updateDB={updateDB}
              {...pickerProps}
            />
          );
        }}
        name={name}
        rules={{
          required: { value: isRequired, message: "Required" },
        }}
        defaultValue=""
      />
      <FormControl.ErrorMessage>{hasError}</FormControl.ErrorMessage>
    </FormControl>
  );
};
