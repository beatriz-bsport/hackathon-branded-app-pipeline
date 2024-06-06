import React from 'react';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

import type { ControlProps } from 'react-select/lib/components/Control';
import type { InputBaseComponentProps } from '@material-ui/core';
import type { ObjectSelectOption } from '#src/libs/fuzzy-search/types';

const UnderlinedSearchBarInputComponent: React.FC<{
  inputRef: React.LegacyRef<HTMLDivElement>;
  props: InputBaseComponentProps;
}> = ({ inputRef, ...props }) => (
  <div
    ref={inputRef}
    style={{ display: 'flex', alignItems: 'center' }}
    {...props}
  />
);

const UnderlinedSearchBarControl: React.FC<ControlProps<ObjectSelectOption>> = (
  props,
) => (
  <TextField
    fullWidth
    InputProps={{
      inputComponent: UnderlinedSearchBarInputComponent,
      startAdornment: <SearchIcon color="secondary" />,
      inputProps: {
        inputRef: props.innerRef,
        children: props.children,
        ...props.innerProps,
      },
    }}
  />
);

export { UnderlinedSearchBarControl };
