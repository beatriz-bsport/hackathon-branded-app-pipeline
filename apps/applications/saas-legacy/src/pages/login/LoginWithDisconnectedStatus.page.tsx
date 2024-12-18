import React from 'react';
import { compose } from 'recompose';
import DisconnectedStatus from '#src/libs/login/components/DisconnectedStatus';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import WithCustomCssProvider, {
  Props as WithCustomCssProviderProps,
} from '#src/hocs/company-custom-css.hoc';
import CircularProgress from '#src/components/css-only/CircularProgress';

import './styles.css';

export type Props = {
  authenticated: boolean;
  authenticationLoading: boolean;
  children?: React.ReactElement;
  loginSubtitle: string;
  loginTitle: string;
  onLoginClick: () => void;
  onSignupClick: () => void;
  showSubtitle: boolean;
  showTitle: boolean;
};

const LoginWithDisconnectedStatus: React.FC<Props> = ({
  authenticated,
  authenticationLoading,
  children,
  loginSubtitle,
  loginTitle,
  onLoginClick,
  onSignupClick,
  showSubtitle,
  showTitle,
}) => {
  if (authenticationLoading) {
    return (
      <div className="bs-login-with-disconnected-status__loading__container">
        <CircularProgress />
      </div>
    );
  }
  if (authenticated) {
    return children;
  }

  return (
    <DisconnectedStatus
      loginSubtitle={loginSubtitle}
      loginTitle={loginTitle}
      onLoginClick={onLoginClick}
      onSignupClick={onSignupClick}
      showSubtitle={showSubtitle}
      showTitle={showTitle}
    />
  );
};

export default compose<Props & WithCustomCssProviderProps, Props>(
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(LoginWithDisconnectedStatus);
