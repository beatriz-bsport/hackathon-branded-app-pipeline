import React from 'react';
import classNames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

type Props = {
  placeholder: string;
  name?: string;
  value: any;
  changeValue: (event: React.ChangeEvent) => void;
  children?: any;
  minRows: number;
  style?: any;
  withMarginBottom?: boolean;
  withColumnDirection?: boolean;
  inputProps?: any;
  onFocus: () => void;
};

const TextFieldWithChildren = (props: Props) => {
  const classes = useStyles();
  return (
    <div
      className={classNames(classes.container, {
        [classes.withMarginBottom]: props.withMarginBottom,
        [classes.withColumnDirection]: props.withColumnDirection,
      })}
    >
      <TextField
        fullWidth
        inputProps={props.inputProps}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        InputProps={{
          classes: {
            notchedOutline: classes.borderStyleOverride,
            input: classes.inputFieldOverride,
            inputMultiline: classes.inputFieldOverride,
            root: classes.borderStyleOverride,
          },
        }}
        minRows={props.minRows ?? 1}
        multiline={props.minRows > 1}
        name={props.name ?? ''}
        onChange={props.changeValue}
        onFocus={props.onFocus}
        placeholder={props.placeholder}
        style={props.style}
        value={props.value}
        variant="outlined"
      />
      {props.children}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    border: 'solid 1px',
    borderColor: theme.palette.divider,
    borderRadius: theme.spacing(1),
  },
  inputFieldOverride: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
    marginBottom: theme.spacing(1),
  },
}));

export default TextFieldWithChildren;
