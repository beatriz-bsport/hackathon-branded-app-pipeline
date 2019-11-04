// @flow

import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';

type Props = {
  smartlist: SmartList,
  onClick: (any) => void,
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void,
  selected: boolean,
};

export default class SmartListItem extends Component<Props, state> {
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
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                this.props.onClickDelete(this.props.smartlist.id);
              }}
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
          ) : null}
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}
