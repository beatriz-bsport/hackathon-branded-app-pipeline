// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withProps, compose } from 'recompose';
import { replace, push as pushRouter } from 'react-router-redux';

import {
  fetchCompanyAction,
  fetchCompanyMetaActivitiesAction,
  fetchCompanyActivitiesAction,
  fetchCompanyEstablishmentsAction,
  fetchCompanyCoachesAction,
} from 'bsport-saas/src/libs/marketplace/actions';

import {
  removeProductFromOrder as removeProductFromOrderAction,
  updateCurrentOrder as updateOrderAction,
  getOrCreateCurrentOrder,
  resetOrders as resetOrdersAction,
} from 'bsport-saas/src/libs/order/actions';

import {
  consumer as consumerActions,
  auth as authActions,
} from 'bsport-saas/src/actions';

import { fetchSCT } from 'bsport-saas/src/actions/category.actions';

import CalendarWidget from './widget.calendar';
import PassWidget from './widget.pass';
import WorkshopWidget from './widget.workshop';
import ShopWidget from './widget.shop';

type Props = {
  companyId: number,
  store: any,
  history: Object,
  widgetType: string,
  fetchSCT: () => void,
  fetchCompany: (companyId: number) => void,
  fetchCompanyActivities: (companyId: number) => void,
  fetchCompanyMetaActivities: (companyId: number) => void,
  fetchCompanyCoaches: (companyId: number) => void,
  fetchCompanyEstablishments: (companyId: number) => void,
  fetchCurrentOrder: (companyId: number) => void,
  fetchProfile: () => void,
  auth: *,
  consumerProfile: *,
};

class BsportWidget extends Component<Props> {
  fetchData = () => {
    this.props.fetchSCT();
    this.props.fetchCompany(this.props.companyId);
    this.props.fetchCompanyActivities(this.props.companyId);
    this.props.fetchCompanyMetaActivities(this.props.companyId);
    this.props.fetchCompanyCoaches(this.props.companyId);
    this.props.fetchCompanyEstablishments(this.props.companyId);
    if (this.props.auth.authenticated) {
      this.props.fetchCurrentOrder(this.props.companyId);
      this.props.fetchProfile();
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const { companyId, store, history, widgetType } = this.props;
    switch (widgetType) {
      case 'workshop':
        return (
          <WorkshopWidget
            companyId={companyId}
            location={history.location}
            store={store}
          />
        );
      case 'pass':
        return (
          <PassWidget
            companyId={companyId}
            store={store}
            location={history.location}
          />
        );
      case 'shop':
        return (
          <ShopWidget
            companyId={companyId}
            store={store}
            location={history.location}
          />
        );
      default:
        return (
          <CalendarWidget
            companyId={companyId}
            location={history.location}
            store={store}
          />
        );
    }
  }
}

BsportWidget.propTypes = {};

// BsportWidget.defaultProps = {};

export default compose(
  connect(
    (state) => ({ auth: state.auth }),
    {
      // General information
      fetchSCT,
      fetchCompany: fetchCompanyAction,
      fetchCompanyMetaActivities: fetchCompanyMetaActivitiesAction,
      fetchCompanyActivities: fetchCompanyActivitiesAction,
      fetchCompanyEstablishments: fetchCompanyEstablishmentsAction,
      fetchCompanyCoaches: fetchCompanyCoachesAction,
      // For shop pages
      resetOrders: resetOrdersAction,
      fetchCurrentOrder: getOrCreateCurrentOrder,
      removeProduct: removeProductFromOrderAction,
      updateOrder: updateOrderAction,
      goToPayment: (companyId) =>
        pushRouter(`/customer/payment/order/${companyId}/`),
      // for signup/signin/profile
      fetchProfile: consumerActions.fetchProfile,
      goToUserSpace: () => pushRouter('/'),
      signup: (data: *, callback: () => void) =>
        authActions.signup(data, { onDone: callback }),
      doEmailLogin: ({ email, password }, callback) =>
        authActions.requestLogin(email, password, { onDone: callback }),
      disconnect: authActions.disconnect,
    },
  ),
)(BsportWidget);
