// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Theme as CompanyTheme } from '../../../theme/types';
import MarketplaceAppBar from '#libs/marketplace/components/MarketplaceAppBar';
import { MarketplaceSettings } from '#libs/marketplace/types';

type Props = {
  theme: CompanyTheme;
  settings: MarketplaceSettings;
};

const MarketplaceTabPreview: React.FC<Props> = ({ settings, theme }) => {
  const { t } = useTranslation(['settings']);
  const classes = useStyles();
  const tabSelected = settings.config.length > 0 ? '0' : null;
  return (
    <div className={classes.marginTop}>
      <Typography variant="h5" className={classes.sectionTitle}>
        {t('marketplaceSettings.preview')}
      </Typography>
      <Divider className={classes.divider} />
      <Paper className={classes.paper}>
        <MarketplaceAppBar
          onlyNavigation
          theme={theme}
          settings={settings}
          tabSelected={tabSelected}
        />
      </Paper>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'nowrap',
  },
}));

export default MarketplaceTabPreview;
