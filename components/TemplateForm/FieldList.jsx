import React, { Fragment, useEffect, useMemo, useState } from "react";
import { VStack } from "native-base";
import { useFormContext, useFieldArray } from "react-hook-form";
import Row from "./FieldRow";

const FieldList = ({ depth, formParentName, isReadOnlyView }) => {
  const { control } = useFormContext();
  const fieldArray = useFieldArray({
    control,
    name: formParentName,
  });
  return (
    <VStack mb={4}>
      {fieldArray.fields.map((field, index) => (
        <Row
          key={field.id}
          depth={depth}
          index={index}
          formParentName={formParentName}
          fieldName={field.field_name}
          agentCanAccess={field.agent_can}
          fieldType={field.field_type}
          is_mandatory={field.is_mandatory}
          // isRequired={
          //   field.is_mandatory === "mandatory" && field.agent_can !== "read"
          // }
          // Field_value is contain different values e.g. for dropdown it contain options, for checkbox it contain options...
          fieldValue={field.field_value}
          fleetData={field.fleet_data}
          isLastItem={fieldArray.fields.length === index + 1}
          isReadOnlyView={isReadOnlyView}
        />
      ))}
    </VStack>
  );
};
export default FieldList;
