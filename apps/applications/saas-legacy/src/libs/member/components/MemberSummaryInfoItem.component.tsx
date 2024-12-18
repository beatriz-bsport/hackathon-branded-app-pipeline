import React from 'react';

import Typography from '@material-ui/core/Typography';

import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  container: { marginBottom: theme.spacing(2) },
  line: {
    display: 'flex',
    alignItems: 'center',
  },
  value: { marginLeft: theme.spacing(1), marginRight: theme.spacing(1) },
  label: { marginBottom: theme.spacing(1) },
}));

type Props = {
  label?: string;
  icon: React.ReactElement;
  value: string;
  valueExtra?: React.ReactElement;
};

export const MemberSummaryInfoItem: React.FC<Props> = ({
  icon,
  value,
  label,
  valueExtra,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {label && (
        <Typography
          className={classes.label}
          color="textSecondary"
          variant="body1"
        >
          {label}
        </Typography>
      )}
      <div className={classes.line}>
        {icon}
        <Typography className={classes.value} variant="body1">
          {value}
        </Typography>
        {!!valueExtra && valueExtra}
      </div>
    </div>
  );
};

export default MemberSummaryInfoItem;
