import React from 'react';
import { useTranslation } from 'react-i18next';

import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import makeStyles from '@material-ui/core/styles/makeStyles';

import classNames from 'classnames';
import { MarketplaceSettings } from '#libs/marketplace/types';
import { EXPORTABLE_COMPONENT_TYPE_VOD } from '#libs/exportable-components/constants';
import { getDefaultTitleForComponent } from '#libs/exportable-components/utils';
import Config from '../../../../config';

type MenuProps = {
  hideAppBar?: boolean;
  onlyNavigation?: boolean;
  handleTabChange?: (
    event: React.SyntheticEvent<HTMLElement>,
    value: number,
  ) => void;
  tabSelected?: string;
  settings?: MarketplaceSettings;
  theme?: any;
};

const AppBarMenu: React.FC<MenuProps> = ({
  hideAppBar,
  onlyNavigation,
  handleTabChange,
  tabSelected,
  settings,
  theme,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['translation', 'consumerSpace']);

  if (hideAppBar) {
    return null;
  }
  return (
    <AppBar
      position="relative"
      color="default"
      classes={{
        root: classNames(classes.appbar, {
          [classes.isFullWidth]: onlyNavigation,
        }),
      }}
    >
      <Tabs
        onChange={handleTabChange || null}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        value={parseInt(tabSelected, 10)}
        classes={{ scrollButtons: classes.scrollButton }}
      >
        {(
          (settings.config && settings.config.tabs ? [] : settings.config) || []
        ).map((tab, i) => {
          if (
            tab.component_type === EXPORTABLE_COMPONENT_TYPE_VOD &&
            !(Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' || theme.vod)
          ) {
            return null;
          }

          let titleTab = tab.title;
          if (!titleTab) {
            titleTab = getDefaultTitleForComponent(tab.component_type, t);
          }

          return (
            <Tab
              value={i}
              key={titleTab}
              label={titleTab}
              classes={{
                root: classes.tabUnselected,
              }}
            />
          );
        })}
      </Tabs>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  appbar: {
    maxWidth: '75%',
    boxShadow: 'none',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    flexDirection: 'row',
    '&:first-child': {
      display: 'table',
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '70%',
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: 'unset',
      order: 3,
    },
  },
  isFullWidth: {
    width: 'unset',
    maxWidth: '100%',
    '&:first-child': {
      display: 'unset',
    },
  },
  scrollButton: {
    color: theme.palette.grey.A200,
  },
  tabUnselected: {
    color: theme.palette.grey[500],
    textTransform: 'none',
    minWidth: 'unset',
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    [theme.breakpoints.down('xs')]: {
      paddingTop: 'inherit',
      paddingBottom: 'inherit',
    },
  },
}));

export default AppBarMenu;
