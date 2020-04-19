// @flow
import React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { getMembership } from '../../libs/membership/selectors';
import {
  fetchMembership,
  linkMeToCompany,
} from '../../libs/membership/actions';
import ConsumerLoading from '../../libs/consumer-space/components/ConsumerLoading.component';
import type { OptionCallback } from '../../state/types';

type Props = {
  linkMeToCompany: ({ company: number }, options: OptionCallback) => void,
  companyId: number,
  goToConsumerHome: (id: number) => void,
};

export class ConsumerMembershipValidator extends React.Component<Props> {
  componentWillMount() {
    this.props.linkMeToCompany(
      { company: this.props.companyId },
      { onSuccess: () => this.props.goToConsumerHome(this.props.companyId) },
    );
  }

  render() {
    return <ConsumerLoading />;
  }
}

export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  connect(
    (state, { companyId }) => ({
      authenticated: state.auth.authenticated,
      membership: getMembership(state, companyId),
    }),
    {
      fetchMembership,
      linkMeToCompany,
      goToConsumerHome: (id) => push(`/c/${id}/`),
    },
  ),
)(ConsumerMembershipValidator);
