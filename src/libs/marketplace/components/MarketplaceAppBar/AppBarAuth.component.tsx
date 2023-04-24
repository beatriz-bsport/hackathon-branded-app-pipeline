// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

type AuthProps = {
  auth?: Object;
};

const AppBarAuth: React.FC<AuthProps> = ({ auth }) => {
  const classes = useStyles();
  const { t } = useTranslation(['translation', 'consumerSpace']);

  return (
    <Typography
      color="inherit"
      variant="subtitle2"
      className={classes.authInfo}
    >
      {!auth.authenticated && t('consumerSpace:appbar.login')}
      {auth.authenticated && (auth.name !== ' ' ? auth.name : auth.username)}
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  authInfo: {
    marginLeft: theme.spacing(1),
  },
}));

export default AppBarAuth;
