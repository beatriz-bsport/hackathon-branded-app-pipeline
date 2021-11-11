// @flow
import React from 'react';
import chroma from 'chroma-js';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { colors } from '@bsport/common/lib/colors';
import Select from 'react-select';
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
import type { PaymentPackCategory } from '../../types';
import { MaterialStyleType } from '../../../../utils/types';

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
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
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

type ValueContainerProps = {
  children: Node,
  selectProps: SelectProps,
};
function ValueContainer(props: ValueContainerProps) {
  return (
    <div
      id="value-container"
      className={props.selectProps.classes.valueContainer}
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
  ValueContainer,
};

const getPackPaymentPackCategoryList = (
  paymentPackCategory: Array<PaymentPackCategory>,
) =>
  paymentPackCategory.map((ppC) => ({
    label: ppC.name,
    value: ppC.id,
  }));
const packPackcategoryStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    const color = chroma(colors.secondary);
    /* eslint-disable */ return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? colors.secondary
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : colors.secondary,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor:
          !isDisabled &&
          (isSelected ? colors.secondary : color.alpha(0.3).css()),
      },
      groupHeading: (base) => ({ ...base, margin: 0 }),
    };

    /* eslint-enable */
  },
  multiValue: (styles) => {
    const color = chroma(colors.secondary);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: colors.secondary,
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: colors.secondary,
    ':hover': {
      backgroundColor: colors.secondary,
      color: 'white',
    },
  }),
};

type OwnProps = {
  packPackCategoryList?: Array<PaymentPackCategory>,
  onChange: (Suggestion: { label: string, value: number }) => void,
  disabled?: boolean,
  noMulti: boolean,
  closeMenuOnSelect: boolean,
  isClearable: boolean,
  isLoading?: boolean,
  value: number | null,
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
export function PaymentPackCategorySelector(props: Props) {
  const {
    t,
    className,
    packPackCategoryList,
    onChange,
    closeMenuOnSelect,
    disabled,
    noMulti,
    isClearable,
    isLoading,
    value,
  } = props;
  const { classes } = props;
  const selected = value
    ? getPackPaymentPackCategoryList([...packPackCategoryList]).find(
        (option) => option.value === value,
      )
    : null;
  return (
    <div className={`${className || ''} ${classes.root}`}>
      <Select
        closeMenuOnSelect={!!closeMenuOnSelect}
        isMulti={!noMulti}
        classes={classes}
        placeholder={t('form.paymentPack.category.helperText')}
        components={{ ...components, ...props.components }}
        options={getPackPaymentPackCategoryList([...packPackCategoryList])}
        styles={packPackcategoryStyles}
        onChange={onChange}
        isDisabled={disabled}
        isClearable={isClearable}
        menuPortalTarget={document.querySelector('body')}
        value={selected}
        isLoading={isLoading}
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
export default compose(
  withStyles(styles, { withTheme: true }),
  withTranslation(['paymentPack']),
)(PaymentPackCategorySelector);
