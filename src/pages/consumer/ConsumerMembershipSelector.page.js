// @flow
import React from 'react';

import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Redirect } from 'react-router-dom';

import {
  fetchMembershipListAsConsumer,
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
  goToConsumerHome: (companyId: number) => void,
  membershipListLoading: boolean,
  membershipList: Array<Membership>,
  handleCompanySelect: (companyId: number) => void,
  companyList: Array<Company>,
  companyLoading: boolean,
  searchCompany: (string) => void,
};

export class ConsumerMembershipSelector extends React.Component<Props> {
  componentWillMount() {
    this.props.fetchMembershipListAsConsumer({ page_size: 100 });
  }

  render() {
    if (this.props.membershipListLoading) {
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
    }),
    {
      fetchMembership,
      fetchMembershipListAsConsumer,
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
