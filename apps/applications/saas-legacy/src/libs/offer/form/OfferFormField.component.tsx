import React from 'react';

import { Typography, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
  isBold?: boolean;
  isError?: boolean;
  isRequired?: boolean;
  label: string;
};

const OfferFormField: React.FC<Props> = ({
  children,
  icon,
  id,
  isBold,
  isError,
  isRequired,
  label,
}) => {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.formFieldContainer, classes.flexColumn, {
        [classes.alignItemsBaseline]: isError,
      })}
      id={id}
    >
      <Typography
        className={clsx({
          [classes.label]: !icon,
          [classes.bold]: !!isBold,
        })}
        variant="body1"
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
  bold: {
    fontWeight: 500,
  },
}));

export default React.memo(OfferFormField);
