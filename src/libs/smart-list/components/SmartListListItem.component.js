// @flow

import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';
import withConfirm from '../../../hocs/with-confirm.hoc';

type Props = {
  smartlist: SmartList,
  onClick: (any) => void,
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void,
  selected: boolean,
};

const ButtonWithConfirm = withConfirm(IconButton, 'onClick', {
  title: 'smartList:modal.delete.title',
  cancel: 'smartList:modal.delete.cancel',
  confirm: 'smartList:modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('smartList:modal.delete.content')}</p>
  ),
});

export default class SmartListItem extends Component<Props> {
  render() {
    return (
      <ListItem
        divider
        button
        selected={this.props.selected}
        onClick={() => this.props.onClick(this.props.smartlist.id)}
      >
        <ListItemText
          primary={
            <Typography component="span" variant="subtitle1">
              {this.props.smartlist.name}
            </Typography>
          }
        />
        <ListItemSecondaryAction>
          {this.props.onClickEdit ? (
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                this.props.onClickEdit(this.props.smartlist.id);
              }}
              color="primary"
            >
              <SettingsIcon />
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
