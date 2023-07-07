import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import type { Theme } from '#libs/theme/types';

type Props = {
  theme: Theme;
  staffFullName: string;
  onSignOut: () => void;
};

const QuicksaleAppBar: React.FC<Props> = ({
  theme,
  staffFullName,
  onSignOut,
}) => {
  const { t } = useTranslation('quicksale');

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.companyInfo}>
        <img
          src={theme?.cover}
          height={40}
          alt="company logo"
          className={classes.companyLogo}
        />
        <Typography variant="subtitle2">{theme?.company_name}</Typography>
      </div>

      <div className={classes.sellerInfoAndLogOut}>
        <div className={classes.sellerInfo}>
          <Typography variant="subtitle2" className={classes.seller}>
            {t('interface.seller')}
          </Typography>
          <Typography variant="body2">{staffFullName}</Typography>
        </div>
        <IconButton onClick={onSignOut} className={classes.signOutButton}>
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
