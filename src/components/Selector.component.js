// @flow

import React, { Node } from 'react';

import { compose } from 'recompose';

import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';

import withStyles from '@material-ui/core/styles/withStyles';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

type SelectProps = {
  classes: {
    valueContainer: string,
    noOptionsMessage: string,
    input: string,
    placeholder: string,
    singleValue: string,
    chip: string,
    paper: string,
    inputIcon: string,
    inputWrapper: string,
  },
  textFieldProps: any,
  searchIcon: boolean,
};

type NoOptionsMessageProps = {
  selectProps: SelectProps,
  innerProps: any,
  children: React.Node,
};

function NoOptionsMessage(props: NoOptionsMessageProps) {
  return (
    <Typography
      className={props.selectProps.classes.noOptionsMessage}
      color="textSecondary"
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

type InputComponentProps = {
  inputRef: any,
};
function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />;
}

type ControlProps = {
  selectProps: SelectProps,
  innerRef: any,
  children: React.Node,
  innerProps: any,
};

function Control(props: ControlProps) {
  const adornment = props.selectProps.searchIcon ? (
    <InputAdornment position="start">
      <SearchIcon />
    </InputAdornment>
  ) : null;
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        startAdornment: adornment,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

type OptionProps = {
  innerRef: any,
  isFocused: boolean,
  isSelected: boolean,
  innerProps: any,
  children: React.Node,
};
function Option(props: OptionProps) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      component="div"
      selected={props.isFocused}
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

type PlaceholderProps = {
  selectProps: SelectProps,
  children: React.Node,
  innerProps: any,
};
function Placeholder(props: PlaceholderProps) {
  return (
    <Typography
      color="textSecondary"
      {...props.innerProps}
      style={{ minHeight: 64 }}
    >
      {props.children}
    </Typography>
  );
}

type SingleValueProps = {
  selectProps: SelectProps,
  children: React.Node,
  innerProps: any,
};

function SingleValue(props: SingleValueProps) {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

type ValueContainerProps = {
  children: Node,
  selectProps: SelectProps,
};
function ValueContainer(props: ValueContainerProps) {
  return (
    <div
      className={props.selectProps.classes.valueContainer}
      id="value-container"
    >
      {props.children}
    </div>
  );
}

type MultiValueProps = {
  selectProps: SelectProps,
  removeProps: any,
  children: React.Node,
};
function MultiValue(props: MultiValueProps) {
  return (
    <Chip
      className={props.selectProps.classes.chip}
      deleteIcon={<CancelIcon {...props.removeProps} />}
      label={props.children}
      onDelete={props.removeProps.onClick}
      tabIndex={-1}
    />
  );
}

type MenuProps = {
  children: React.Node,
  innerProps: any,
  selectProps: SelectProps,
};
function Menu(props: MenuProps) {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

export type Suggestion = { value: number, name: string };
type Theme = { palette: { text: { primary: string } } };

type IntegrationReactSelectProps = {
  className: ?string,
  classes: { [string]: string },
  suggestions: Suggestion[],
  selected: number,
  isClearable?: boolean,
  placeholder: string,
  onChange: (Suggestion) => void,
  theme: Theme,
  onCreateOption: (label: string) => void,
  components: Object,
  searchIcon: boolean,
  isMulti: boolean,
  nullCurrentValue?: boolean,
  filterOption: (option: Suggestion, text: string) => void,
  autofocus: boolean,
  id: string,
  isDisabled: boolean,
};

function IntegrationReactSelect(props: IntegrationReactSelectProps) {
  const {
    classes,
    className,
    theme,
    suggestions,
    placeholder,
    selected,
    onChange,
    onCreateOption,
    searchIcon,
    isMulti,
    autofocus,
    nullCurrentValue,
    isDisabled,
  } = props;

  const selectStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    input: (base) => ({
      ...base,
      flex: 1,
      position: 'fixed',
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
    singleValue: (base) => ({
      ...base,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
  };
  const SelectComponent =
    typeof onCreateOption === 'function' ? CreatableSelect : Select;

  const valueSelector = (
    multi: boolean,
    suggestionValues: Array<any>,
    selectedValues: any,
  ) => {
    if (multi) {
      return selectedValues
        ? suggestionValues.filter((s) => selectedValues.includes(s.value))
        : null;
    }
    return suggestionValues.find((s) => s.value === selectedValues);
  };
  return (
    <div className={`${className || ''} ${classes.root}`}>
      <SelectComponent
        autofocus={autofocus}
        classes={classes}
        components={{ ...components, ...props.components }}
        filterOption={props.filterOption}
        id={props.id}
        isClearable={props.isClearable}
        isDisabled={isDisabled}
        isMulti={isMulti}
        menuPortalTarget={document.querySelector('body')}
        onChange={onChange}
        onCreateOption={onCreateOption}
        options={suggestions}
        placeholder={placeholder}
        searchIcon={searchIcon}
        styles={selectStyles}
        value={
          nullCurrentValue
            ? null
            : valueSelector(isMulti, suggestions, selected)
        }
      />
    </div>
  );
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(1),
  },
  input: {
    display: 'flex',
    padding: theme.spacing(1),
    paddingLeft: 0,
  },
  valueContainer: {
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  chip: {
    margin: `${theme.spacing(1) / 2}px ${theme.spacing(1) / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
});

export default compose(withStyles(styles, { withTheme: true }))(
  IntegrationReactSelect,
);
