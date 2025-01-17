import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { InputBaseComponentProps } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { useCustomOptions, useStyles } from './hooks';
import type { CustomOptions } from './types';

type Props = {
  placeholder: string;
  value: string | number;
  changeValue: (event: React.ChangeEvent) => void;
  name?: string;
  children?: React.ReactNode;
  inputProps?: InputBaseComponentProps;
} & { customOptions: CustomOptions };

const TextFieldWithChildren: React.FC<Props> = ({
  placeholder,
  name,
  value,
  children,
  inputProps,
  changeValue,
  customOptions,
}) => {
  const [focus, setFocus] = useState(false);
  const [fieldFocus, setFieldFocus] = useState(false);
  const [fieldFocusNeedReset, setFieldFocusNeedReset] = useState(false);

  const {
    textFieldStyle,
    withFocus,
    childrenFocus,
    updateFocus,
    onFocus,
    childrenHover,
    minRows,
    withMarginBottom,
    withColumnDirection,
  } = useCustomOptions({ customOptions });

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
        style={textFieldStyle}
        value={value}
        variant="outlined"
      />
      {children}
    </div>
  );
};

export default React.memo(TextFieldWithChildren);
