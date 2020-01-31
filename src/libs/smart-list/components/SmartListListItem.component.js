// @flow

import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import withConfirm from '../../../hocs/with-confirm.hoc';

type Props = {
  smartlist: SmartList,
  onClick: (any) => void,
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void,
  selected: boolean,
  onClickDuplicate: (id: number) => void,
  classes: Object,
  t: TFunction,
};

const ButtonWithConfirm = withConfirm(IconButton, 'onClick', {
  title: 'smartList:modal.delete.title',
  cancel: 'smartList:modal.delete.cancel',
  confirm: 'smartList:modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('smartList:modal.delete.content')}</p>
  ),
});

export class SmartListItem extends Component<Props> {
  render() {
    return (
      <ListItem
        divider
        button
        selected={this.props.selected}
        onClick={() => this.props.onClick(this.props.smartlist.id)}
      >
        <ListItemText
          primary={this.props.smartlist.name}
          secondary={this.props.smartlist.description}
        />
        <ListItemSecondaryAction>
          {this.props.onClickDuplicate ? (
            <Tooltip
              title={
                <Typography variant="subtitle2">
                  {this.props.t('duplicate')}
                </Typography>
              }
              classes={this.props.classes}
              aria-label="info"
            >
              <IconButton
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  this.props.onClickDuplicate(this.props.smartlist.id);
                }}
                color="primary"
              >
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          {this.props.onClickEdit ? (
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                this.props.onClickEdit(this.props.smartlist.id);
              }}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          ) : null}
          {this.props.onClickDelete ? (
            <ButtonWithConfirm
              onClick={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                this.props.onClickDelete(this.props.smartlist.id);
              }}
              color="secondary"
            >
              <DeleteIcon />
            </ButtonWithConfirm>
          ) : null}
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

const styles = (theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[2],
    fontSize: 11,
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(SmartListItem);
