// @flow
import React, { Component } from 'react';

import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { goBack } from 'react-router-redux';
import { payment as paymentActions } from '../../actions';
import ConsumerModalContainer from '../../components/consumer/ConsumerModalContainer.component';
import parse from '../../query-string';
import type { PaymentPack } from '../../api/types';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import themeSelectors from '../../libs/theme/selectors';
import type { Theme } from '../../libs/theme/types';
import { getTheme } from '../../theme';

import PaymentPackPaymentForm from './payment-pack/PaymentPackForm.component';

type Props = {
  loading: boolean,
  hasBoughtSomething: boolean,
  match: Object,
  location: Object,
  paymentPack: ?PaymentPack,
  fetchPaymentPack: (number) => void,
  fetchOffer: (number) => void,
  fetchCompanyTheme: (number) => void,
  theme: Theme,
  goBack: () => void,
  offer: ?Offer,
};

export class PaymentPackPaymentPage extends Component<Props> {
  componentDidMount() {
    const paymentPackId = parseInt(this.props.match.params.id, 10);
    const { nextOffer } = parse(this.props.location.search);
    this.nextOffer = nextOffer ? parseInt(nextOffer, 10) : null;
    this.props.fetchPaymentPack(paymentPackId);
    if (nextOffer) {
      this.props.fetchOffer(nextOffer);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.paymentPack !== this.props.paymentPack &&
      this.props.paymentPack &&
      this.props.paymentPack.company_id
    ) {
      this.props.fetchCompanyTheme(this.props.paymentPack.company_id);
    }
  }

  goBack = () => {
    if (this.props.theme && this.props.theme.scheduleURL) {
      window.location.href = this.props.theme.scheduleURL;
    } else {
      this.props.goBack();
    }
  };

  render() {
    const { paymentPack, loading } = this.props;
    if (!paymentPack) {
      return <CircularProgress />;
    }

    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <ConsumerModalContainer>
          <PaymentPackPaymentForm
            paymentPack={paymentPack}
            loading={loading}
            offerToBuy={this.nextOffer ? this.props.offer : null}
            hasBoughtSomething={this.props.hasBoughtSomething}
            goBack={this.goBack}
          />
        </ConsumerModalContainer>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  const hasBoughtSomething =
    state.payment.wantedPaymentPack &&
    !state.consumer.loading &&
    !!state.consumer &&
    !!state.consumer.profile
      ? !!(state.consumer.profile.memberships || []).filter(
          (m) =>
            m.company_id === state.payment.wantedPaymentPack.company_id &&
            m.has_bought_something === true,
        ).length
      : false;
  return {
    hasBoughtSomething,
    paymentPack: state.payment.wantedPaymentPack,
    loading: state.payment.loading,
    offer: state.payment.wantedOffer,
    theme: themeSelectors.getTheme(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCompanyTheme(id) {
      dispatch(fetchCompanyTheme(id));
    },
    fetchPaymentPack(id) {
      dispatch(paymentActions.fetchPaymentPack(id));
    },
    fetchOffer(id) {
      dispatch(paymentActions.fetchOffer(id));
    },
    goBack() {
      dispatch(goBack());
    },
  };
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PaymentPackPaymentPage),
);
