// @flow

import React from 'react';
import type { Node } from 'react';

import { compose } from 'recompose';

import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';

import { withStyles } from '@material-ui/core/styles';
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
  textFieldProps: *,
  searchIcon: boolean,
};

type NoOptionsMessageProps = {
  selectProps: SelectProps,
  innerProps: *,
  children: React.Node,
};

function NoOptionsMessage(props: NoOptionsMessageProps) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

type InputComponentProps = {
  inputRef: *,
};
function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />;
}

type ControlProps = {
  selectProps: SelectProps,
  innerRef: *,
  children: React.Node,
  innerProps: *,
};

function Control(props: ControlProps) {
  console.log(props.selectProps);
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
  innerRef: *,
  isFocused: boolean,
  isSelected: boolean,
  innerProps: *,
  children: React.Node,
};
function Option(props: OptionProps) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
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
  innerProps: *,
};
function Placeholder(props: PlaceholderProps) {
  return (
    <Typography color="textSecondary" {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

type SingleValueProps = {
  selectProps: SelectProps,
  children: React.Node,
  innerProps: *,
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
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
}

type MultiValueProps = {
  selectProps: SelectProps,
  removeProps: *,
  children: React.Node,
};
function MultiValue(props: MultiValueProps) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={props.selectProps.classes.chip}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

type MenuProps = {
  children: React.Node,
  innerProps: *,
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

type Suggestion = { value: number, name: string };
type Theme = { palette: { text: { primary: string } } };

type IntegrationReactSelectProps = {
  className: ?string,
  classes: { [string]: string },
  suggestions: Suggestion[],
  selected: number,
  placeholder: string,
  onChange: (Suggestion) => void,
  theme: Theme,
  onCreateOption: (label: string) => void,
  components: Object,
  searchIcon: boolean,
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
  } = props;

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };

  const SelectComponent =
    typeof onCreateOption === 'function' ? CreatableSelect : Select;

  return (
    <div className={`${className || ''} ${classes.root}`}>
      <SelectComponent
        classes={classes}
        styles={selectStyles}
        options={suggestions}
        components={{ ...components, ...props.components }}
        value={suggestions.find((s) => s.value === selected)}
        onChange={onChange}
        placeholder={placeholder}
        onCreateOption={onCreateOption}
        searchIcon={searchIcon}
      />
    </div>
  );
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing.unit,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
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
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

export default compose(withStyles(styles, { withTheme: true }))(
  IntegrationReactSelect,
);
