// @flow
import React from 'react';

import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  errorCode: string;
  declineCode: string;
};

const StripeErrorCode: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('stripe');

  return (
    <div className={classes.container}>
      {!!props.errorCode && (
        <Typography color="error" variant="caption">
          {t(`error_code.${props.errorCode}`)}
        </Typography>
      )}
      <Typography color="error" variant="caption">
        {t(`decline_code.${props.declineCode || 'none'}`)}
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

export default React.memo(StripeErrorCode);
