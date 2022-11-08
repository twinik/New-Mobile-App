import { VStack } from "native-base";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";

import { DropdownField } from "../CustomFields";
import Row from "./FieldRow";

const List = ({ depth, formParentName, isSelectedList }) => {
  const { control } = useFormContext();
  const fieldArray = useFieldArray({
    control,
    name: formParentName,
    shouldUnregister: true,
  });

  if (!isSelectedList) {
    return null;
  }
  return (
    <Fragment>
      {fieldArray.fields.map((field, index) => (
        <Row
          key={field.id}
          depth={depth}
          index={index}
          formParentName={formParentName}
          fieldName={field.field_name}
          agentCanAccess={field.agent_can}
          fieldType={field.field_type}
          isRequired={field.is_mandatory === "mandatory"}
          // Field_value is contain different values e.g. for dropdown it contain options, for checkbox it contain options...
          fieldValue={field.field_value}
          fleetData={field.fleet_data}
          isLastItem={fieldArray.fields.length === index + 1}
        />
      ))}
    </Fragment>
  );
};

const ConditionalFieldList = React.memo(
  ({
    depth,
    index,
    name,
    formParentName,

    fieldName,
    agentCanAccess,
    fieldType,
    isRequired,
    fieldValue, //Field_value contains options "option1,option2,option3"
    fleetData,
    options,
  }) => {
    const { control } = useFormContext();
    const selectedOption = useWatch({
      control,
      name: name,
    });
    const [selectedIndex, setIndex] = useState(() => {
      if (!!fleetData) {
        const indx = options?.findIndex((opt) => {
          return opt === fleetData;
        });
        return indx;
      } else {
        return -1;
      }
    });

    useEffect(() => {
      if (!!selectedOption) {
        const indx = options?.findIndex((opt) => {
          return opt === selectedOption;
        });
        setIndex(indx);
      }
    }, [selectedOption]);
    console.log("selectedOption", selectedOption, options);
    return (
      <VStack>
        <DropdownField
          label={fieldName}
          //   options={options}
          optionsStr={fieldValue}
          name={name}
          isRequired={isRequired}
        />
        {/* ----------------------------------------- */}
        {options !== -1 &&
          options?.map((_, fi) => (
            <List
              key={fi}
              index={fi}
              formParentName={`${formParentName}.${fi}.items`}
              isSelectedList={selectedIndex * 1 === fi}
              selectedIndex={selectedIndex}
              depth={depth}
            />
          ))}
      </VStack>
    );
  }
);

export default ConditionalFieldList;
