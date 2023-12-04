import { OperationWrapper } from '../Operations';
import {
  AttributeValue,
  ProficiencyType,
  ProficiencyValue,
  VariableType,
  VariableValue,
} from '@typing/variables';
import { JsonInput, NumberInput, SegmentedControl, Select, TextInput } from '@mantine/core';

export function CreateValOperation(props: {
  variable: string;
  onNameChange: (variable: string) => void;
  variableType: VariableType;
  onTypeChange: (variable: VariableType) => void;
  value: VariableValue;
  onValueChange: (value: VariableValue) => void;
  onRemove: () => void;
}) {
  return (
    <OperationWrapper onRemove={props.onRemove} title='Create Value'>
      <Select
        placeholder='Value Type'
        size='xs'
        w={110}
        value={props.variableType}
        onChange={(value) => {
          if (!value) return;
          props.onTypeChange(value as VariableType);
        }}
        data={[
          {
            label: 'Number',
            value: 'num',
          },
          {
            label: 'Text',
            value: 'str',
          },
          {
            label: 'Boolean',
            value: 'bool',
          },
          {
            label: 'Proficiency',
            value: 'prof',
          },
          {
            label: 'Attribute',
            value: 'attr',
          },
          {
            label: 'List of Text',
            value: 'list-str',
          },
        ]}
      />
      <TextInput
        ff='Ubuntu Mono, monospace'
        size='xs'
        placeholder='Value Name'
        w={190}
        value={props.variable}
        onChange={(value) => {
          const variable = value.target.value.toUpperCase().replace(/\s/g, '_');
          props.onNameChange(variable);
        }}
      />
      <CreateValueInput
        variableType={props.variableType}
        value={props.value}
        onChange={(value) => {
          props.onValueChange(value);
        }}
      />
    </OperationWrapper>
  );
}

function CreateValueInput(props: {
  variableType: VariableType;
  value: VariableValue;
  onChange: (value: VariableValue) => void;
}) {
  if (props.variableType === 'num') {
    return (
      <NumberInput
        size='xs'
        placeholder='Number'
        value={props.value as number}
        onChange={(value) => props.onChange(parseInt(`${value}`))}
        allowDecimal={false}
      />
    );
  } else if (props.variableType === 'attr') {
    return (
      <NumberInput
        size='xs'
        prefix={(props.value as number) >= 0 ? '+' : undefined}
        placeholder='Number'
        value={props.value as number}
        onChange={(value) => props.onChange(parseInt(`${value}`))}
        allowDecimal={false}
      />
    );
  } else if (props.variableType === 'bool') {
    return (
      <SegmentedControl
        size='xs'
        value={props.value ? 'TRUE' : 'FALSE'}
        onChange={props.onChange}
        defaultValue='TRUE'
        data={[
          { label: 'True', value: 'TRUE' },
          { label: 'False', value: 'FALSE' },
        ]}
      />
    );
  } else if (props.variableType === 'str') {
    return (
      <TextInput
        size='xs'
        placeholder='Text'
        value={props.value as string}
        onChange={(event) => props.onChange(event.target.value.toLowerCase())}
      />
    );
  } else if (props.variableType === 'prof') {
    return (
      <SegmentedControl
        size='xs'
        value={(props.value as ProficiencyValue)?.value || undefined}
        onChange={props.onChange}
        data={[
          { label: 'U', value: 'U' },
          { label: 'T', value: 'T' },
          { label: 'E', value: 'E' },
          { label: 'M', value: 'M' },
          { label: 'L', value: 'L' },
        ]}
      />
    );
  } else if (props.variableType === 'list-str') {
    return (
      <JsonInput
        size='xs'
        value={props.value as string}
        onChange={props.onChange}
        placeholder='Array contents as JSON'
        validationError={undefined}
        formatOnBlur
        autosize
        minRows={4}
      />
    );
  }
  return null;
}
