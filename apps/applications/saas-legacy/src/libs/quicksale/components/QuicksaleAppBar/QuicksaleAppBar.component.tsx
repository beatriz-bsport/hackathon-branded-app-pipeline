import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import type { Theme } from '#src/libs/theme/types';

type Props = {
  theme: Theme;
  staffEstablishmentBillingGroupName: string;
  staffFullName: string;
  onSignOut: () => void;
};

const QuicksaleAppBar: React.FC<Props> = ({
  theme,
  staffEstablishmentBillingGroupName,
  staffFullName,
  onSignOut,
}) => {
  const { t } = useTranslation('quicksale');

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.companyInfo}>
        <img
          alt="company logo"
          className={classes.companyLogo}
          height={40}
          src={theme?.cover}
        />
        <div>
          <Typography variant="subtitle2">{theme?.company_name}</Typography>
          <Typography variant="caption">
            {staffEstablishmentBillingGroupName}
          </Typography>
        </div>
      </div>

      <div className={classes.sellerInfoAndLogOut}>
        <div className={classes.sellerInfo}>
          <Typography className={classes.seller} variant="subtitle2">
            {t('interface.seller')}
          </Typography>
          <Typography variant="body2">{staffFullName}</Typography>
        </div>
        <IconButton className={classes.signOutButton} onClick={onSignOut}>
          <PowerSettingsNewIcon fontSize="large" />
        </IconButton>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontWeight: 500,
  },
  companyLogo: {
    borderRadius: theme.spacing(1),
  },
  sellerInfoAndLogOut: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  sellerInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  seller: {
    fontWeight: 500,
  },
  signOutButton: {
    padding: 0,
  },
}));

export default React.memo(QuicksaleAppBar);
