// @flow

import React, { Component } from 'react';

import { compose } from 'recompose';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';

import withConfirm from '../../../hocs/with-confirm.hoc';

type Props = {
  email_template: EmailTemplate,
  onClick: (any) => void,
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void,
  selected: boolean,
  t: TFunction,
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

export default compose(withNamespaces(['emailTemplate']))(EmailCard);
