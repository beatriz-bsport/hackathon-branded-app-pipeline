import React from 'react';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import LabelOff from '@material-ui/icons/LabelOff';
import chroma from 'chroma-js';

type Props = {
  goToAppointments: () => void;
};

const PrivateServiceIneligibleBanner: React.FC<Props> = ({
  goToAppointments,
}: Props) => {
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();
  return (
    <div className={classes.errorContainer}>
      <div className={classes.ineligibleIconContainer}>
        <LabelOff className={classes.ineligibleIcon} />
      </div>
      <Typography color="textPrimary" variant="h6">
        {t('privateService:privateService.ineligibleService.title')}
      </Typography>
      <Typography color="textPrimary" variant="body1">
        {t('privateService:privateService.ineligibleService.description')}
      </Typography>
      <Button
        className={classes.backToAppointmentsButton}
        onClick={goToAppointments}
        variant="outlined"
      >
        <Typography variant="body1">
          {t(
            'privateService:privateService.ineligibleService.backToAppointments',
          )}
        </Typography>
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: theme.spacing(3),
    gap: theme.spacing(2),
  },
  backToAppointmentsButton: {
    borderRadius: theme.spacing(1),
    color: '#2D3748',
  },
  ineligibleIconContainer: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    backgroundColor: chroma(theme.palette.error.main).alpha(0.1).css(),
  },
  ineligibleIcon: {
    width: '64px',
    height: '64px',
    color: theme.palette.error.main,
  },
}));

export default React.memo(PrivateServiceIneligibleBanner);
