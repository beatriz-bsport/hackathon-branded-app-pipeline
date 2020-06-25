// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withProps } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push } from 'connected-react-router';

import {
  fetchPaymentComboList,
  createOrUpdatePaymentCombo,
  deletePaymentCombo,
} from '../../libs/payment-combo/actions';
import {
  getPaymentComboListAvailableOnline,
  getPaymentComboListUnavailableOnline,
} from '../../libs/payment-combo/selectors';

import type { PaymentCombo } from '../../libs/payment-combo/types';
import PaymentComboFormDialogContainer from './PaymentComboFormDialog.container';
import PaymentComboList from '../../libs/payment-combo/components/PaymentComboList.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import type { OptionCallback } from '../../state/types';

type Props = {
  t: TFunction,
  classes: Object,

  loading: boolean,
  fetchPaymentComboList: () => void,
  paymentComboListAvailableOnline: Array<PaymentCombo>,
  paymentComboListUnavailableOnline: Array<PaymentCombo>,

  deletePaymentCombo: (id: number, options: ?OptionCallback) => void,

  goToPaymentCombo: (id: number) => void,
  createOrUpdatePaymentCombo: (values: any, options: ?OptionCallback) => void,
  openCreateOrUpdateForm: (?PaymentCombo) => void,

  openForm: boolean,
  setOpenForm: (boolean) => void,
  comboInitialData: ?PaymentCombo,
};

export class PaymentComboListPage extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPaymentComboList();
  }

  createOrUpdate = (values: any, options: OptionCallback) =>
    this.props.createOrUpdatePaymentCombo(values, {
      onSuccess: (...args) => {
        if (options && options.onSuccess) options.onSuccess(...args);
        this.props.setOpenForm(false);
        this.props.fetchPaymentComboList();
      },
      onError: (...args) => {
        if (options && options.onError) options.onError(...args);
      },
    });

  render() {
    const {
      t,
      classes,
      loading,
      paymentComboListAvailableOnline,
      paymentComboListUnavailableOnline,
      openCreateOrUpdateForm,
    } = this.props;

    return (
      <div className={classes.container}>
        {loading ? <LinearProgress /> : null}
        {this.props.paymentComboListUnavailableOnline.length === 0 &&
        this.props.paymentComboListAvailableOnline.length === 0 &&
        !loading ? (
          <IsEmptyList
            text={this.props.t('list.explainIfEmpty')}
            button={this.props.t('list.buttons.add')}
            onCreate={() => openCreateOrUpdateForm(null)}
          />
        ) : null}
        <PaymentComboList
          paymentComboListAvailableOnline={paymentComboListAvailableOnline}
          paymentComboListUnavailableOnline={paymentComboListUnavailableOnline}
          onEdit={openCreateOrUpdateForm}
          onDelete={this.props.deletePaymentCombo}
          onClickPaymentCombo={this.props.goToPaymentCombo}
          loading={loading}
        />
        <BottomActionButtons
          onCreateLabel={t('list.buttons.add')}
          onCreate={() => openCreateOrUpdateForm(null)}
        />
        {this.props.openForm ? (
          <PaymentComboFormDialogContainer
            initial={this.props.comboInitialData}
            open={this.props.openForm}
            handleClose={() => this.props.setOpenForm(false)}
            onSubmit={this.createOrUpdate}
          />
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  explainIfEmpty: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    color: 'bleu',
    fontSize: 'larger',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    border: '2px solid #E2E2E2',
    borderRadius: theme.spacing(1),
    textAlign: 'center',
    width: '400px',
    marginLeft: '200px',
  },
  container: {
    paddingBottom: theme.spacing(16),
  },
});

export default compose(
  withTranslation(['paymentCombo']),
  withStyles(styles),
  connect(
    (state) => ({
      loading: state.paymentCombo.loading,
      paymentComboListAvailableOnline: getPaymentComboListAvailableOnline(
        state,
      ),
      paymentComboListUnavailableOnline: getPaymentComboListUnavailableOnline(
        state,
      ),
      error: state.paymentCombo.createOrUpdate.error,
    }),
    {
      fetchPaymentComboList,
      createOrUpdatePaymentCombo,
      deletePaymentCombo,
      goToPaymentCombo: (id: number) => push(`/combo/${id}`),
    },
  ),
  withState('openForm', 'setOpenForm', false),
  withState('comboInitialData', 'setComboInitialData', null),
  withProps(({ setComboInitialData, setOpenForm }) => ({
    openCreateOrUpdateForm: (paymentCombo: ?PaymentCombo) => {
      setComboInitialData(paymentCombo);
      setOpenForm(true);
    },
  })),
)(PaymentComboListPage);
