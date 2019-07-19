// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import InvoiceConfigurationForm from '../../libs/invoice/components/InvoiceConfigurationForm.component';
import {
  fetchInvoiceConfiguration,
  patchInvoiceConfiguration,
} from '../../actions/invoice.actions';

type Props = {
  fetchInvoiceConfiguration: () => void,
  loading: boolean,
  configuration: ?{
    stripe_footer: string,
  },

  t: TFunction,
  classes: *,
};

export class InvoiceConfigurationPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchInvoiceConfiguration();
  }

  render() {
    const { configuration, loading, processing, classes } = this.props;
    if (loading) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <InvoiceConfigurationForm
            configuration={configuration}
            processing={processing}
            onSubmit={this.props.patchInvoiceConfiguration}
          />
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
  },
  paper: {
    padding: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['invoice']),
  withStyles(styles),
  connect(
    (state) => ({
      configuration: state.invoice.configuration.result,
      loading: state.invoice.configuration.loading,
      processing: state.invoice.configuration.updating,
    }),
    {
      fetchInvoiceConfiguration,
      patchInvoiceConfiguration,
    },
  ),
)(InvoiceConfigurationPage);
