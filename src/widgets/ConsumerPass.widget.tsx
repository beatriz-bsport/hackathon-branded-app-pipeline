import React from 'react';
import { compose } from 'recompose';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';

import { ConsumerPassWidget } from 'bsport-saas/src/pages/consumer/ConsumerPassReworked.page';

import type { CompanyTheme } from 'bsport-saas/src/libs/theme/types';
import { withStyles, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  getConsumerPassesLoading,
  getConsumerPassesTabDisplay,
  getConsumerPassesTabDisplayLoading,
  getConsumerPassMetadataLoading,
  getMyActiveConsumerPaymentPacksList,
  getMyActiveConsumerPaymentPacksState,
  getMyActivePrivateConsumerPassesList,
  getMyActivePrivateConsumerPassesState,
  getMyActiveUniversalPassesList,
  getMyActiveUniversalPassesState,
  getMyExpiredConsumerPaymentPacksList,
  getMyExpiredConsumerPaymentPacksState,
  getMyExpiredPrivateConsumerPassesList,
  getMyExpiredPrivateConsumerPassesState,
  getMyExpiredUniversalPassesList,
  getMyExpiredUniversalPassesState,
  getMyFutureConsumerPaymentPacksList,
  getMyFutureConsumerPaymentPacksState,
  getMyFuturePrivateConsumerPassesList,
  getMyFuturePrivateConsumerPassesState,
  getMyFutureUniversalPassesList,
  getMyFutureUniversalPassesState,
} from 'bsport-saas/src/libs/consumer-space/selectors';

import { connect } from 'react-redux';
import type { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { resetConsumerState } from 'bsport-saas/src/libs/consumer-space/actions';
import { fetchSCT } from 'bsport-saas/src/libs/category/actions';
import {
  bridgeRequestAuthenticationStatus as bridgeRequestAuthenticationStatusAction,
  createAuthenticatedBridgeAction,
} from '../libs/bridge/actions';
import { getMembershipByCompanyId } from '../libs/bridge/selectors';
import { RootState } from '../reducers/index';
import { adaptSelector } from '../utils/reduxHelpers';

const ConsumerPassWidgetStyled = themify(ConsumerPassWidget);

type OwnProps = {
  companyId: number,
  theme: CompanyTheme,
  authenticated: boolean,
  authenticationReceived: boolean,
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  ReturnType<typeof mapStateToWidgetProps> &
  typeof mapDispatchToWidgetProps;

class ConsumerPass extends React.Component<Props> {
  componentDidMount() {
    this.props.bridgeRequestAuthenticationStatus();
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.props.fetchMembershipByCompany(this.props.companyId);
      this.props.bridgeRequestAuthenticationStatus();
    }
  }

  render() {
    // Temporary.
    // TODO: We need a login screen.
    if (this.props.authenticationReceived && !this.props.authenticated) {
      return <h1>You are not logged in</h1>;
    }
    if (!this.props.authenticationReceived || !this.props.membership) {
      return (
        <div className={this.props.classes.container}>
          <CircularProgress />
        </div>
      );
    }
    return <ConsumerPassWidgetStyled {...this.props} />;
  }
}

const styles = () =>
  createStyles({
    container: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
  });

const mapStateToWidgetProps = (
  state: RootState,
  { companyId }: { companyId: number },
) => {
  return {
    authenticated: state.bridge.authentication.authenticated,
    authenticationReceived: state.bridge.authentication.hasBeenReceived,
    membership: getMembershipByCompanyId(state, companyId),
    consumerPassesTabDisplayLoading: adaptSelector(
      getConsumerPassesTabDisplayLoading,
    )(state),
    consumerPassesLoading: adaptSelector(getConsumerPassesLoading)(state),
    consumerPassesMetadataLoading: adaptSelector(
      getConsumerPassMetadataLoading,
    )(state),
    consumerPassesTabDisplay: adaptSelector(getConsumerPassesTabDisplay)(state),
    myActiveConsumerPaymentPacksList: adaptSelector(
      getMyActiveConsumerPaymentPacksList,
    )(state),
    myFutureConsumerPaymentPacksList: adaptSelector(
      getMyFutureConsumerPaymentPacksList,
    )(state),
    myExpiredConsumerPaymentPacksList: adaptSelector(
      getMyExpiredConsumerPaymentPacksList,
    )(state),
    myActivePrivateConsumerPassesList: adaptSelector(
      getMyActivePrivateConsumerPassesList,
    )(state),
    myFuturePrivateConsumerPassesList: adaptSelector(
      getMyFuturePrivateConsumerPassesList,
    )(state),
    myExpiredPrivateConsumerPassesList: adaptSelector(
      getMyExpiredPrivateConsumerPassesList,
    )(state),
    myActiveUniversalPassesList: adaptSelector(getMyActiveUniversalPassesList)(
      state,
    ),
    myFutureUniversalPassesList: adaptSelector(getMyFutureUniversalPassesList)(
      state,
    ),
    myExpiredUniversalPassesList: adaptSelector(
      getMyExpiredUniversalPassesList,
    )(state),
    myActiveConsumerPaymentPacksState: adaptSelector(
      getMyActiveConsumerPaymentPacksState,
    )(state),
    myFutureConsumerPaymentPacksState: adaptSelector(
      getMyFutureConsumerPaymentPacksState,
    )(state),
    myExpiredConsumerPaymentPacksState: adaptSelector(
      getMyExpiredConsumerPaymentPacksState,
    )(state),
    myActivePrivateConsumerPassesState: adaptSelector(
      getMyActivePrivateConsumerPassesState,
    )(state),
    myFuturePrivateConsumerPassesState: adaptSelector(
      getMyFuturePrivateConsumerPassesState,
    )(state),
    myExpiredPrivateConsumerPassesState: adaptSelector(
      getMyExpiredPrivateConsumerPassesState,
    )(state),
    myActiveUniversalPassesState: adaptSelector(
      getMyActiveUniversalPassesState,
    )(state),
    myFutureUniversalPassesState: adaptSelector(
      getMyFutureUniversalPassesState,
    )(state),
    myExpiredUniversalPassesState: adaptSelector(
      getMyExpiredUniversalPassesState,
    )(state),
  };
};

const mapDispatchToWidgetProps = {
  fetchSCTs: fetchSCT,
  bridgeRequestAuthenticationStatus: bridgeRequestAuthenticationStatusAction,
  fetchMembershipByCompany: createAuthenticatedBridgeAction(
    'MEMBERSHIP_BY_COMPANY',
  ),
  fetchPaymentPackBulk: createAuthenticatedBridgeAction(
    'FETCH_PAYMENT_PACK_BULK',
  ),
  fetchEstablishmentBulk: createAuthenticatedBridgeAction(
    'FETCH_ESTABLISHMENT_BULK',
  ),
  fetchMetaActivityBulk: createAuthenticatedBridgeAction(
    'FETCH_META_ACTIVITY_BULK',
  ),
  fetchRelatedMembersNamesByConsumerPaymentPackLinks: createAuthenticatedBridgeAction(
    'FETCH_RELATED_MEMBERS_NAMES_BY_CONSUMER_PAYMENT_PACK_LINK',
  ),
  fetchRelatedMembersNamesByPrivateConsumerPassLinks: createAuthenticatedBridgeAction(
    'FETCH_RELATED_MEMBERS_NAMES_BY_PRIVATE_CONSUMER_PASS_LINK',
  ),
  fetchPrivatePassBulk: createAuthenticatedBridgeAction(
    'FETCH_PRIVATE_PASS_BULK',
  ),
  fetchPrivateServiceBulk: createAuthenticatedBridgeAction(
    'PRIVATE_SERVICE_BULK',
  ),
  fetchPrivateServiceCompatiblePassList: createAuthenticatedBridgeAction(
    'FETCH_PRIVATE_SERVICE_COMPATIBLE_PASS_LIST',
  ),

  /** REWORKED */
  fetchMyPassesTabs: createAuthenticatedBridgeAction('FETCH_PASSES_TABS'),
  fetchMyActiveConsumerPaymentPacksAsMember: createAuthenticatedBridgeAction(
    'FETCH_ACTIVE_CONSUMER_PAYMENT_PACK_AS_MEMBER',
  ),
  fetchMyActivePrivateConsumerPassesAsMember: createAuthenticatedBridgeAction(
    'FETCH_ACTIVE_PRIVATE_CONSUMER_PASS_AS_MEMBER',
  ),
  fetchMyActiveUniversalPassesAsMember: createAuthenticatedBridgeAction(
    'FETCH_ACTIVE_UNIVERSAL_PASSES_AS_MEMBER',
  ),
  fetchMyExpiredConsumerPaymentPacksAsMember: createAuthenticatedBridgeAction(
    'FETCH_EXPIRED_CONSUMER_PAYMENT_PACK_AS_MEMBER',
  ),
  fetchMyExpiredPrivateConsumerPassesAsMember: createAuthenticatedBridgeAction(
    'FETCH_EXPIRED_PRIVATE_CONSUMER_PASS_AS_MEMBER',
  ),
  fetchMyExpiredUniversalPassesAsMember: createAuthenticatedBridgeAction(
    'FETCH_EXPIRED_UNIVERSAL_PASS_AS_MEMBER',
  ),
  fetchMyFutureConsumerPaymentPacksAsMember: createAuthenticatedBridgeAction(
    'FETCH_FUTURE_CONSUMER_PAYMENT_PACK_AS_MEMBER',
  ),
  fetchMyFuturePrivateConsumerPassesAsMember: createAuthenticatedBridgeAction(
    'FETCH_FUTURE_PRIVATE_CONSUMER_PASS_AS_MEMBER',
  ),
  fetchMyFutureUniversalPassesAsMember: createAuthenticatedBridgeAction(
    'FETCH_FUTURE_UNIVERSAL_PASS_AS_MEMBER',
  ),
  resetConsumerState,
};

export default compose<Props, OwnProps>(
  withStyles(styles),
  connect(mapStateToWidgetProps, mapDispatchToWidgetProps),
)(ConsumerPass);
