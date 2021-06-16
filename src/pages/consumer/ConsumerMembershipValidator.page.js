// @flow
import React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { getMembership } from '../../libs/membership/selectors';

import ConsumerLoading from '../../libs/consumer-space/components/ConsumerLoading.component';
import MemberShipValidationWrapper from './MemberShipValidationWrapper.component';

type Props = {
  companyId: number,
  goToConsumerHome: (id: number) => void,
  isValidated: boolean,
};

export class ConsumerMembershipValidator extends React.Component<Props> {
  componentWillMount() {
    if (this.props.isValidated) {
      this.props.goToConsumerHome(this.props.companyId);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.isValidated !== this.props.isValidated &&
      this.props.isValidated
    )
      this.props.goToConsumerHome(this.props.companyId);
  }

  render() {
    return (
      <MemberShipValidationWrapper companyId={this.props.companyId}>
        <ConsumerLoading />
      </MemberShipValidationWrapper>
    );
  }
}

export default compose(
  routerParamsToProps({ companyId: 'companyId:number' }),
  connect(
    (state, { companyId }) => ({
      authenticated: state.auth.authenticated,
      membership: getMembership(state, companyId),
      isValidated:
        state.membership.memberShipValidation.missingInformation.validated,
    }),
    {
      goToConsumerHome: (id) => push(`/c/${id}/`),
    },
  ),
)(ConsumerMembershipValidator);
