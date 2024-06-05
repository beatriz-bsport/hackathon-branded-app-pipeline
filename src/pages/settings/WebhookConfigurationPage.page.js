// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withTranslation, TFunction } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';

import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import WebhookFormDialog from '../../libs/webhook/components/WebhookForm.component';
import WebhookListItem from '../../libs/webhook/components/WebhookListItem';
import {
  fetchAllWebhooks,
  fetchWebhookEventList,
  updateWebhook,
  createWebhook,
  deleteWebhook,
} from '../../libs/webhook/actions';
import { getAllWebhooks } from '../../libs/webhook/selectors';
import { testWebhookUrl as testWebhookUrlAPI } from '../../libs/webhook/api';
import { snackbarSuccess, snackbarError } from '../../libs/snackbar/actions';
import withTitle from '../../hocs/with-title.hoc';

type Props = {
  loading: boolean,
  classes: any,
  testError: (string) => void,
  testSuccess: (string) => void,
  fetchAllWebhooks: () => void,
  fetchWebhookEventList: () => void,
  eventList: Array<string>,
  deleteWebhook: (id: number) => void,
  updateWebhook: () => void,
  createWebhook: () => void,
  t: TFunction,
  webhooks: Array<any>,
};

export class WebhookConfiguration extends Component<Props> {
  state = {
    selected: null,
    openForm: false,
    testLoadingId: null,
  };

  componentDidMount() {
    this.props.fetchAllWebhooks();
    this.props.fetchWebhookEventList();
  }

  testWebhookUrl = (id) => {
    this.setState({ testLoadingId: id });
    testWebhookUrlAPI(id)
      .then((response) => {
        this.setState({ testLoadingId: null });

        if (response.data >= 200 && response.data < 300) {
          this.props.testSuccess(this.props.t('webhook.testSuccess'));
        } else {
          this.props.testError(this.props.t('webhook.testError'));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    const { classes } = this.props;
    if (this.props.loading) return <LinearProgress />;

    return (
      <div className={classes.container}>
        {this.props.webhooks && this.props.webhooks.length > 0 ? (
          <Paper className={classes.paperContainer}>
            {this.props.webhooks.map((webhook) => (
              <WebhookListItem
                key={webhook.id}
                onClickDelete={() => this.props.deleteWebhook(webhook.id)}
                onClickEdit={() =>
                  this.setState({
                    selected: webhook,
                    openForm: true,
                  })
                }
                testLoadingId={this.state.testLoadingId}
                testWebhookUrl={() => this.testWebhookUrl(webhook.id)}
                webhook={webhook}
              />
            ))}
          </Paper>
        ) : null}
        <div className={this.props.classes.addButtonContainer}>
          <Button
            className={this.props.classes.addButton}
            color="primary"
            onClick={() => this.setState({ openForm: true })}
            variant="outlined"
          >
            <AddIcon />
            {this.props.t('webhook.add')}
          </Button>
        </div>
        <WebhookFormDialog
          eventList={this.props.eventList}
          onCancel={() =>
            this.setState({
              selected: null,
              openForm: false,
            })
          }
          open={this.state.openForm}
          updateWebhook={(data, options) => {
            if (this.state.selected) {
              this.props.updateWebhook(this.state.selected.id, data, options);
            } else {
              this.props.createWebhook(data, options);
            }
          }}
          webhook={this.state.selected}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  addButton: { marginTop: theme.spacing(1) },
  container: {
    padding: theme.spacing(2),
  },
  addButtonContainer: { display: 'flex', justifyContent: 'center' },
});

export default compose(
  connect(
    (state) => ({
      webhooks: getAllWebhooks(state),
      loading: state.webhook.loading,
      eventList: state.webhook.events,
    }),
    {
      fetchAllWebhooks,
      fetchWebhookEventList,
      updateWebhook,
      createWebhook,
      deleteWebhook,
      testSuccess: snackbarSuccess,
      testError: snackbarError,
    },
  ),
  withStyles(styles),
  withTranslation(['settings']),
  withTitle(({ t }) => t('tab.webhook')),
)(WebhookConfiguration);
