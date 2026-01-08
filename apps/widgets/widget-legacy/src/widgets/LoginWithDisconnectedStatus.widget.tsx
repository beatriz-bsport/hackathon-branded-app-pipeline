import React, {
  FC,
  useEffect,
  useMemo,
  useCallback,
  ReactElement,
} from 'react';
import { connect, ConnectedProps } from 'react-redux';

import LoginWithDisconnectedStatusSAAS, {
  Props as SaasProps,
} from '@bsport/saas-legacy/src/pages/login/LoginWithDisconnectedStatus.page';
import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';

import { DisconnectedStatusWidgetConfig } from '@bsport/saas-legacy/src/libs/login/types';
import { bridgeRequestAuthenticationStatus as bridgeRequestAuthenticationStatusAction } from '../libs/bridge/actions';
import type { RootState } from '@bsport/saas-legacy/src/reducers';
import {
  closeUserInteractionPortal as closeUserInteractionPortalAction,
  genericShowLogin as genericShowLoginAction,
  genericShowSignup as genericShowSignupAction,
} from '../libs/modal/actions';
import type { DialogMode } from '../libs/modal/types';
import { DIALOG_MODE_IFRAME } from '@bsport/common/lib/master-data/widget-dialog-mode.js';
import { getMembership } from '@bsport/saas-legacy/src/libs/membership/selectors';
import { fetchMembershipByCompany as fetchMembershipByCompanyAction } from '@bsport/saas-legacy/src/libs/membership/actions';

const LoginWithDisconnectedStatusStyled = themify<SaasProps>(
  LoginWithDisconnectedStatusSAAS,
);

export type OwnProps = {
  children: ReactElement;
  companyId: number;
  config: DisconnectedStatusWidgetConfig;
  dialogMode: DialogMode;
  parentElement: string;
  isBackofficePreview: boolean;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const LoginWithDisconnectedStatus: FC<Props> = ({
  authenticated,
  bridgeRequestAuthenticationStatus,
  children,
  closeUserInteractionPortal,
  companyId,
  config,
  isBackofficePreview,
  parentElement,
  showLogin,
  showSignup,
  fetchMembershipByCompany,
  membership,
}) => {
  useEffect(() => {
    bridgeRequestAuthenticationStatus();
  }, []);

  useEffect(() => {
    if (authenticated) {
      closeUserInteractionPortal();
      fetchMembershipByCompany(companyId);
      bridgeRequestAuthenticationStatus();
    }
  }, [authenticated, companyId]);

  const isAuthenticatedAsMember = useMemo(
    () => !!membership && authenticated,
    [membership, authenticated],
  );

  const onLoginClick = useCallback(() => {
    showLogin({
      dialogMode: DIALOG_MODE_IFRAME,
      widgetType: 'loginWithDisconnectedStatus',
      parentElementId: parentElement,
    });
  }, [showLogin, parentElement]);

  const onSignupClick = useCallback(() => {
    showSignup({
      dialogMode: DIALOG_MODE_IFRAME,
      widgetType: 'loginWithDisconnectedStatus',
      parentElementId: parentElement,
    });
  }, [showSignup, parentElement]);

  if (isBackofficePreview) {
    return (
      <LoginWithDisconnectedStatusStyled
        authenticated={false}
        authenticationLoading={false}
        onLoginClick={undefined}
        loginSubtitle={config?.loginSubtitle || ''}
        loginTitle={config?.loginTitle || ''}
        showSubtitle={!!config?.showSubtitle}
        showTitle={!!config?.showTitle}
        onSignupClick={undefined}
      />
    );
  }

  return (
    <LoginWithDisconnectedStatusStyled
      authenticated={isAuthenticatedAsMember}
      authenticationLoading={false}
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

const mapStateToWidgetProps = (state: RootState, { companyId }: OwnProps) => {
  return {
    authenticated: state.auth.authenticated,
    membership: getMembership(state, companyId),
  };
};

const mapDispatchToWidgetProps = {
  bridgeRequestAuthenticationStatus: bridgeRequestAuthenticationStatusAction,
  showLogin: genericShowLoginAction,
  showSignup: genericShowSignupAction,
  closeUserInteractionPortal: closeUserInteractionPortalAction,
  fetchMembershipByCompany: fetchMembershipByCompanyAction,
};

const connector = connect(mapStateToWidgetProps, mapDispatchToWidgetProps);

export default connector(LoginWithDisconnectedStatus);
