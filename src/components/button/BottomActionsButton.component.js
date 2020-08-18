// @flow
import React from 'react';

import Hidden from '@material-ui/core/Hidden';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ShareIcon from '@material-ui/icons/Share';
import Fab from '@material-ui/core/Fab';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';

import RedFab from './RedFab.component';

type Props = {
  t: TFunction,
  classes: Object,
  onEdit: ?() => void,
  onShare: ?() => void,
  onDelete: ?() => void,
  onCreate: ?() => void,
  onCreateLabel: ?string,
};

export const BottomActionButtons = (props: Props) => (
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
const styles = (theme) => ({
  buttonContainer: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  rightText: {
    marginLeft: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(),
)(BottomActionButtons);
