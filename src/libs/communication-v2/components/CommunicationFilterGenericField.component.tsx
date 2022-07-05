import React, { useCallback } from 'react';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { SelectFieldItem } from '../types';

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
        <Typography variant="body2" className={classes.title}>
          {fieldName}
        </Typography>
      </Grid>
      <Grid item sm={9} xs={12}>
        <Select
          closeMenuOnSelect
          isMulti
          placeholder={fieldPlaceholder}
          options={fieldChoices}
          onChange={setFieldValue}
          className={classes.selector}
          menuPortalTarget={document.querySelector('body')}
          value={fieldValues}
        />
      </Grid>
    </Grid>
  );
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
