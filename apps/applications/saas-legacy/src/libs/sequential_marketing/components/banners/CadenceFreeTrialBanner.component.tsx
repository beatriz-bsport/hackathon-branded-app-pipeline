import React from 'react';

import { useTranslation } from 'react-i18next';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

type Props = {
  daysRemaining: number;
  onUpgradeClick: () => void;
};

const CadenceFreeTrialBanner: React.FC<Props> = ({
  daysRemaining,
  onUpgradeClick,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('marketing');

  if (daysRemaining === 0) {
    return null;
  }

  return (
    <div className={classes.background}>
      <Typography className={classes.text} variant="body1">
        {t('audience.freeTrial.banner.title', { count: daysRemaining })}
      </Typography>
      <Button
        aria-label={t('audience.freeTrial.banner.button')}
        color="primary"
        onClick={onUpgradeClick}
        size="small"
        variant="contained"
      >
        {t('audience.freeTrial.banner.button')}
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  background: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 12px',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    gap: '13px',
  },
  text: {
    fontWeight: 700,
    fontSize: theme.spacing(2),
  },
}));

export default React.memo(CadenceFreeTrialBanner);
