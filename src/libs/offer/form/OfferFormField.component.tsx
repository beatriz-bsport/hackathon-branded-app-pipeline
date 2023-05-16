import React from 'react';

import { Typography, makeStyles } from '@material-ui/core';
import classNames from 'classnames';

type Props = {
  id?: string;
  isRequired?: boolean;
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isError?: boolean;
};

const OfferFormField = (props: Props) => {
  const { id, isRequired, label, icon, children, isError } = props;
  const classes = useStyles();

  return (
    <div
      id={id}
      className={classNames(classes.formFieldContainer, classes.flexColumn, {
        [classes.alignItemsBaseline]: isError,
      })}
    >
      <Typography
        variant="body1"
        className={classNames({
          [classes.label]: !icon,
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
  typographyContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 400,
    marginBottom: -6,
  },
}));

export default OfferFormField;
