import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Theme, Tab, Tabs, Typography } from '@material-ui/core';
import { EXPORTABLE_COMPONENT_TYPE_VOD } from '../../../exportable-components/constants';
import { getDefaultTitleForComponent } from '../../../exportable-components/utils';
import { Theme as CompanyTheme } from '../../../theme/types';
import Config from '../../../../config';

type Props = {
  theme: CompanyTheme;
  config: any;
};

const MarketplaceTabPreview = (props: Props) => {
  const { t } = useTranslation(['settings']);
  const { t: tAll } = useTranslation();
  const classes = useStyles();
  const { config, theme } = props;
  return (
    <div className={classes.marginTop}>
      <Typography variant="h4">{t('marketplaceSettings.preview')}</Typography>

      <AppBar position="relative" color="default" className={classes.marginTop}>
        <Tabs
          onChange={() => null}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          value={-1}
        >
          {config.map((tab: any, i: number) => {
            if (
              tab.component_type === EXPORTABLE_COMPONENT_TYPE_VOD &&
              !(
                Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
                theme.vod
              )
            ) {
              return null;
            }

            let { title } = tab;
            if (!title) {
              title = getDefaultTitleForComponent(tab.component_type, tAll);
            }

            return <Tab value={i} label={title} />;
          })}
        </Tabs>
      </AppBar>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  marginTop: {
    marginTop: theme.spacing(2),
  },
}));

export default MarketplaceTabPreview;
