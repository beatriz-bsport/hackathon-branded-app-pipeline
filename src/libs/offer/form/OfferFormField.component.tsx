import React from 'react';

import { Typography, makeStyles } from '@material-ui/core';
import classNames from 'classnames';

type Props = {
  id?: string;
  isRequired?: boolean;
  label: string;
  icon?: React.ReactNode;
  isFlexColumn?: boolean;
  children: React.ReactNode;
  isError?: boolean;
};

const OfferFormField = (props: Props) => {
  const { id, isRequired, label, icon, isFlexColumn, children, isError } =
    props;
  const classes = useStyles();

  return (
    <div
      id={id}
      className={classNames(classes.formFieldContainer, {
        [classes.flexColumn]: isFlexColumn,
        [classes.alignItemsCenter]: !isError && !isFlexColumn,
        [classes.alignItemsBaseline]: isError,
      })}
    >
      <Typography
        variant="body1"
        className={classNames({
          [classes.typographyContainer]: icon && isFlexColumn,
        })}
      >
        {icon && icon}
        {label}
        {isRequired && ' *'}
      </Typography>

      {children}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  formFieldContainer: {
    display: 'flex',
    gap: theme.spacing(1.25),
    '& .MuiFormHelperText-contained': {
      margin: '3px 0 0 0',
    },
  },
  flexColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  alignItemsBaseline: {
    alignItems: 'baseline',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  typographyContainer: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default OfferFormField;
