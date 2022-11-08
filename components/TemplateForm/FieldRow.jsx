import React, { Fragment, useEffect, useMemo, useState } from "react";
import { VStack } from "native-base";
import { getOptionsFromSeperatedCommaString } from "../../constants";
import CustomField from "./../CustomFields";
// import ConditionalFieldList from "./ConditionalFieldList";
import { DropdownField } from "../CustomFields";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { useDispatch } from "react-redux";
import { updateTaskFieldsAction } from "../../redux/slices/taskSlice";

const FieldRow = ({
  depth,
  index,
  formParentName,

  fieldName, // fieldName is the name of the field in the form or LABEL
  agentCanAccess,
  fieldType,
  // isRequired,
  fieldValue, //Field_value contains options "option1,option2,option3"
  fleetData,

  isLastItem,
  isReadOnlyView,
  is_mandatory,
}) => {
  const dispatch = useDispatch();
  const formName = `${formParentName}.${index}`;
  const formNameNested = `${formName}.child_items`;

  const triggerOnUpdate = (data) => {
    // console.log("triggerOnUpdate->");
    if (!!data) {
      dispatch(updateTaskFieldsAction(data));
    }
  };

  const conditionalDropdownList = useMemo(() => {
    if (fieldType === "conditional_dropdown" && fieldValue) {
      return getOptionsFromSeperatedCommaString(fieldValue);
    } else {
      return [];
    }
  }, [fieldType, fieldValue]);

  const isRequired = is_mandatory === "mandatory" && agentCanAccess !== "read";
  return (
    <Fragment>
      <CustomField
        label={fieldName}
        type={fieldType}
        isRequired={isRequired}
        name={`${formName}.fleet_data`}
        isReadOnlyView={isReadOnlyView || agentCanAccess === "read"}
        triggerOnUpdate={triggerOnUpdate}
        {...{
          agentCanAccess,
          fieldValue,
          fleetData,
        }}
      />
      {conditionalDropdownList?.length > 0 && (
        <ConditionalFieldList
          depth={depth + 1}
          name={`${formName}.fleet_data`}
          formParentName={formNameNested}
          fieldName={fieldName}
          fieldType={fieldType}
          isRequired={isRequired}
          {...{
            agentCanAccess,
            fieldValue,
            fleetData,
            isReadOnlyView,
          }}
          options={conditionalDropdownList}
        />
      )}
    </Fragment>
  );
};
const List = ({ depth, formParentName, isSelectedList }) => {
  const { control } = useFormContext();
  const fieldArray = useFieldArray({
    control,
    name: formParentName,
    // shouldUnregister: true,
  });

  if (!isSelectedList) {
    return null;
  }
  return (
    <Fragment>
      {fieldArray.fields.map((field, index) => (
        <FieldRow
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
    isReadOnlyView,
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

    return (
      <VStack>
        <DropdownField
          label={fieldName}
          //   options={options}
          optionsStr={fieldValue}
          name={name}
          isRequired={isRequired}
          isReadOnlyView={isReadOnlyView}
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

export default FieldRow;
