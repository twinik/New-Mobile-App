import React, { useState } from "react";
import {
  FormControl,
  Input,
  Stack,
  WarningOutlineIcon,
  Box,
  Button,
  Text,
} from "native-base";

const InitTaskForm = ({ onSubmit }) => {
  const [taskName, setTaskName] = useState("");

  const isValid = taskName.length >= 5;
  console.log("isValid", isValid, taskName);
  return (
    <Box alignItems="center">
      <Box w="100%" mx="4">
        <Text>Please enter task name to start filling the template.</Text>
        <FormControl isRequired mb={4}>
          <Stack>
            <FormControl.Label>Task Name</FormControl.Label>
            <Input
              type="text"
              placeholder="Enter task name"
              value={taskName}
              onChangeText={setTaskName}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Task name required, must be 5 characters or more.
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>
        <Button
          onPress={() => {
            if (isValid) {
              onSubmit(taskName);
            }
          }}
          isDisabled={!isValid}
        >
          Create Task
        </Button>
      </Box>
    </Box>
  );
};

export default InitTaskForm;
