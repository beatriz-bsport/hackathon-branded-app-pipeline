// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';
import type { TFunction } from 'react-i18next';

type Props = {
  errorCode: string,
  declineCode: string,
  t: TFunction,
};

export const StripeErrorCode = (props: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="caption" color="error">
        {props.t(`error_code.${props.errorCode}`)}
      </Typography>
      <Typography variant="caption" color="error">
        {props.t(`decline_code.${props.declineCode || 'none'}`)}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    '&>*': {
      marginBottom: theme.spacing(0.5),
    },
  },
}));

export default withTranslation(['stripe'])(StripeErrorCode);
