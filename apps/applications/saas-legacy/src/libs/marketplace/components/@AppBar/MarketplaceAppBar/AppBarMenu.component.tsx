import React from 'react';
import { useTranslation } from 'react-i18next';

import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import makeStyles from '@material-ui/core/styles/makeStyles';

import clsx from 'clsx';
import { MarketplaceSettings } from '#src/libs/marketplace/types';
import { EXPORTABLE_COMPONENT_TYPE_VOD } from '#src/libs/exportable-components/constants';
import { getDefaultTitleForComponent } from '#src/libs/exportable-components/utils-common';
import Config from '../../../../../config';

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
      classes={{
        root: clsx(classes.appbar, {
          [classes.isFullWidth]: onlyNavigation,
        }),
      }}
      color="default"
      position="relative"
    >
      <Tabs
        classes={{
          scrollButtons: classes.scrollButton,
          flexContainer: classes.justifyContent,
        }}
        indicatorColor="primary"
        onChange={handleTabChange || null}
        textColor="primary"
        value={parseInt(tabSelected, 10)}
        variant="scrollable"
      >
        {
          // prettier-ignore
          (
        // @ts-expect-error
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
              key={titleTab}
              classes={{
                root: classes.tabUnselected,
              }}
              label={titleTab}
              value={i}
            />
          );
        })
        }
      </Tabs>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  appbar: {
    maxWidth: '70%',
    justifySelf: 'center',
    flex: 10,
    boxShadow: 'none',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    flexDirection: 'row',
    height: '100%',
    '&:first-child': {
      display: 'table',
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '65%',
      flex: 1,
    },
    [theme.breakpoints.down('xs')]: {
      height: 'unset',
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
  justifyContent: {
    height: '100%',
    [theme.breakpoints.down('xs')]: {
      height: 'unset',
    },
  },
  scrollButton: {
    color: theme.palette.grey.A200,
  },
  // justifyContent: {
  //   justifyContent: 'center',
  // },
  tabUnselected: {
    color: theme.palette.grey[500],
    textTransform: 'none',
    minWidth: 'unset',
    height: '100%',
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    [theme.breakpoints.down('xs')]: {
      height: 'unset',
      paddingTop: 'inherit',
      paddingBottom: 'inherit',
    },
  },
}));

export default AppBarMenu;
