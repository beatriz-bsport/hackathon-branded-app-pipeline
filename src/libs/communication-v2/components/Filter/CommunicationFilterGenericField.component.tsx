import React, { useCallback } from 'react';
import Select from 'react-select';
import chroma from 'chroma-js';
import { colors } from '@bsport/common/lib/colors';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { SelectFieldItem } from '#libs/communication-v2/types';

type selectorStyle = { option: any };
type selectorStateType = {
  isDisabled: boolean;
  isFocused: boolean;
  isSelected: boolean;
};

type GenericProps = {
  fieldName: string;
  fieldPlaceholder: string;
  fieldChoices: SelectFieldItem[];
  fieldValues: SelectFieldItem[];
  fieldValuesSetter: (values: SelectFieldItem[]) => void;
  noMulti?: boolean;
};
export const CommunicationFilterGenericField = (props: GenericProps) => {
  const classes = useStyles();
  const {
    fieldName,
    fieldPlaceholder,
    fieldChoices,
    fieldValues,
    fieldValuesSetter,
    noMulti,
  } = props;
  const setFieldValue = useCallback(
    (values: SelectFieldItem[]) => {
      if (noMulti) {
        fieldValuesSetter(values?.length > 0 ? [values.at(-1)] : []);
      } else {
        fieldValuesSetter(values);
      }
    },
    [fieldValuesSetter, noMulti],
  );
  return (
    <Grid container className={classes.container} spacing={1}>
      <Grid item sm={3} xs={12}>
        <Typography className={classes.title} variant="body2">
          {fieldName}
        </Typography>
      </Grid>
      <Grid item sm={9} xs={12}>
        <Select
          closeMenuOnSelect
          isMulti
          className={classes.selector}
          onChange={setFieldValue}
          options={fieldChoices}
          placeholder={fieldPlaceholder}
          styles={{ ...selectorStyles }}
          value={fieldValues}
        />
      </Grid>
    </Grid>
  );
};

const selectorStyles: selectorStyle = {
  option: (
    styles: any,
    { isDisabled, isFocused, isSelected }: selectorStateType,
  ) => {
    const color = chroma(colors.secondary);

    const backgroundColor = (_isFocused: boolean, _isSelected: boolean) => {
      let backColor = null;
      if (_isSelected) {
        backColor = color.alpha(0.1).css();
      } else if (_isFocused) {
        backColor = color.alpha(0.05).css();
      }
      return backColor;
    };

    return {
      ...styles,
      backgroundColor: backgroundColor(isFocused, isSelected),
      color: 'black',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && color.alpha(0.1).css(),
      },
    };
  },
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    [theme.breakpoints.up('xs')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  selector: {
    [theme.breakpoints.up('sm')]: {
      width: '70%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  title: {
    color: theme.palette.text.secondary,
  },
}));

export default CommunicationFilterGenericField;
