import React from 'react';

import Hidden from '@material-ui/core/Hidden';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ShareIcon from '@material-ui/icons/Share';
import Fab from '@material-ui/core/Fab';
import { Theme } from '@material-ui/core';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';

import RedFab from './RedFab.component';
import { MaterialStyleType } from '../../utils/types';

type OwnProps = {
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onCreate?: () => void;
  onCreateLabel?: string;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const BottomActionButtons: React.FC<Props> = (props: Props) => (
  <div className={props.classes.buttonContainer}>
    {props.onCreate ? (
      <Fab
        id="bottom_action_add"
        variant="extended"
        color="primary"
        className={props.classes.actionButton}
        onClick={props.onCreate}
      >
        <AddIcon />
        <Hidden xsDown>
          <div className={props.classes.rightText}>
            {props.onCreateLabel || props.t('common.add')}
          </div>
        </Hidden>
      </Fab>
    ) : null}
    {props.onEdit ? (
      <Fab
        id="bottom_action_edit"
        variant="extended"
        color="primary"
        className={props.classes.actionButton}
        onClick={props.onEdit}
      >
        <EditIcon />
        <Hidden xsDown>
          <div className={props.classes.rightText}>
            {props.t('common.edit')}
          </div>
        </Hidden>
      </Fab>
    ) : null}
    {props.onShare ? (
      <Fab
        variant="extended"
        color="secondary"
        className={props.classes.actionButton}
        onClick={props.onShare}
      >
        <ShareIcon />
        <Hidden xsDown>
          <div className={props.classes.rightText}>
            {props.t('common.share')}
          </div>
        </Hidden>
      </Fab>
    ) : null}
    {props.onDelete ? (
      <RedFab
        id="bottom_action_delete"
        className={props.classes.actionButton}
        onClick={props.onDelete}
      >
        <DeleteIcon />
      </RedFab>
    ) : null}
  </div>
);
const styles = (theme: Theme) => ({
  buttonContainer: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    zIndex: 1000,
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  rightText: {
    marginLeft: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(),
)(BottomActionButtons);
