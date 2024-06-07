import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import LoginWithDisconnectedStatusSAAS, {
  Props as SaasProps,
} from 'bsport-saas/src/pages/login/LoginWithDisconnectedStatus.page';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';

import { DisconnectedStatusWidgetConfig } from 'bsport-saas/src/libs/login/types';
import {
  bridgeRequestAuthenticationStatus as bridgeRequestAuthenticationStatusAction,
  createAuthenticatedBridgeAction,
} from '../libs/bridge/actions';
import type { RootState } from '../reducers/index';
import {
  closeUserInteractionPortal as closeUserInteractionPortalAction,
  genericShowLogin as genericShowLoginAction,
  genericShowSignup as genericShowSignupAction,
} from '../libs/modal/actions';
import { getMembershipByCompanyId } from '../libs/bridge/selectors';
import type { DialogMode } from '../libs/modal/types';
import { DIALOG_MODE_IFRAME } from '@bsport/common/lib/master-data/widget-dialog-mode';

const LoginWithDisconnectedStatusStyled = themify<SaasProps>(
  LoginWithDisconnectedStatusSAAS,
);

export type OwnProps = {
  children: React.ReactElement,
  companyId: number,
  config: DisconnectedStatusWidgetConfig,
  dialogMode: DialogMode,
  hideWhenNotLoggedIn: boolean,
  parentElement: string,
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const LoginWithDisconnectedStatus: React.FC<Props> = ({
  authenticated,
  authenticationReceived,
  bridgeRequestAuthenticationStatus,
  children,
  closeUserInteractionPortal,
  companyId,
  config,
  fetchMembershipByCompany,
  hideWhenNotLoggedIn,
  membership,
  parentElement,
  showLogin,
  showSignup,
}) => {
  const prevAuthenticatedRef = React.useRef(false);

  React.useEffect(() => {
    prevAuthenticatedRef.current = authenticated;
  }, [authenticated]);

  React.useEffect(() => {
    bridgeRequestAuthenticationStatus();
    if (authenticated) {
      fetchMembershipByCompany(companyId);
    }
  }, []);

  React.useEffect(() => {
    if (!!prevAuthenticatedRef.current && authenticated) {
      closeUserInteractionPortal();
      fetchMembershipByCompany(companyId);
      bridgeRequestAuthenticationStatus();
    }
  }, [prevAuthenticatedRef.current, authenticated, companyId]);

  const isAuthenticatedAsMember = React.useMemo(
    () => !!membership && authenticated,
    [membership, authenticated],
  );

  const isAuthenticationLoading = React.useMemo(() => {
    if (!authenticated) {
      return !authenticationReceived;
    }
    return !authenticationReceived || !membership;
  }, [authenticated, authenticationReceived, membership]);

  const parentElementDOM = document?.getElementById(parentElement);

  const onLoginClick = React.useCallback(() => {
    showLogin({
      dialogMode: DIALOG_MODE_IFRAME,
      widgetType: 'loginWithDisconnectedStatus',
      parentElementId: parentElement,
    });
  }, [showLogin, parentElement]);

  const onSignupClick = React.useCallback(() => {
    showSignup({
      dialogMode: DIALOG_MODE_IFRAME,
      widgetType: 'loginWithDisconnectedStatus',
      parentElementId: parentElement,
    });
  }, [showSignup, parentElement]);

  if (hideWhenNotLoggedIn && !authenticated && authenticationReceived) {
    parentElementDOM?.style?.setProperty('display', 'none');
    return null;
  }
  parentElementDOM?.style?.removeProperty('display');

  return (
    <LoginWithDisconnectedStatusStyled
      authenticated={isAuthenticatedAsMember}
      authenticationLoading={isAuthenticationLoading}
      onLoginClick={onLoginClick}
      loginSubtitle={config?.loginSubtitle || ''}
      loginTitle={config?.loginTitle || ''}
      showSubtitle={!!config?.showSubtitle}
      showTitle={!!config?.showTitle}
      onSignupClick={onSignupClick}
    >
      {children}
    </LoginWithDisconnectedStatusStyled>
  );
};

const mapStateToWidgetProps = (
  state: RootState,
  { companyId }: { companyId: number },
) => {
  return {
    authenticated: state.bridge.authentication.authenticated,
    authenticationReceived: state.bridge.authentication.hasBeenReceived,
    membership:
      typeof companyId == 'number'
        ? getMembershipByCompanyId(state, companyId)
        : null,
  };
};

const mapDispatchToWidgetProps = {
  bridgeRequestAuthenticationStatus: bridgeRequestAuthenticationStatusAction,
  showLogin: genericShowLoginAction,
  showSignup: genericShowSignupAction,
  closeUserInteractionPortal: closeUserInteractionPortalAction,
  fetchMembershipByCompany: createAuthenticatedBridgeAction(
    'MEMBERSHIP_BY_COMPANY',
  ),
};

const connector = connect(mapStateToWidgetProps, mapDispatchToWidgetProps);

export default connector(LoginWithDisconnectedStatus);
