// @flow
import React from 'react';

import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';

import RedFab from './RedFab.component';

type Props = {
  t: TFunction,
  classes: Object,
  onEdit: ?() => void,
  onDelete: ?() => void,
  onCreate: ?() => void,
  onCreateLabel: ?string,
};

export const BottomActionButtons = (props: Props) => (
  <div className={props.classes.buttonContainer}>
    {props.onCreate ? (
      <Button
        variant="extendedFab"
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
      </Button>
    ) : null}
    {props.onEdit ? (
      <Button
        variant="extendedFab"
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
      </Button>
    ) : null}
    {props.onDelete ? (
      <RedFab
        variant="fab"
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
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  actionButton: {
    marginLeft: theme.spacing.unit,
  },
  rightText: {
    marginLeft: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
)(BottomActionButtons);
