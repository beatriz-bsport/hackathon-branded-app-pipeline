// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';

import { withTranslation, TFunction } from 'react-i18next';

import { Divider } from '@material-ui/core';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import OrderConfigurationForm from '../../libs/order/components/OrderConfigurationForm.component';
import DeliveryFeeTable from '../../libs/order/components/DeliveryFeeTable.component';
import DeliveryFeeDialogForm from '../../libs/order/components/DeliveryFeeDialogForm.component';

import { getDeliveryFeesActive } from '../../libs/order/selectors';
import type { DeliveryFee } from '../../libs/order/types';
import withTitle from '../../hocs/with-title.hoc';

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
  openedFee?: DeliveryFee,

  patchConfiguration: (any) => void,
  fetchConfiguration: (any) => void,
  fetchAllDeliveryFee: () => void,
  createOrUpdateDeliveryFee: (data: *) => void,

  configuration: any,
  deliveryFees: Array<DeliveryFee>,

  classes: any,
  t: TFunction,
};

export class OrderConfigrationPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchAllDeliveryFee();
    this.props.fetchConfiguration();
  }

  render() {
    const { configuration, deliveryFees, loading, processing, classes, t } =
      this.props;
    if (loading || !configuration) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <Typography className={classes.sectionTitle} variant="h5">
          {t('configuration.deliveryFee')}
        </Typography>
        <Divider className={classes.divider} />
        <Paper className={classes.paper}>
          <div className={classes.paperInner}>
            <OrderConfigurationForm
              configuration={configuration}
              deliveryFees={deliveryFees}
              onSubmit={this.props.patchConfiguration}
              processing={processing}
            />
          </div>
        </Paper>
        <Paper className={classes.paper}>
          <DeliveryFeeTable
            deliveryFees={deliveryFees}
            onDelete={this.props.disableDeliveryFee}
            onEdit={this.props.openEditModal}
          />
          <div className={classes.paperInner}>
            <Button
              color="primary"
              onClick={() => this.props.openEditModal({})}
              variant="outlined"
            >
              <AddIcon className={classes.leftIcon} />
              {t('deliveryFee.forms.create')}
            </Button>
          </div>
        </Paper>
        <DeliveryFeeDialogForm
          deliveryFee={this.props.openedFee}
          onClose={() => this.props.openEditModal(null)}
          onSubmit={this.props.createOrUpdateDeliveryFee}
          open={!!this.props.openedFee}
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
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['order']),
  withTitle(({ t }) => t('pageTitle')),
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
