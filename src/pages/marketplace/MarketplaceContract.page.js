// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { push, replace as replaceAction } from 'connected-react-router';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Collapse from '@material-ui/core/Collapse';
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
  companyId: number,
  push: (path: string) => void,
  onAddToCart: ?(id: number) => void,
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
                      if (this.props.onAddToCart) {
                        this.props.onAddToCart(c.id);
                        return;
                      }

                      Analytics.contractShowPayment(c);
                      this.props.push(
                        `/checkout/${this.props.companyId}/subscription/${c.id}/`,
                      );
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

const DataHOC = compose(
  connect(
    (state) => ({
      contractList: withPaymentPack(getContractList)(state),
      contractLoading: state.subscription.contract.byMarketplace.loading,
      companyTheme: themeSelectors.getTheme(state),
    }),
    {
      fetchMarketplaceContractList,
      replace: replaceAction,
      fetchContracts: fetchMarketplaceContractList,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      fetchPrivatePassBulk: fetchPrivatePassBulkAction,
      snackbarErrorMsg: snackbarWarning,
      snackbarSuccessMsg: snackbarSuccess,
      push,
    },
  ),
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
);
export const MarketplaceContractBase = withStyles(styles)(
  DataHOC(MarketplaceContract),
);

export default compose(
  withTranslation(['subscription', 'payment', 'invoice', 'translation']),
  withStyles(styles),
  withRouter,
  routerParamsToProps(mapParamsToProps),
  DataHOC,
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
)(MarketplaceContractBase);
