// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose } from 'recompose';
import { push } from 'react-router-redux';

import MemberTable from '../../libs/member/MemberTable.component';
import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import { getSmartListFilters } from '../../libs/smart-list/selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  smartListCreate,
  smartListUpdate,
  fetchSmartListFilters,
  updateFilter,
  deleteFilter,
  createFilter,
} from '../../libs/smart-list/actions';
import { fetchSmartListMembers as fetchSmartListMembersAPI } from '../../libs/smart-list/api';
import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';

import FiltersPanel from '../../libs/smart-list/components/FiltersPanel.component';

type Props = {
  id: number,
  fetchSmartListFilters: (id: number) => void,
  fetchAllPaymentPacks: () => void,
  fetchPrivatePassList: () => void,
  createFilter: (
    filterNameId: number,
    filter: any,
    smartListId: number,
    callback: (id: number) => void,
  ) => void,
  updateFilter: (
    smartListId: number,
    filterNameId: number,
    data: any,
    filterId: number,
    callback: (id: number) => void,
  ) => void,
  deleteFilter: (
    filterNameId: number,
    filterId: number,
    smartListId: number,
    callback: (id: number) => void,
  ) => void,
  goToMember: (id: number) => void,
  smartlist_filters: Array<Filter>,
  payment_packs: Array<PaymentPack>,
  // privatePassList: Array<PrivatePass>,
};

type State = {
  onValueChangeActiveMemberFetch: boolean,
};

export class SmartListDetailMember extends Component<Props, State> {
  state = { onValueChangeActiveMemberFetch: false };

  componentDidMount() {
    this.props.fetchSmartListFilters(this.props.id);
    this.props.fetchAllPaymentPacks();
    this.props.fetchPrivatePassList();
  }

  createFilter = (filter_identifier, filterData) => {
    const filter = filterData;
    filter.smartlist = this.props.id;
    this.props.createFilter(filter_identifier, filter, this.props.id, () => {
      this.setState((prevState) => ({
        onValueChangeActiveMemberFetch: !prevState.onValueChangeActiveMemberFetch,
      }));
    });
  };

  updateFilter = (filterNameId, data, filterId) => {
    this.props.updateFilter(this.props.id, filterNameId, data, filterId, () => {
      this.setState((prevState) => ({
        onValueChangeActiveMemberFetch: !prevState.onValueChangeActiveMemberFetch,
      }));
    });
  };

  deleteFilter = (filterNameId, filterId) => {
    this.props.deleteFilter(filterNameId, filterId, this.props.id, () => {
      this.setState((prevState) => ({
        onValueChangeActiveMemberFetch: !prevState.onValueChangeActiveMemberFetch,
      }));
    });
  };

  render() {
    if (!this.props.smartlist_filters) {
      return <LinearProgress />;
    }
    return (
      <div>
        <FiltersPanel
          filters={this.props.smartlist_filters}
          updateFilter={this.updateFilter}
          deleteFilter={this.deleteFilter}
          payment_packs={this.props.payment_packs}
          createFilter={this.createFilter}
        />
        <MemberTable
          fetch={({ page, page_size }) =>
            fetchSmartListMembersAPI(this.props.id, { page, page_size })
          }
          goToMember={this.props.goToMember}
          onValueChangeActiveMemberFetch={
            this.state.onValueChangeActiveMemberFetch
          }
          hideAddButton
        />
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number', create: 'create:number' }),
  connect(
    (state, { id }) => ({
      smartlist_filters: getSmartListFilters(state, id),
      loading: state.smartList.loading || state.smartList.filter.loading,
      payment_packs: getPaymentPackEnabled(state),
      privatePassList: getPrivatePassAvailable(state),
    }),
    {
      fetchSmartListFilters,
      fetchAllPaymentPacks,
      fetchPrivatePassList,
      updateFilter,
      deleteFilter,
      smartListCreate,
      smartListUpdate,
      createFilter,
      goToList: () => push('/smart-list/'),
      goToMember: (id) => push(`/member/${id}/`),
    },
  ),
)(SmartListDetailMember);
