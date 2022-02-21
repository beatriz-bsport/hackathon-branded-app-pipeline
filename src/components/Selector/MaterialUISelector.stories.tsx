import { Chip, MenuItem } from '@material-ui/core';
import React, { useState } from 'react';
import MaterialUISelector, { OwnProps } from './MaterialUISelector.component';
import { AccessAlarm } from '@material-ui/icons';

const CustomTemplate = (args: OwnProps<{ label: string; value: string }>) => {
  const [value, setValue] = useState(args.value);
  return (
    <MaterialUISelector
      {...args}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    />
  );
};

const options = [
  { label: 'Zinédine Zidane', value: 'Zinédine Zidane' },
  { label: 'Fabien Barthez', value: 'Fabien Barthez' },
  { label: 'Bernard Lama', value: 'Bernard Lama' },
  { label: 'Vincent Candela', value: 'Vincent Candela' },
  { label: 'Bixente Lizarazu', value: 'Bixente Lizarazu' },
  { label: 'Laurent Blanc', value: 'Laurent Blanc' },
  { label: 'Marcel Desailly', value: 'Marcel Desailly' },
  { label: 'Lilian Thuram', value: 'Lilian Thuram' },
  { label: 'Frank Lebœuf', value: 'Frank Lebœuf' },
  { label: 'Patrick Vieira', value: 'Patrick Vieira' },
  { label: 'Youri Djorkaeff', value: 'Youri Djorkaeff' },
  { label: 'Didier Deschamps', value: 'Didier Deschamps' },
  { label: 'Robert Pirès', value: 'Robert Pirès' },
  { label: 'Emmanuel Petit', value: 'Emmanuel Petit' },
  { label: 'Christian Karembeu', value: 'Christian Karembeu' },
  { label: 'Stéphane Guivarc', value: 'Stéphane Guivarc' },
  { label: 'Thierry Henry', value: 'Thierry Henry' },
  { label: 'David Trezeguet', value: 'David Trezeguet' },
  { label: 'Christophe Dugarry', value: 'Christophe Dugarry' },
];

const GroupedOption = [
  {
    label: 'Groupe 1',
    options: options.slice(0, 5),
  },
  {
    label: 'Groupe 2',
    options: options.slice(5, 10),
  },
];

const defaultOption = {
  options: options,
  value: null,
};

export const SingleSelect = CustomTemplate.bind({});

SingleSelect.args = {
  ...defaultOption,
};

export const SingleSelectWithCustomRow = CustomTemplate.bind({});

SingleSelectWithCustomRow.args = {
  ...defaultOption,
  itemRenderer: (props: {
    data: any;
    children: React.ReactNode;
    isSelected: boolean;
    isDisabled: boolean;
  }) => {
    return (
      <MenuItem selected={props.isSelected} dense>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AccessAlarm
            style={{
              marginRight: 24,
            }}
          />
          {props.children}
        </div>
      </MenuItem>
    );
  },
};

export const SingleSelectSelected = CustomTemplate.bind({});

SingleSelectSelected.args = {
  ...defaultOption,
  value: options[1],
};

export const SingleSelectClearable = CustomTemplate.bind({});

SingleSelectClearable.args = {
  ...defaultOption,
  isClearable: true,
};

export const SingleSelectWithIcon = CustomTemplate.bind({});

SingleSelectWithIcon.args = {
  ...defaultOption,
  leftIcon: <AccessAlarm />,
};

export const SingleSelectVirtualized = CustomTemplate.bind({});

SingleSelectVirtualized.args = {
  ...defaultOption,
  isMenuListVirtualized: true,
};

export const SingleSelectGroupedOption = CustomTemplate.bind({});

SingleSelectGroupedOption.args = {
  ...defaultOption,
  options: GroupedOption,
  value: [],
};

export const DefaultMultiSelect = CustomTemplate.bind({});

DefaultMultiSelect.args = {
  ...defaultOption,
  isMulti: true,
  value: [],
};

export const DefaultMultiSelectVirtualized = CustomTemplate.bind({});

DefaultMultiSelectVirtualized.args = {
  ...defaultOption,
  isMenuListVirtualized: true,
  isMulti: true,
  value: [],
};

export const DefaultMultiSelectSelected = CustomTemplate.bind({});

DefaultMultiSelectSelected.args = {
  ...defaultOption,
  isMulti: true,
  value: [options[1], options[2]],
};

export const MultiSelectCustomChip = CustomTemplate.bind({});

MultiSelectCustomChip.args = {
  ...defaultOption,
  isMulti: true,
  value: [options[1], options[2]],
  chipsRenderer: (props: { data: any; onDelete: () => void }) => (
    <Chip
      label={props.data.label}
      onDelete={props.onDelete}
      variant="outlined"
      color="secondary"
    />
  ),
};

export const MultiSelectGroupedOption = CustomTemplate.bind({});

MultiSelectGroupedOption.args = {
  ...defaultOption,
  options: GroupedOption,
  isMulti: true,
  value: [],
};

export default {
  title: 'Components/Input/Selector',
  component: MaterialUISelector,
  parameters: {
    docs: {
      page: null,
    },
  },
};
