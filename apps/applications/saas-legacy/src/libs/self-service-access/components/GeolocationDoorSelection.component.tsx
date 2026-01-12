import React from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, makeStyles } from '@material-ui/core';
import Typography from '#src/components/css-only/Fabrique/Typography';
import { ErrorIcon } from '#src/components/icons/ErrorIcon.component';
import { useGeolocation } from '../hooks/useGeolocation';
import DoorSelection from './DoorSelection.component';

type Props = {
  companyId: number;
};

const useStyles = makeStyles((theme) => ({
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(4),
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(4),
  },
}));

export default function GeolocationDoorSelection({ companyId }: Props) {
  const { t } = useTranslation(['b2c_accessControl']);
  const classes = useStyles();
  const { loading, error, userLocation } = useGeolocation();

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
        <Typography align="center" variant="body-md">
          {t('openDoorButton.loading.geolocation')}
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.errorContainer}>
        <ErrorIcon />
        <Typography align="center" color="error" variant="body-lg">
          {error.message}
        </Typography>
      </div>
    );
  }

  return <DoorSelection companyId={companyId} userLocation={userLocation} />;
}
