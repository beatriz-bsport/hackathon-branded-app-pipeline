import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  InputBaseComponentProps,
  makeStyles,
  type Theme,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

type TextFieldWithChildrenProps = {
  placeholder: string;
  value: any;
  minRows: number;
  changeValue: (event: React.ChangeEvent) => void;
  name?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  withMarginBottom?: boolean;
  withColumnDirection?: boolean;
  inputProps?: InputBaseComponentProps;
  withFocus?: boolean;
  onFocus?: () => void;
  childrenFocus?: boolean;
  childrenHover?: boolean;
  updateFocus?: (focus: boolean) => void;
};

const TextFieldWithChildren: React.FC<TextFieldWithChildrenProps> = ({
  placeholder,
  name,
  value,
  children,
  minRows,
  style,
  withMarginBottom,
  withColumnDirection,
  inputProps,
  withFocus,
  childrenFocus,
  childrenHover,
  changeValue,
  onFocus,
  updateFocus,
}) => {
  const [focus, setFocus] = useState(false);
  const [fieldFocus, setFieldFocus] = useState(false);
  const [fieldFocusNeedReset, setFieldFocusNeedReset] = useState(false);

  const classes = useStyles({
    minRows,
    focus: withFocus && focus,
  });

  useEffect(() => {
    withFocus && updateFocus?.(fieldFocus || childrenFocus);
    withFocus && setFocus(fieldFocus || childrenFocus);
    if (!childrenHover && fieldFocusNeedReset) {
      setFieldFocus(false);
      setFieldFocusNeedReset(false);
    }
  }, [
    childrenFocus,
    withFocus,
    fieldFocus,
    childrenHover,
    fieldFocusNeedReset,
    updateFocus,
    focus,
  ]);

  const handleFocus = useCallback(() => {
    onFocus?.();
    withFocus && setFieldFocus(true);
  }, [onFocus, withFocus]);

  const handleBlur = useCallback(() => {
    withFocus &&
      (childrenHover ? setFieldFocusNeedReset(true) : setFieldFocus(false));
  }, [childrenHover, withFocus]);

  return (
    <div
      className={classNames(classes.container, {
        [classes.withMarginBottom]: withMarginBottom,
        [classes.withColumnDirection]: withColumnDirection,
      })}
    >
      <TextField
        fullWidth
        inputProps={inputProps}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        InputProps={{
          classes: {
            notchedOutline: classes.borderStyleOverride,
            input: classes.inputFieldOverride,
            inputMultiline: classes.inputFieldOverride,
            root: classes.borderStyleOverride,
          },
        }}
        minRows={minRows ?? 1}
        multiline={minRows > 1}
        name={name ?? ''}
        onBlur={handleBlur}
        onChange={changeValue}
        onFocus={handleFocus}
        placeholder={placeholder}
        style={style}
        value={value}
        variant="outlined"
      />
      {children}
    </div>
  );
};

type StylesProps = Pick<TextFieldWithChildrenProps, 'minRows'> & {
  focus: boolean;
};

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
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

export default React.memo(TextFieldWithChildren);
