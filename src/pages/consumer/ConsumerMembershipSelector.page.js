// @flow
import React from 'react';

import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Redirect } from 'react-router-dom';

import {
  fetchMembershipListAsConsumer,
  fetchMoreMembership,
  fetchMembership,
  linkMeToCompany as linkMeToCompanyAction,
} from '../../libs/membership/actions';
import { getConsumerMembershipList } from '../../libs/membership/selectors';

import { searchCompany as searchCompanyAction } from '../../libs/company/actions';
import { getSearchedCompanyList } from '../../libs/company/selectors';

import ConsumerLoading from '../../libs/consumer-space/components/ConsumerLoading.component';
import MembershipSelector from '../../libs/membership/components/MembershipSelector.component';

import type { Membership } from '../../libs/membership/types';
import type { Company } from '../../libs/company/types';

type Props = {
  fetchMembershipListAsConsumer: (params: any) => void,
  fetchMoreMembership: (page_size: number, options: OptionCallback) => void,
  goToConsumerHome: (companyId: number) => void,
  membershipListLoading: boolean,
  membershipList: Array<Membership>,
  handleCompanySelect: (companyId: number) => void,
  companyList: Array<Company>,
  hasMoreMembership: boolean,
  companyLoading: boolean,
  searchCompany: (string) => void,
};

type State = {
  loading: boolean,
};

export class ConsumerMembershipSelector extends React.Component<Props, State> {
  state = {
    loading: true,
  };

  componentWillMount() {
    this.props.fetchMembershipListAsConsumer(
      { page_size: 5 },
      {
        onSuccess: () => this.setState({ loading: false }),
      },
    );
  }

  render() {
    if (this.state.loading) {
      return <ConsumerLoading />;
    }
    if (this.props.membershipList.length === 1) {
      return <Redirect to={`/c/${this.props.membershipList[0].company}/`} />;
    }
    return (
      <MembershipSelector
        membershipList={this.props.membershipList}
        goToConsumerHome={this.props.goToConsumerHome}
        searchCompany={this.props.searchCompany}
        companyList={this.props.companyList}
        companyLoading={this.props.companyLoading}
        onClickCompany={this.props.handleCompanySelect}
        fetchMoreMembership={this.props.fetchMoreMembership}
        hasMore={this.props.hasMoreMembership}
        loading={this.props.membershipListLoading}
      />
    );
  }
}

export default compose(
  connect(
    (state) => ({
      membershipListLoading: state.membership.asConsumer.loading,
      membershipList: getConsumerMembershipList(state),
      companyList: getSearchedCompanyList(state),
      companyLoading: state.company.search.loading,
      hasMoreMembership:
        state.membership.asConsumer.next_page &&
        state.membership.asConsumer.next_page > 1,
    }),
    {
      fetchMembership,
      fetchMembershipListAsConsumer,
      fetchMoreMembership,
      linkMeToCompany: linkMeToCompanyAction,
      searchCompany: searchCompanyAction,
      goToConsumerHome: (id) => push(`/c/${id}/`),
    },
  ),
  withProps(({ linkMeToCompany, goToConsumerHome }) => ({
    handleCompanySelect: (companyId) => {
      linkMeToCompany(
        { company: companyId },
        {
          onSuccess: () => goToConsumerHome(companyId),
        },
      );
    },
  })),
)(ConsumerMembershipSelector);
