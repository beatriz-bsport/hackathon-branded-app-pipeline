import React, { useState } from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Tooltip from '../../../components/Tooltip.component';
import { OptionCallback } from '../../../state/types';
import DashboardTabNameDialog from './DashboardTabNameDialog.component';

import { DataSourceDashboardSettings } from '../types';

const useStyles = makeStyles((theme: Theme) => ({
  addTabButton: {
    minWidth: 'unset',
    width: '50px',
  },
  smallIcon: {
    fontSize: '14px',
  },
  iconButton: {
    opacity: '0',
  },
  tab: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      '& $iconButton': {
        opacity: '1',
      },
    },
  },
  tabLabelContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    textAlign: 'center',
    position: 'relative',
  },

  tabLabelTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
  },
  tabLabelIcons: {
    position: 'absolute',
    right: '2px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

type Props = {
  dashboardSettings: DataSourceDashboardSettings;
  currentTabIndex: number;
  setCurrentTabIndex: (n: number) => void;
  deleteTab: (index: number) => void;
  addNewTab: (tabName: string, options?: OptionCallback) => void;
  renameTab: (
    tabName: string,
    tabIndexToRename: number,
    options?: OptionCallback,
  ) => void;
};

export const DashboardTabBar = (props: Props) => {
  const [tabNameDialogOpen, setTabNameDialogOpen] = useState(null);
  const [tabIndexToRename, setTabIndexToRename] = useState(null);
  const [tabNameToRename, setTabNameToRename] = useState('');

  const onAddNewTab = (tabName: string) => {
    props.addNewTab(tabName, { onSuccess: () => setTabNameDialogOpen(false) });
  };

  const onRenameTab = (tabName: string, index: number) => {
    props.renameTab(tabName, index, {
      onSuccess: () => {
        setTabNameToRename('');
        setTabIndexToRename(null);
        setTabNameDialogOpen(false);
      },
    });
  };

  const classes = useStyles();

  const { t } = useTranslation('dashboard');

  return (
    <div>
      <AppBar color="default" elevation={0} position="static">
        <Tabs
          onChange={(e, newValue) => {
            if (newValue === 'addTab') {
              setTabNameDialogOpen(true);
              return;
            }
            props.setCurrentTabIndex(newValue);
          }}
          value={props.currentTabIndex}
          variant="scrollable"
        >
          {(props.dashboardSettings ?? []).map((tab, i) => (
            <Tab
              key={`tab-${i}`}
              wrapped
              className={classes.tab}
              label={
                <div className={classes.tabLabelContainer}>
                  <div className={classes.tabLabelTitle}>
                    {tab.tab_label === 'main'
                      ? t('navigation:backofficeMenu.dashboard')
                      : tab.tab_label}
                  </div>
                  <div className={classes.tabLabelIcons}>
                    <Tooltip title={t('ordering:category.popover.edit')}>
                      <IconButton
                        className={classes.iconButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTabIndexToRename(i);
                          setTabNameToRename(
                            tab.tab_label === 'main'
                              ? t('navigation:backofficeMenu.dashboard')
                              : tab.tab_label,
                          );
                          setTabNameDialogOpen(true);
                        }}
                        size="small"
                      >
                        <EditIcon
                          classes={{ fontSizeSmall: classes.smallIcon }}
                          color="primary"
                          fontSize="small"
                        />
                      </IconButton>
                    </Tooltip>

                    {props.dashboardSettings &&
                      props.dashboardSettings.length > 1 && (
                        <Tooltip title={t('ordering:category.popover.delete')}>
                          <IconButton
                            className={classes.iconButton}
                            disabled={
                              props.dashboardSettings &&
                              props.dashboardSettings.length === 1
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              props.deleteTab(i);
                            }}
                            size="small"
                          >
                            <DeleteIcon
                              classes={{
                                fontSizeSmall: classes.smallIcon,
                              }}
                              color="error"
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                  </div>
                </div>
              }
              value={i}
            />
          ))}
          <Tab
            classes={{ root: classes.addTabButton }}
            label={
              <Tooltip title={t('tabNameDialog.titleAdd')}>
                <IconButton>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            }
            value="addTab"
          />
        </Tabs>
      </AppBar>
      {tabNameDialogOpen && (
        <DashboardTabNameDialog
          addNewTab={onAddNewTab}
          initialValue={tabNameToRename}
          onClose={() => {
            setTabIndexToRename(null);
            setTabNameToRename('');
            setTabNameDialogOpen(false);
          }}
          renameTab={onRenameTab}
          tabIndexToRename={tabIndexToRename}
        />
      )}
    </div>
  );
};

export default DashboardTabBar;
