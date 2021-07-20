// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { push, replace as replaceAction } from 'connected-react-router';
import { compose, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Collapse from '@material-ui/core/Collapse';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withRouter } from 'react-router-dom';

import { withTranslation } from 'react-i18next';

import themeSelectors from '../../libs/theme/selectors';

import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import { fetchPrivatePassBulk as fetchPrivatePassBulkAction } from '../../libs/private-service/actions';
import {
  getMarketplaceContractList as getContractList,
  withPaymentPack,
} from '../../libs/subscription/selectors';
import { fetchMarketplaceContractList } from '../../libs/subscription/actions';
import SubscriptionContractListItem from '../../libs/subscription/components/SubscriptionContractListItem.component';
import SubscriptionContractCard from '../../libs/subscription/components/SubscriptionContractCard.component';

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  detachPaymentMethod,
} from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import Analytics from '../../components/analytics/Analytics.component';

import {
  snackbarWarning,
  snackbarSuccess,
} from '../../actions/snackbar.actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

type Props = {
  companyId: number,
  fetchContracts: () => void,
  contractLoading: boolean,
  classes: Object,
  contractList: Array<Contract>,
  selected?: number,
  setSelected: (id?: number) => void,
  authenticated: boolean,
  requestSignUp: () => void,
  companyId: number,
  push: (path: string) => void,
};

export class MarketplaceContract extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchContracts(this.props.companyId);
  }

  render() {
    const { classes } = this.props;
    if (this.props.contractLoading) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <List className={classes.list}>
          <Paper>
            {this.props.contractList.map((c) => (
              <div key={c.id}>
                <SubscriptionContractListItem
                  contract={c}
                  divider
                  selected={this.props.selected === c.id}
                  onClick={() => {
                    if (this.props.selected === c.id) {
                      this.props.setSelected(null);
                    } else {
                      this.props.setSelected(c.id);
                      Analytics.contractShow(c);
                    }
                  }}
                />
                <Collapse
                  in={this.props.selected && this.props.selected === c.id}
                >
                  <SubscriptionContractCard
                    contract={c}
                    hideConditions
                    onPayRequest={() => {
                      if (!this.props.authenticated) {
                        this.props.requestSignUp();
                      } else {
                        Analytics.contractShowPayment(c);
                        this.props.push(
                          `/checkout/${this.props.companyId}/subscription/${c.id}/`,
                        );
                      }
                    }}
                  />
                </Collapse>
              </div>
            ))}
          </Paper>
        </List>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    margin: theme.spacing(2),
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
  },
  list: {
    maxWidth: 800,
    width: '100%',
  },
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
  },
  padding: {
    padding: theme.spacing(2),
  },
});

const mapParamsToProps = {
  companyId: 'companyId:number',
  companyName: 'companyName',
};

export default compose(
  withTranslation(['subscription', 'payment', 'invoice', 'translation']),
  withRouter,
  withStyles(styles),
  routerParamsToProps(mapParamsToProps),
  connect(
    (state) => ({
      contractList: withPaymentPack(getContractList)(state),
      contractLoading: state.subscription.contract.byMarketplace.loading,
      companyTheme: themeSelectors.getTheme(state),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      detachPaymentMethodLoading:
        state.paymentBackend.detachPaymentMethod.loading,
      companyId: state.marketplace.settings.company,
      auth: state.auth,
    }),
    {
      fetchMarketplaceContractList,
      replace: replaceAction,
      fetchContracts: fetchMarketplaceContractList,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      fetchPrivatePassBulk: fetchPrivatePassBulkAction,
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      detachPaymentMethodAction: detachPaymentMethod,
      snackbarErrorMsg: snackbarWarning,
      snackbarSuccessMsg: snackbarSuccess,
      push,
    },
  ),
  withHandlers({
    requestSetupIntentSecret: ({ companyId }) => () =>
      requestSetupIntentSecretAPI(null, companyId),
    fetchPaymentMethodList: ({ companyId, fetchPaymentMethodList }) => () =>
      fetchPaymentMethodList({ company: companyId }),
  }),
  withProps(
    ({ fetchContracts, fetchPaymentPackBulk, fetchPrivatePassBulk }) => ({
      fetchContracts: (params) =>
        fetchContracts(params, {
          onSuccess: (contractList) => {
            fetchPaymentPackBulk([
              ...contractList.map((contract) => contract.payment_pack),
            ]);
            fetchPrivatePassBulk([
              ...contractList.map((contract) => contract.private_pass),
            ]);
          },
        }),
    }),
  ),
  withMobileDialog(),
  withProps(({ location, replace }) => ({
    selected: (() => {
      try {
        const params = location.search.slice(1).split('&');
        const selected = parseInt(
          params.find((p) => p.includes('selected=')).split('=')[1],
          10,
        );
        if (selected) {
          return selected;
        }
        return null;
      } catch (err) {
        return null;
      }
    })(),
    setSelected: (id) => {
      const params = location.search.slice(1).split('&');
      const filtered_params = params.filter((p) => !p.includes('selected='));
      const pathname = `${location.pathname}?${filtered_params.join(
        '&',
      )}&selected=${id}`;
      replace(pathname);
    },
  })),
  withHandlers({
    detachPaymentMethod: ({
      detachPaymentMethodAction,
      fetchpaymentMethod,
      snackbarErrorMsg,
      snackbarSuccessMsg,
      companyId,
      t,
    }) => (pm_id, options) => {
      detachPaymentMethodAction(
        { company: companyId, payment_method_id: pm_id },
        {
          onSuccess: () => {
            fetchpaymentMethod({ company: companyId });
            snackbarSuccessMsg(t('invoice:paymentMethod.detach.pm_deleted'));
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: (data) => {
            snackbarErrorMsg(t(`invoice:paymentMethod.detach.${data}`));
          },
        },
      );
    },
  }),
)(MarketplaceContract);
