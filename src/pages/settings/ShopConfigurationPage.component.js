// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import OrderConfigurationForm from '../../libs/order/components/OrderConfigurationForm.component';
import DeliveryFeeTable from '../../libs/order/components/DeliveryFeeTable.component';
import DeliveryFeeDialogForm from '../../libs/order/components/DeliveryFeeDialogForm.component';

import { getDeliveryFeesActive } from '../../libs/order/selectors';
import type { DeliveryFee } from '../../libs/order/types';

import {
  fetchConfiguration,
  patchConfiguration,
  createOrUpdateDeliveryFee,
  disableDeliveryFee,
  fetchAllDeliveryFee,
} from '../../libs/order/actions';

type Props = {
  loading: boolean,
  processing: boolean,

  openEditModal: (DeliveryFee) => void,
  disableDeliveryFee: (DeliveryFee) => void,
  openedFee: ?DeliveryFee,

  patchConfiguration: (*) => void,
  fetchConfiguration: (*) => void,
  fetchAllDeliveryFee: () => void,
  createOrUpdateDeliveryFee: (data: *) => void,

  configuration: *,
  deliveryFees: Array<DeliveryFee>,

  classes: *,
  t: TFunction,
};

export class OrderConfigrationPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchAllDeliveryFee();
    this.props.fetchConfiguration();
  }

  render() {
    const {
      configuration,
      deliveryFees,
      loading,
      processing,
      classes,
      t,
    } = this.props;
    if (loading || !configuration) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <Typography variant="h6" component="h3">
          {t('configuration.deliveryFee')}
        </Typography>
        <Paper className={classes.paper}>
          <div className={classes.paperInner}>
            <OrderConfigurationForm
              configuration={configuration}
              processing={processing}
              deliveryFees={deliveryFees}
              onSubmit={this.props.patchConfiguration}
            />
          </div>
        </Paper>
        <Paper className={classes.paper}>
          <DeliveryFeeTable
            deliveryFees={deliveryFees}
            onEdit={this.props.openEditModal}
            onDelete={this.props.disableDeliveryFee}
          />
          <div className={classes.paperInner}>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => this.props.openEditModal({})}
            >
              <AddIcon className={classes.leftIcon} />
              {t('deliveryFee.forms.create')}
            </Button>
          </div>
        </Paper>
        <DeliveryFeeDialogForm
          open={!!this.props.openedFee}
          deliveryFee={this.props.openedFee}
          onClose={() => this.props.openEditModal(null)}
          onSubmit={this.props.createOrUpdateDeliveryFee}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  container: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  paper: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  paperInner: {
    padding: theme.spacing(2),
  },
});

export default compose(
  withNamespaces(['order']),
  withState('openedFee', 'openEditModal', null),
  withStyles(styles),
  connect(
    (state) => ({
      configuration: state.order.configuration.data,
      deliveryFees: getDeliveryFeesActive(state),
      loading: state.order.configuration.loading,
      processing: state.order.configuration.update.loading,
    }),
    {
      fetchConfiguration,
      patchConfiguration,
      fetchAllDeliveryFee,
      createOrUpdateDeliveryFee,
      disableDeliveryFee,
    },
  ),
)(OrderConfigrationPage);
