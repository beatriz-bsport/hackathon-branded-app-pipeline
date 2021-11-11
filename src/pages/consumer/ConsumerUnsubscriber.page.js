// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose, withState, withHandlers } from 'recompose';
import CheckIcon from '@material-ui/icons/Check';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { postUnsubscribe } from '../../libs/member/api';

type Props = {
  success: boolean,
  error: ?Error,
  loading: boolean,
  doUnsubscribe: () => void,
};
export const ConsumerUnsubscriber = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['consumerSpace']);
  if (props.success) {
    return (
      <div className={classes.container}>
        <CheckIcon fontSize="large" color="primary" />
        <Typography>{t('unsubscriber.success')}</Typography>
      </div>
    );
  }
  return (
    <div className={classes.container}>
      <Typography>{t('unsubscriber.explain')}</Typography>
      {!!props.error && (
        <Typography color="error">{t('unsubscriber.error')}</Typography>
      )}
      {props.loading ? (
        <CircularProgress />
      ) : (
        <Button variant="outlined" onClick={props.doUnsubscribe}>
          {t('unsubscriber.doUnsubscribe')}
        </Button>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    '&>*': {
      marginBottom: theme.spacing(0.5),
      marginTop: theme.spacing(0.5),
    },
  },
}));

export default compose(
  routerParamsToProps({ unsubscribe_uuid: 'unsubscribe_uuid' }),
  withState('loading', 'setLoading', false),
  withState('success', 'setSuccess', false),
  withState('error', 'setError', null),
  withHandlers({
    doUnsubscribe:
      ({ unsubscribe_uuid, setLoading, setSuccess, setError }) =>
      async () => {
        try {
          setLoading(true);
          setError(false);
          await postUnsubscribe(unsubscribe_uuid);
          setLoading(false);
          setSuccess(true);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      },
  }),
)(ConsumerUnsubscriber);
