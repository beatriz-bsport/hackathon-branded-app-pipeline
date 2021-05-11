// @flow
import React, { Component } from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import InvoiceConfigurationForm from '../../libs/invoice/components/InvoiceConfigurationForm.component';
import {
  fetchInvoiceConfiguration,
  patchInvoiceConfiguration as patchInvoiceConfigurationAction,
} from '../../libs/invoice/actions';
import {
  snackbarSuccess as snackbarSuccessAction,
  snackbarError as snackbarErrorAction,
} from '../../actions/snackbar.actions';
import withTitle from '../../hocs/with-title.hoc';

type Props = {
  fetchInvoiceConfiguration: () => void,
  loading: boolean,
  processing: boolean,
  patchInvoiceConfiguration: (any) => void,
  configuration: ?{
    stripe_footer: string,
  },

  classes: *,
};

export class InvoiceConfigurationPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchInvoiceConfiguration();
  }

  render() {
    const { configuration, loading, processing, classes } = this.props;
    if (loading || !configuration) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <InvoiceConfigurationForm
          configuration={configuration}
          processing={processing}
          onSubmit={this.props.patchInvoiceConfiguration}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['settings']),
  withTitle(({ t }) => t('tab.invoice')),
  connect(
    (state) => ({
      configuration: state.invoice.configuration.result,
      loading: state.invoice.configuration.loading,
      processing: state.invoice.configuration.updating,
    }),
    {
      fetchInvoiceConfiguration,
      patchInvoiceConfiguration: patchInvoiceConfigurationAction,
      snackbarSuccess: snackbarSuccessAction,
      snackbarError: snackbarErrorAction,
    },
  ),
  withHandlers({
    patchInvoiceConfiguration: ({
      patchInvoiceConfiguration,
      snackbarSuccess,
      snackbarError,
    }) => (data) => {
      patchInvoiceConfiguration(data, {
        onSuccess: () => snackbarSuccess('settings.update.success'),
        onError: () => snackbarError('settings.update.error'),
      });
    },
  }),
)(InvoiceConfigurationPage);
