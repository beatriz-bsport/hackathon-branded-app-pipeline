import React from 'react';
import { makeStyles, Theme, Chip, Typography } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import { SelectFieldItem } from '../types';

type GenericProps = {
  title: string;
  filterValues: Array<SelectFieldItem>;
  popFilterValue: (index: number) => void;
};

export const CommunicationFilterValuesGenericSummary = (
  props: GenericProps,
) => {
  const { title, filterValues, popFilterValue } = props;
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="body2" className={classes.title}>
        {title}
      </Typography>
      <div className={classes.valuesContainer}>
        {filterValues.map((item: SelectFieldItem, index: number) => (
          <Chip
            key={index}
            clickable={false}
            label={item.label}
            onDelete={() => {
              popFilterValue(index);
            }}
            size="small"
            className={classes.chip}
            deleteIcon={<Close className={classes.icon} />}
          />
        ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  chip: {
    borderRadius: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.grey[200],
  },
  container: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  icon: {
    color: theme.palette.text.primary,
  },
  title: {
    color: theme.palette.text.disabled,
  },
  valuesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}));

export default CommunicationFilterValuesGenericSummary;
