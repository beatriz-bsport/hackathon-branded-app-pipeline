// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';
import Tooltip from '@material-ui/core/Tooltip';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/Edit';

import withConfirm from '../../../hocs/with-confirm.hoc';

type Props = {
  email_template: EmailTemplate,
  onClick: (any) => void,
  onClickDuplicate: (id: number) => void,
  onClickDelete: (id: number) => void,
  selected: boolean,
  t: TFunction,
  onClickEdit: (id: number) => void,
  classes: Object,
};

const ButtonWithConfirm = withConfirm(IconButton, 'onClick', {
  title: 'emailTemplate:modal.delete.title',
  cancel: 'emailTemplate:modal.delete.cancel',
  confirm: 'emailTemplate:modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('emailTemplate:modal.delete.content')}</p>
  ),
});

export class EmailCard extends Component<Props, state> {
  render() {
    return (
      <ListItem
        divider
        button
        dense
        selected={this.props.selected}
        onClick={() => this.props.onClick(this.props.email_template.id)}
      >
        <ListItemText
          primary={
            <Typography component="span" variant="subtitle1">
              {this.props.email_template.title}
            </Typography>
          }
          secondary={
            this.props.email_template.subject || this.props.t('no_subject')
          }
        />
        <ListItemSecondaryAction>
          {this.props.onClickEdit ? (
            <IconButton
              onClick={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                this.props.onClickEdit(this.props.email_template.id);
              }}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          ) : null}
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
                  this.props.onClickDuplicate(this.props.email_template.id);
                }}
                color="primary"
              >
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
          ) : null}
          {this.props.onClickDelete ? (
            <ButtonWithConfirm
              onClick={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                this.props.onClickDelete(this.props.email_template.id);
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
  withStyles(styles),
  withNamespaces(['emailTemplate']),
)(EmailCard);
