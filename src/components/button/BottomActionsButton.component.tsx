import React from 'react';

import Hidden from '@material-ui/core/Hidden';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ShareIcon from '@material-ui/icons/Share';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import Fab from '@material-ui/core/Fab';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import RedFab from './RedFab.component';

type OwnProps = {
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onCreate?: () => void;
  onCreateLabel?: string;
  onReset?: () => void;
  resetLabel?: string;
};

export type Props = OwnProps;

export const BottomActionButtonBaseList = (props: Props) => {
  const classes = useButtonsStyles();
  const { t } = useTranslation();
  return (
    <>
      {props.onCreate ? (
        <Fab
          id="bottom_action_add"
          variant="extended"
          color="primary"
          className={classes.actionButton}
          onClick={props.onCreate}
        >
          <AddIcon />
          <Hidden xsDown>
            <div className={classes.rightText}>
              {props.onCreateLabel || t('common.add')}
            </div>
          </Hidden>
        </Fab>
      ) : null}
      {props.onEdit ? (
        <Fab
          id="bottom_action_edit"
          variant="extended"
          color="primary"
          className={classes.actionButton}
          onClick={props.onEdit}
        >
          <EditIcon />
          <Hidden xsDown>
            <div className={classes.rightText}>{t('common.edit')}</div>
          </Hidden>
        </Fab>
      ) : null}
      {props.onShare ? (
        <Fab
          variant="extended"
          color="secondary"
          className={classes.actionButton}
          onClick={props.onShare}
        >
          <ShareIcon />
          <Hidden xsDown>
            <div className={classes.rightText}>{t('common.share')}</div>
          </Hidden>
        </Fab>
      ) : null}
      {props.onReset && props.resetLabel ? (
        <Fab
          variant="extended"
          color="secondary"
          className={classes.actionButton}
          onClick={props.onReset}
        >
          <SettingsBackupRestoreIcon />
          <Hidden xsDown>
            <div className={classes.rightText}>{props.resetLabel}</div>
          </Hidden>
        </Fab>
      ) : null}
      {props.onDelete ? (
        <RedFab
          id="bottom_action_delete"
          className={classes.actionButton}
          onClick={props.onDelete}
        >
          <DeleteIcon />
        </RedFab>
      ) : null}
    </>
  );
};

const useButtonsStyles = makeStyles((theme: Theme) => ({
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  rightText: {
    marginLeft: theme.spacing(1),
  },
}));

export const BottomActionButtons: React.FC<Props> = (props: Props) => {
  const classes = useContainerStyles();
  return (
    <div className={classes.buttonContainer}>
      <BottomActionButtonBaseList {...props} />
    </div>
  );
};

const useContainerStyles = makeStyles((theme: Theme) => ({
  buttonContainer: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    zIndex: 1000,
  },
}));

export default BottomActionButtons;
