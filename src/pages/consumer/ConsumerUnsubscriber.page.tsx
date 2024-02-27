import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import CheckIcon from '@material-ui/icons/Check';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
// @ts-expect-error
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { postUnsubscribe } from '#libs/member/api';

type Props = {
  unsubscribe_uuid: string;
};
export const ConsumerUnsubscriber: React.FC<Props> = ({ unsubscribe_uuid }) => {
  const classes = useStyles();
  const { t } = useTranslation('consumerSpace');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const doUnsubscribe = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      await postUnsubscribe(unsubscribe_uuid);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [setIsError, setIsLoading, setIsSuccess, unsubscribe_uuid]);

  if (isSuccess) {
    return (
      <div className={classes.container}>
        <CheckIcon color="primary" fontSize="large" />
        <Typography>{t('unsubscriber.success')}</Typography>
      </div>
    );
  }
  return (
    <div className={classes.container}>
      <Typography>{t('unsubscriber.explain')}</Typography>
      {isError && (
        <Typography color="error">{t('unsubscriber.error')}</Typography>
      )}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Button onClick={doUnsubscribe} variant="outlined">
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
)(ConsumerUnsubscriber);
