import { makeStyles, Theme } from '@material-ui/core';
import type { CustomOptions, StylesProps } from './types';

const defaultFocusOptions = {
  withFocus: false,
  childrenFocus: false,
  updateFocus: () => {},
  onFocus: () => {},
};
const defaultHoverOptions = {
  childrenHover: false,
};
const defaultRowsOptions = {
  minRows: 1,
};
const defaultMarginOptions = {
  bottom: false,
};
const defaultDisplayOptions = {
  column: false,
};
const defaultTextFieldStyleOptions = {
  style: {},
};

const defaultCustomOptions: CustomOptions = {
  textField: defaultTextFieldStyleOptions,
  focus: defaultFocusOptions,
  hover: defaultHoverOptions,
  rows: defaultRowsOptions,
  margin: defaultMarginOptions,
  display: defaultDisplayOptions,
};

export const useCustomOptions = ({
  customOptions,
}: {
  customOptions: CustomOptions;
}) => {
  const { textField, focus, hover, rows, margin, display } =
    customOptions ?? defaultCustomOptions;

  const { style } = textField ?? defaultTextFieldStyleOptions;
  const { withFocus, childrenFocus, updateFocus, onFocus } =
    focus ?? defaultFocusOptions;
  const { childrenHover } = hover ?? defaultHoverOptions;

  const { minRows } = rows ?? defaultRowsOptions;
  const { bottom } = margin ?? defaultMarginOptions;
  const { column } = display ?? defaultDisplayOptions;

  return {
    textFieldStyle: style,
    withFocus,
    childrenFocus,
    updateFocus,
    onFocus,
    childrenHover,
    minRows,
    withMarginBottom: bottom,
    withColumnDirection: column,
  };
};

export const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    border: ({ focus }) => (focus ? 'solid 2px' : 'solid 1px'),
    marginTop: ({ focus }) => focus && '-1px',
    marginRight: ({ focus }) => focus && '-1px',
    marginLeft: ({ focus }) => focus && '-1px',
    borderColor: ({ focus }) =>
      focus ? theme.palette.primary.main : theme.palette.divider,
    borderRadius: theme.spacing(1),
  },
  inputFieldOverride: {
    paddingTop: ({ minRows }) =>
      minRows > 1 ? theme.spacing(2) : theme.spacing(1),
    paddingBottom: ({ minRows }) =>
      minRows > 1 ? theme.spacing(2) : theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '&::placeholder': {
      color: theme.palette.grey[900],
    },
  },
  textField: {
    padding: theme.spacing(1),
  },
  borderStyleOverride: {
    border: 'none',
    padding: 0,
  },
  withColumnDirection: {
    flexDirection: 'column',
  },
  withMarginBottom: {
    marginBottom: ({ focus }) =>
      focus ? theme.spacing(1) - 1 : theme.spacing(1),
  },
}));
