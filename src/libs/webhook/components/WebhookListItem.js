// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';

import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import withConfirm from '../../../hocs/with-confirm.hoc';

type Props = {
  webhook: Webhook,
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void,
  testWebhookUrl: () => void,
  classes: Object,
  testLoadingId: number,
  t: TFunction,
};

const ButtonWithConfirm = withConfirm(IconButton, 'onClick', {
  title: 'settings:webhook.modal.delete.title',
  cancel: 'settings:webhook.modal.delete.cancel',
  confirm: 'settings:webhook.modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('settings:webhook.modal.delete.content')}</p>
  ),
});

export class WebhookListItem extends Component<Props> {
  render() {
    return (
      <ListItem divider dense>
        <div className={this.props.classes.container}>
          <ListItemText
            primary={`${this.props.t('webhook.event')}: ${
              this.props.webhook.event_type
            }`}
            secondary={`${this.props.t('webhook.url')}: ${
              this.props.webhook.url
            }`}
          />
          <div className={this.props.classes.buttonContainer}>
            {this.props.testLoadingId === this.props.webhook.id ? (
              <div className={this.props.classes.loadingContainer}>
                <CircularProgress size={30} />
              </div>
            ) : (
              <Button
                className={this.props.classes.testButton}
                variant="outlined"
                onClick={this.props.testWebhookUrl}
              >
                {this.props.t('webhook.test')}
              </Button>
            )}
            {this.props.onClickEdit ? (
              <IconButton
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  this.props.onClickEdit(this.props.webhook.id);
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
                  this.props.onClickDelete(this.props.webhook.id);
                }}
                color="secondary"
              >
                <DeleteIcon />
              </ButtonWithConfirm>
            ) : null}
          </div>
        </div>
      </ListItem>
    );
  }
}

const styles = (theme) => ({
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing.unit * 5,
  },
  testButton: {
    marginRight: theme.spacing.unit * 2,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['settings']),
)(WebhookListItem);
